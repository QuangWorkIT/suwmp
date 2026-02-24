import { authInitialized, login } from "@/redux/features/userSlice"
import { useAppDispatch } from "@/redux/hooks"
import { AuthService } from "@/services/AuthService"
import { EnterpriseUserService } from "@/services/EnterpriseUserService"
import type { UserInterface } from "@/types/Users"
import { decodePayLoad, isTokenExpired } from "@/utilities/jwt"
import { useEffect } from "react"


const dispatch = useAppDispatch()
function useLogin() {
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
                    if (payload.role === "ENTERPRISE") {
                        fetchEnterpriseId(payload.id, payload, res.data.accessToken)
                    } else {
                        dispatch(login({ user: payload, token: res.data.accessToken }))
                    }
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

const fetchEnterpriseId = async (id: string, payload: UserInterface, token: string) => {
    const enterpriseData = await EnterpriseUserService.getEnterpriseUserByUserId(id)
    payload.enterpriseId = enterpriseData.data.id
    dispatch(login({ user: payload, token: token }))
}

export default useLogin