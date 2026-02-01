import { authInitialized, login } from "@/redux/features/userSlice"
import { useAppDispatch } from "@/redux/hooks"
import { decodePayLoad } from "@/utilities/jwt"
import { useEffect } from "react"

function useLogin() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const payload = decodePayLoad(token)
            dispatch(login({ user: payload, token }))
        }else{
            dispatch(authInitialized())
        }
    }, [])
}

export default useLogin