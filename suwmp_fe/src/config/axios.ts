import { resolveUser } from "@/hooks/useLogin.js";
import { logoutAction } from "@/redux/features/userSlice.js";
import { decodePayLoad } from "@/utilities/jwt.js";
import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// auto refresh token
let refreshSubscribers: {
  resolve: (newAccessToken: string) => void;
  reject: (error: any) => void;
}[] = []
let isRefreshing = false

const onRefreshed = (newAccessToken: string) => {
  refreshSubscribers.forEach(cb => cb.resolve(newAccessToken))
  refreshSubscribers = []
}

const onRefreshFailed = (error: any) => {
  refreshSubscribers.forEach(cb => cb.reject(error))
  refreshSubscribers = []
}

const addSubscriber = (resolve: (newAccessToken: string) => void, reject: (error: any) => void) => {
  refreshSubscribers.push({ resolve, reject })
}

// add response interceptor
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originRequest = error.config
    if (error.response?.status === 401
      && error.response.data?.message?.includes("Invalid or expired JWT")
      && !originRequest._retry
    ) {
      // try only 1 refresh
      originRequest._retry = true

      // add request to queue if it is refreshing and wait for new token
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newAccessToken: string) => {
            originRequest.headers.Authorization = `Bearer ${newAccessToken}`
            resolve(authClient(originRequest))
          }, (error: any) => {
            reject(error)
          })
        })
      }

      isRefreshing = true

      try {
        const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/auth/refresh-token`, {}, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        const data = response.data.data
        const { store } = await import('../redux/store.js') // delay import preventing import circular error

        const newToken: string = data.accessToken
        const payload = decodePayLoad(newToken)
        localStorage.setItem("token", newToken)
        await resolveUser(store.dispatch, payload, newToken)

        // execute waiting requests
        onRefreshed(newToken)
        console.log("refresh")
        originRequest.headers.Authorization = `Bearer ${newToken}`
        return authClient(originRequest)
      } catch (error) {
        const { store } = await import('../redux/store.js') // delay import

        // execute failure callbacks for waiting requests
        onRefreshFailed(error)

        // logout if refresh is failed
        store.dispatch(logoutAction())
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // reject error if not 401
    return Promise.reject(error)
  }
)
export default authClient;
