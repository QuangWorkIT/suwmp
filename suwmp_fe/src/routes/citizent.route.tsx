import { lazy, Suspense } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import PageLoading from "@/components/common/PageLoading";

// lazy components
const CitizenMain = lazy(() => import("@/components/layout/citizen/CitizenMain"));
const CitizenHome = lazy(() => import("@/pages/citizen/CitizenHome"));
const ReportHistory = lazy(() => import("@/pages/citizen/ReportHistory"));
const LeaderBoard = lazy(() => import("@/pages/citizen/LeaderBoard"));
const FeedBack = lazy(() => import("@/pages/citizen/FeedBack"));
const WasteReportProcess = lazy(() => import("@/pages/citizen/WasteReportProcess"));
const ReportStatusPage = lazy(() => import("@/pages/citizen/ReportStatusPage"));

const CitizenProfileMain = lazy(() => import("@/components/layout/citizen/profile/CitizenProfileMain"));
const ProfileDetail = lazy(() => import("@/components/common/citizen/profile/ProfileDetail"));

const Loader = () => <PageLoading />;

export const citizenRoutes = [
  {
    element: <ProtectedRoute allowedRoles={["CITIZEN"]} />,
    children: [
      {
        path: "/citizen",
        element: (
          <Suspense fallback={<Loader />}>
            <CitizenMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loader />}>
                <CitizenHome />
              </Suspense>
            ),
          },
          {
            path: "reports",
            element: (
              <Suspense fallback={<Loader />}>
                <ReportHistory />
              </Suspense>
            ),
          },
          {
            path: "reports/:id",
            element: (
              <Suspense fallback={<Loader />}>
                <ReportStatusPage />
              </Suspense>
            ),
          },
          {
            path: "leaderboard",
            element: (
              <Suspense fallback={<Loader />}>
                <LeaderBoard />
              </Suspense>
            ),
          },
          {
            path: "feedback",
            element: (
              <Suspense fallback={<Loader />}>
                <FeedBack />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["CITIZEN"]} />,
    children: [
      {
        path: "/citizen/new-report",
        element: (
          <Suspense fallback={<Loader />}>
            <WasteReportProcess />
          </Suspense>
        ),
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["CITIZEN"]} />,
    children: [
      {
        path: "/citizen/profile",
        element: (
          <Suspense fallback={<Loader />}>
            <CitizenProfileMain />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="details" replace />,
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loader />}>
                <ProfileDetail />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
