import CitizenMain from "@/components/layout/citizen/CitizenMain";
import EnterpriseMain from "@/components/layout/enterprise/EnterpriseMain";
import PublicMain from "@/components/layout/public/PublicMain";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import CitizenHome from "@/pages/citizen/CitizenHome";
import About from "@/pages/public/About";
import ForgotPasswordPage from "@/pages/authentication/ForgotPasswordPage";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import { createBrowserRouter } from "react-router";
import ResetPasswordPage from "@/pages/authentication/ResetPasswordPage";

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
  {
    path: "/citizen",
    element: <CitizenMain />,
    children: [{ index: true, element: <CitizenHome /> }],
  },
  {
    path: "/enterprise",
    element: <EnterpriseMain />,
  },
  {
    path: "signup",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;
