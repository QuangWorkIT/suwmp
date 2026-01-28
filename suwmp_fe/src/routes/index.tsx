import PublicMain from "@/components/layout/public/PublicMain";
import ForgotPasswordPage from "@/pages/authentication/ForgotPasswordPage";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import PublicHome from "@/pages/public/PublicHome";
import About from "@/pages/public/About";
import WasteguidePage from "@/pages/public/WasteguidePage";
import ResetPasswordPage from "@/pages/authentication/ResetPasswordPage";
import { citizenRoutes } from "./citizent.route";
import { enterpriseRoutes } from "./enterprise.route";
import { createBrowserRouter } from "react-router";
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
