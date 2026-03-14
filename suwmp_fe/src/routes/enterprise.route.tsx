import EnterpriseMain from "@/components/layout/enterprise/EnterpriseMain";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";
import CollectorManagementPage from "@/pages/enterprise/CollectorManagementPage";
import CollectionRequest from "@/pages/enterprise/CollectionRequest";
import ServiceAreasPage from "@/pages/enterprise/ServiceAreasPage";
import CapacityManagementPage from "@/pages/enterprise/CapacityManagementPage";
import EnterpriseReports from "@/pages/enterprise/EnterpriseReports";
import EnterpriseProfileMain from "@/components/layout/enterprise/profile/EnterpriseProfileMain";
import EnterpriseProfileDetail from "@/components/common/enterprise/EnterpriseProfileDetail";

export const enterpriseRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["ENTERPRISE"]} />,
    children: [
      {
        path: "/enterprise",
        element: <EnterpriseMain />,
        children: [
          { index: true, element: <Navigate to="reports" replace /> },
          { path: "collectors", element: <CollectorManagementPage /> },
          { path: "areas", element: <ServiceAreasPage /> },
          { path: "requests", element: <CollectionRequest /> },
          { path: "capacity", element: <CapacityManagementPage /> },
          { path: "reports", element: <EnterpriseReports /> },
        ],
      },
      {
        path: "/enterprise/profile",
        element: <EnterpriseProfileMain />,
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          { path: "details", element: <EnterpriseProfileDetail /> },
        ],
      },
    ],
  },
];
