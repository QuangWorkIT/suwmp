import PageLoading from "@/components/common/PageLoading";
import { useAppSelector } from "@/redux/hooks";
import { Navigate, Outlet } from "react-router";

function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
    const { user, initialized } = useAppSelector(state => state.user)

    if(!initialized)
        return <PageLoading />

    if (!user) {
        return <Navigate to="/signin" replace />
    }
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }
    return <Outlet />
}

export default ProtectedRoute