import CitizenMain from "@/components/layout/citizen/CitizenMain";
import PublicMain from "@/components/layout/public/PublicMain";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import CitizenHome from "@/pages/citizen/CitizenHome";
import EnterpriseMain from "@/pages/enterprise/EnterpriseMain";
import About from "@/pages/public/About";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import { createBrowserRouter } from "react-router";

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
    children: [
      { index: true, element: <CitizenHome /> },
      {
        path: "signup",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/enterprise",
    element: <EnterpriseMain />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  }
]);

export default router;
