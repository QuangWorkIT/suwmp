import EnterpriseMain from "@/components/layout/enterprise/EnterpriseMain";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";
import EnterpriseDashboard from "@/pages/enterprise/EnterpriseDashboard";
import CollectorManagementPage from "@/pages/enterprise/CollectorManagementPage";
import CollectionRequest from "@/pages/enterprise/CollectionRequest";
import ServiceAreasPage from "@/pages/enterprise/ServiceAreasPage";

export const enterpriseRoutes = [
    {
        element: <ProtectedRoute allowedRoles={["ENTERPRISE"]} />,
        children: [
            {
                path: "/enterprise",
                element: <EnterpriseMain />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: "dashboard", element: <EnterpriseDashboard /> },
                    { path: "collectors", element: <CollectorManagementPage /> },
                    { path: "areas", element: <ServiceAreasPage /> },
                    { path: "requests", element: <CollectionRequest /> },
                ]
            }
        ],
    }
]