import CitizenMain from "@/components/layout/citizen/CitizenMain";
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from "react-router";
import CitizenHome from "@/pages/citizen/CitizenHome";
import ReportHistory from "@/pages/citizen/ReportHistory";
import LeaderBoard from "@/pages/citizen/LeaderBoard";
import FeedBack from "@/pages/citizen/FeedBack";
import WasteReportProcess from "@/pages/citizen/WasteReportProcess";

export const citizenRoutes = [
    {
        element: <ProtectedRoute allowedRoles={["CITIZEN"]} />,
        children: [
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
            }
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["CITIZEN"]} />,
        children: [
            { path: "/citizen/new-report", element: <WasteReportProcess /> },
        ],
    },
]