import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PageLoading from "@/components/common/PageLoading";
import EnterpriseProfileMain from "@/components/layout/enterprise/profile/EnterpriseProfileMain";
import EnterpriseProfileDetail from "@/components/common/enterprise/EnterpriseProfileDetail";

// lazy imports
const EnterpriseMain = lazy(() => import("@/components/layout/enterprise/EnterpriseMain"));
const CollectorManagementPage = lazy(() => import("@/pages/enterprise/CollectorManagementPage"));
const CollectionRequest = lazy(() => import("@/pages/enterprise/CollectionRequest"));
const ServiceAreasPage = lazy(() => import("@/pages/enterprise/ServiceAreasPage"));
const CapacityManagementPage = lazy(() => import("@/pages/enterprise/CapacityManagementPage"));
const EnterpriseReports = lazy(() => import("@/pages/enterprise/EnterpriseReports"));

const Loader = () => <PageLoading />;

export const enterpriseRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["ENTERPRISE"]} />,
    children: [
      {
        path: "/enterprise",
        element: (
          <Suspense fallback={<Loader />}>
            <EnterpriseMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="reports" replace />,
          },
          {
            path: "collectors",
            element: (
              <Suspense fallback={<Loader />}>
                <CollectorManagementPage />
              </Suspense>
            ),
          },
          {
            path: "areas",
            element: (
              <Suspense fallback={<Loader />}>
                <ServiceAreasPage />
              </Suspense>
            ),
          },
          {
            path: "requests",
            element: (
              <Suspense fallback={<Loader />}>
                <CollectionRequest />
              </Suspense>
            ),
          },
          {
            path: "capacity",
            element: (
              <Suspense fallback={<Loader />}>
                <CapacityManagementPage />
              </Suspense>
            ),
          },
          {
            path: "reports",
            element: (
              <Suspense fallback={<Loader />}>
                <EnterpriseReports />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["ENTERPRISE"]} />,
    children: [
      {
        path: "/enterprise/profile",
        element: (
          <Suspense fallback={<Loader />}>
            <EnterpriseProfileMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loader />}>
                <EnterpriseProfileDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  }
];
