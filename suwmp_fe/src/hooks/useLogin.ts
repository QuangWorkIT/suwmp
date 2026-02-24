import { authInitialized, login } from "@/redux/features/userSlice"
import { useAppDispatch } from "@/redux/hooks"
import { AuthService } from "@/services/AuthService"
import { EnterpriseUserService } from "@/services/EnterpriseUserService"
import type { UserInterface } from "@/types/Users"
import type { AppDispath } from "@/redux/store"
import { decodePayLoad, isTokenExpired } from "@/utilities/jwt"
import { useEffect } from "react"

/**
 * Resolves the full user object and dispatches `login`.
 * For ENTERPRISE users, fetches their enterpriseId before dispatching.
 */
export const resolveUser = async (
    dispatch: AppDispath,
    payload: UserInterface,
    token: string
) => {
    if (payload.role === "ENTERPRISE") {
        const enterpriseData =
            await EnterpriseUserService.getEnterpriseUserByUserId(payload.id)

        dispatch(
            login({
                user: { ...payload, enterpriseId: enterpriseData.data.id },
                token,
            })
        )
    } else {
        dispatch(login({ user: payload, token }))
    }
}

/**
 * Obtains a valid access token (refreshing if expired), resolves the user,
 * and dispatches `login` into Redux. Always dispatches `authInitialized`
 * so the app never stays in an uninitialized state.
 */
function useLogin() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem("token")

                if (!storedToken) {
                    dispatch(authInitialized())
                    return
                }

                // If the token is still valid, reuse it directly
                if (!isTokenExpired(storedToken)) {
                    const payload = decodePayLoad(storedToken)
                    await resolveUser(dispatch, payload, storedToken)
                    return
                }

                // Token expired — attempt a refresh
                const res = await AuthService.refreshToken()

                if (!res.success) {
                    localStorage.removeItem("token")
                    dispatch(authInitialized())
                    return
                }

                const newToken: string = res.data.accessToken
                const payload = decodePayLoad(newToken)
                await resolveUser(dispatch, payload, newToken)
            } catch {
                localStorage.removeItem("token")
                dispatch(authInitialized())
            }
        }

        initAuth()
    }, [dispatch])
}

export default useLogin