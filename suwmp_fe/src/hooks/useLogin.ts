import { authInitialized, login } from "@/redux/features/userSlice"
import { useAppDispatch } from "@/redux/hooks"
import { AuthService } from "@/services/AuthService"
import { decodePayLoad, isTokenExpired } from "@/utilities/jwt"
import { useEffect } from "react"

function useLogin() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const reLogin = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                dispatch(authInitialized())
                return
            }

            if (isTokenExpired(token)) {
                const res = await AuthService.refreshToken()
                if (res.success) {
                    const payload = decodePayLoad(res.data.accessToken)
                    dispatch(login({ user: payload, token: res.data.accessToken }))
                } else {
                    dispatch(authInitialized())
                }
            } else {
                const payload = decodePayLoad(token)
                dispatch(login({ user: payload, token }))
            }
        }

        reLogin()
    }, [])
}

export default useLogin