import CitizenMain from "@/components/layout/citizen/CitizenMain";
import PublicMain from "@/components/layout/public/PublicMain";
import CitizenHome from "@/pages/citizen/CitizenHome";
import FeedBack from "@/pages/citizen/FeedBack";
import LeaderBoard from "@/pages/citizen/LeaderBoard";
import ReportHistory from "@/pages/citizen/ReportHistory";
import WasteReportProcess from "@/pages/citizen/WasteReportProcess";
import About from "@/pages/public/About";
import PublicHome from "@/pages/public/PublicHome";
import WasteguidePage from "@/pages/public/WasteguidePage";
import { createBrowserRouter, Navigate } from "react-router";


const router = createBrowserRouter([
    {
        path: "/",
        element: <PublicMain />,
        children: [
            { index: true, element: <PublicHome /> },
            { path: "wasteguide", element: <WasteguidePage /> },
            { path: "about", element: <About /> }
        ]
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
        ]
    },
    { path: "/citizen/new-report", element: <WasteReportProcess /> }
])

export default router