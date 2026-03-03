import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";
import CollectorMain from "@/components/layout/collector/CollectorMain";
import CollectorDashboard from "@/pages/collector/CollectorDashboard";
import CollectorTask from "@/pages/collector/CollectorTask";
import RouteMap from "@/pages/collector/RouteMap";
import CollectionHistory from "@/pages/collector/CollectionHistory";

export const collectorRoutes = [
    {
        element: <ProtectedRoute allowedRoles={["COLLECTOR"]} />,
        children: [
            {
                path: "/collector",
                element: <CollectorMain />,
                children: [
                    { index: true, element: <Navigate to="dashboard" replace /> },
                    { path: "dashboard", element: <CollectorDashboard /> },
                    { path: "tasks", element: <CollectorTask /> },
                    { path: "route", element: <RouteMap /> },
                    { path: "history", element: <CollectionHistory /> }
                ]
            }
        ],
    }
]