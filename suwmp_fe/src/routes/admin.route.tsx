import { AdminMain } from "@/components/layout/admin";
import { AdminDashboardPage, UserManagementPage, WasteCategoriesPage } from "@/pages/admin";
import { Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import ComplaintsPage from "@/pages/admin/ComplaintPage";

export const adminRoutes = [
    {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminMain />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: "dashboard", element: <AdminDashboardPage /> },
                    { path: "users", element: <UserManagementPage /> },
                    { path: "waste-categories", element: <WasteCategoriesPage /> },
                    { path: "regions", element: <div>Regions & Zones</div> },
                    { path: "policies", element: <div>Policies</div> },
                    { path: "complaints", element: <ComplaintsPage /> },
                    { path: "audit-logs", element: <div>Audit Logs</div> },
                    { path: "analytics", element: <div>Analytics</div> },
                    { path: "access-control", element: <div>Access Control</div> },
                ],
            },
        ],
    },
];
