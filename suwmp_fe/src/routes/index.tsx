import CitizenMain from "@/components/layout/citizen/CitizenMain";
import EnterpriseMain from "@/components/layout/enterprise/EnterpriseMain";
import PublicMain from "@/components/layout/public/PublicMain";
import ForgotPasswordPage from "@/pages/authentication/ForgotPasswordPage";
import LoginPage from "@/pages/authentication/LoginPage";
import RegisterPage from "@/pages/authentication/RegisterPage";
import CitizenHome from "@/pages/citizen/CitizenHome";
import FeedBack from "@/pages/citizen/FeedBack";
import LeaderBoard from "@/pages/citizen/LeaderBoard";
import ReportHistory from "@/pages/citizen/ReportHistory";
import WasteReportProcess from "@/pages/citizen/WasteReportProcess";
import CollectorManagementPage from "@/pages/enterprise/CollectorManagementPage";
import ServiceAreasPage from "@/pages/enterprise/ServiceAreasPage";
import About from "@/pages/public/About";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import { createBrowserRouter, Navigate } from "react-router";

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
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <CitizenHome /> },
      { path: "reports", element: <ReportHistory /> },
      { path: "leaderboard", element: <LeaderBoard /> },
      { path: "feedback", element: <FeedBack /> },
    ],
  },
  { path: "/citizen/new-report", element: <WasteReportProcess /> },
  {
    path: "/enterprise",
    element: <EnterpriseMain />,
    children: [
      { index: true, element: <Navigate to="collectors" replace /> },
      { path: "collectors", element: <CollectorManagementPage /> },
      { path: "areas", element: <ServiceAreasPage /> },
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
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

export default router;
