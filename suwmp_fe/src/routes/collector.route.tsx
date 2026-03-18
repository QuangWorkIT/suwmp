import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PageLoading from "@/components/common/PageLoading";

// lazy imports
const CollectorMain = lazy(() => import("@/components/layout/collector/CollectorMain"));
const CollectorDashboard = lazy(() => import("@/pages/collector/CollectorDashboard"));
const CollectorTask = lazy(() => import("@/pages/collector/CollectorTask"));
const RouteMap = lazy(() => import("@/pages/collector/RouteMap"));
const CollectionHistory = lazy(() => import("@/pages/collector/CollectionHistory"));

const Loader = () => <PageLoading />;

export const collectorRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["COLLECTOR"]} />,
    children: [
      {
        path: "/collector",
        element: (
          <Suspense fallback={<Loader />}>
            <CollectorMain />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loader />}>
                <CollectorDashboard />
              </Suspense>
            ),
          },
          {
            path: "tasks",
            element: (
              <Suspense fallback={<Loader />}>
                <CollectorTask />
              </Suspense>
            ),
          },
          {
            path: "route",
            element: (
              <Suspense fallback={<Loader />}>
                <RouteMap />
              </Suspense>
            ),
          },
          {
            path: "history",
            element: (
              <Suspense fallback={<Loader />}>
                <CollectionHistory />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];