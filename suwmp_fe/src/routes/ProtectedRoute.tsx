import PageLoading from "@/components/common/PageLoading";
import { useAppSelector } from "@/redux/hooks";
import { Navigate, Outlet } from "react-router";
import { toast } from "sonner";

function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
    const { user, initialized } = useAppSelector(state => state.user)

    if (!initialized)
        return <PageLoading />

    if (!user) {
        toast.error("Please login to access services!", { id: "auth-error" })
        return <Navigate to="/signin" replace />
    }
    if (!allowedRoles.includes(user.role)) {
        toast.error("You are not authorized to access this page!", { id: "auth-forbidden" })
        return <Navigate to="/unauthorized" replace />
    }
    return <Outlet />
}

export default ProtectedRoute