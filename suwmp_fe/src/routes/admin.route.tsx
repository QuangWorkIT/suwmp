import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PageLoading from "@/components/common/PageLoading";

// lazy imports
const AdminMain = lazy(() => import("@/components/layout/admin").then(m => ({ default: m.AdminMain })));

const AdminDashboardPage = lazy(() =>
  import("@/pages/admin").then(m => ({ default: m.AdminDashboardPage }))
);
const UserManagementPage = lazy(() =>
  import("@/pages/admin").then(m => ({ default: m.UserManagementPage }))
);
const WasteCategoriesPage = lazy(() =>
  import("@/pages/admin").then(m => ({ default: m.WasteCategoriesPage }))
);

const ComplaintsPage = lazy(() => import("@/pages/admin/ComplaintPage"));

const Loader = () => <PageLoading />;

export const adminRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: (
          <Suspense fallback={<Loader />}>
            <AdminMain />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },

          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loader />}>
                <AdminDashboardPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            element: (
              <Suspense fallback={<Loader />}>
                <UserManagementPage />
              </Suspense>
            ),
          },
          {
            path: "waste-categories",
            element: (
              <Suspense fallback={<Loader />}>
                <WasteCategoriesPage />
              </Suspense>
            ),
          },
          {
            path: "complaints",
            element: (
              <Suspense fallback={<Loader />}>
                <ComplaintsPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
