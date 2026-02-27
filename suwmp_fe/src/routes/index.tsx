import PublicMain from "@/components/layout/public/PublicMain";
import ForgotPasswordPage from "@/pages/authentication/ForgotPasswordPage";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import About from "@/pages/public/About";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import ResetPasswordPage from "@/pages/authentication/ResetPasswordPage";
import { citizenRoutes } from "./citizent.route";
import { enterpriseRoutes } from "./enterprise.route";
import { adminRoutes } from "./admin.route";
import { createBrowserRouter } from "react-router";
import UnAuthorizedPage from "@/pages/error/UnAuthorizedPage";
import { collectorRoutes } from "./collector.route";


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

  // routes base on role
  ...citizenRoutes,
  ...enterpriseRoutes,
  ...adminRoutes,
  ...collectorRoutes,

  // authentication routes
  { path: "/signup", element: <RegisterPage /> },
  { path: "/signin", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  // error routes
  { path: "/unauthorized", element: <UnAuthorizedPage /> }
]);

export default router;