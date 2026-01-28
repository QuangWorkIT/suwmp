import PublicMain from "@/components/layout/public/PublicMain";
import AdminMain from "@/components/layout/admin/AdminMain";
import ForgotPasswordPage from "@/pages/authentication/ForgotPasswordPage";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import { AdminDashboardPage, UserManagementPage, WasteCategoriesPage } from "@/pages/admin";
import About from "@/pages/public/About";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import ResetPasswordPage from "@/pages/authentication/ResetPasswordPage";
import { citizenRoutes } from "./citizent.route";
import { enterpriseRoutes } from "./enterprise.route";
import { createBrowserRouter, Navigate } from "react-router";
import UnAuthorizedPage from "@/pages/error/UnAuthorizedPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicMain />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: "wasteguide", element: <WasteguidePage /> },
      { path: "about", element: <About /> },
    ],
  },

  ...citizenRoutes,
  ...enterpriseRoutes,

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
      { path: "complaints", element: <div>Complaints</div> },
      { path: "audit-logs", element: <div>Audit Logs</div> },
      { path: "analytics", element: <div>Analytics</div> },
      { path: "access-control", element: <div>Access Control</div> },
    ],
  },
  { path: "/signup", element: <RegisterPage /> },
  { path: "/signin", element: <LoginPage /> },

  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  { path: "/unauthorized", element: <UnAuthorizedPage /> }
]);

export default router;
