import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  MapPin,
  ChevronRight,
  Star,
  Recycle,
  Leaf,
  Zap,
  AlertCircle,
  Circle,
  Truck,
  User,
  Loader2,
} from "lucide-react";
import { CollectorDashboardService } from "@/services/collectors/CollectorDashboardService";
import type { DashboardSummary, DashboardTask, DashboardFeedback } from "@/types/collector-dashboard";

import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCurrentTask, setNextTask } from "@/redux/features/assignedTaskSlice";
import wasteReportService from "@/services/waste-reports/WasteReportService";
import { toast } from "sonner";

type TaskStatus = "In Progress" | "Assigned" | "Completed" | "COLLECTED" | string;

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating
            ? "text-amber-400 fill-amber-400"
            : "text-gray-200 fill-gray-200"
            }`}
        />
      ))}
    </div>
  );
};

const StatusBadge = ({ status }: { status: TaskStatus }) => {
  let label = "Assigned";
  let icon = <Circle className="size-3.5" />;
  let className = "bg-amber-50 text-amber-600 border border-amber-200";

  switch (status?.toUpperCase()) {
    case "IN PROGRESS":
      label = "In Progress";
      icon = <Truck className="size-3.5" />;
      className = "bg-blue-50 text-blue-600 border border-blue-200";
      break;
    case "COMPLETED":
    case "COLLECTED":
      label = "Completed";
      icon = <CheckCircle2 className="size-3.5" />;
      className = "bg-emerald-50 text-emerald-600 border border-emerald-200";
      break;
    default:
      label = status || "Assigned";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};

function PriorityBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200">
      <AlertCircle className="w-3 h-3" />
      Priority
    </span>
  );
}

const getWasteTypeInfo = (wasteType: string) => {
  const type = wasteType?.toLowerCase() || "";
  if (type.includes("organic")) {
    return { color: "bg-linear-to-br from-emerald-700 to-emerald-500", icon: <Leaf className="w-5 h-5 text-white" /> };
  }
  if (type.includes("e-waste") || type.includes("electronic")) {
    return { color: "bg-linear-to-br from-purple-700 to-purple-500", icon: <Zap className="w-5 h-5 text-white" /> };
  }
  if (type.includes("hazardous")) {
    return { color: "bg-red-500", icon: <AlertCircle className="w-5 h-5 text-white" /> };
  }
  return { color: "bg-linear-to-br from-blue-700 to-blue-500", icon: <Recycle className="w-5 h-5 text-white" /> };
};

const CollectorDashboard = () => {
  const user = useAppSelector(state => state.user.user)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming">("Today");

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [feedbacks, setFeedbacks] = useState<DashboardFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [summaryRes, tasksRes, feedbacksRes] = await Promise.all([
          CollectorDashboardService.getSummary(),
          CollectorDashboardService.getTasks(),
          CollectorDashboardService.getFeedbacks(),
        ]);

        if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
        if (tasksRes.success && tasksRes.data) setTasks(tasksRes.data);
        if (feedbacksRes.success && feedbacksRes.data) setFeedbacks(feedbacksRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskClick = async (taskId: number) => {
    try {
      setIsNavigating(true);
      // Fetch full task details since dashboard API only provides summary
      const response = await wasteReportService.getCollectorAssignedTasks(0, 100);
      const allAssignedTasks = response.data;

      const taskIndex = allAssignedTasks.findIndex(t => t.requestId === taskId);
      if (taskIndex !== -1) {
        const task = allAssignedTasks[taskIndex];
        const nextTask = (taskIndex + 1 < allAssignedTasks.length) ? allAssignedTasks[taskIndex + 1] : null;

        dispatch(setCurrentTask(task));
        dispatch(setNextTask(nextTask));
        navigate("/collector/route");
      } else {
        toast.error("Task details not found. Please check your tasks list.");
      }
    } catch (error) {
      console.error("Error navigating to task:", error);
      toast.error("Failed to load task details");
    } finally {
      setIsNavigating(false);
    }
  };

  const statCards = [
    {
      label: "Today's Tasks",
      value: summary?.totalTasksToday.toString() || "0",
      icon: <ClipboardList className="w-6 h-6 text-white" />,
      bg: "bg-linear-to-br from-blue-500 to-blue-700",
      shadow: "shadow-blue-200",
    },
    {
      label: "Completed",
      value: summary?.completedTasksToday.toString() || "0",
      icon: <CheckCircle2 className="w-6 h-6 text-white" />,
      bg: "bg-linear-to-br from-emerald-500 to-emerald-700",
      shadow: "shadow-emerald-200",
    },
    {
      label: "Avg. Response Time",
      value: `${summary?.avgResponseTimeMins || 0} min`,
      icon: <Clock className="w-6 h-6 text-white" />,
      bg: "bg-linear-to-br from-orange-400 to-orange-600",
      shadow: "shadow-orange-200",
    },
    {
      label: "Rating",
      value: `${summary?.averageRating?.toFixed(1) || "0.0"}★`,
      icon: <Award className="w-6 h-6 text-white" />,
      bg: "bg-linear-to-br from-purple-500 to-purple-700",
      shadow: "shadow-purple-200",
    },
  ];

  const displayedTasks = activeTab === "Today" ? tasks : []; // Only Today's tasks are fetched for now

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardHover = {
    rest: { scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
    hover: {
      scale: 1.015,
      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
      transition: { duration: 0.2 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-gray-50 to-green-50/30">
        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  const progressPercentage = Math.min(
    ((summary?.completedTasksToday || 0) / Math.max(summary?.totalTasksToday || 1, 1)) * 100,
    100
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-50 to-green-50/30 p-6 font-sans">
      {/* ── Greeting ── */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Good morning <span className="italic text-blue-500">{user?.fullName}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          You have {summary?.remainingTasksToday || 0} tasks remaining today
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {statCards.map((card) => (
          <motion.div key={card.label}>
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="bg-white rounded-2xl p-5 flex items-center justify-between border border-gray-100 cursor-default"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <motion.div
                className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shadow-md ${card.shadow}`}
                whileHover={{
                  rotate: [0, -8, 8, 0],
                  transition: { duration: 0.4 },
                }}
              >
                {card.icon}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Today's Progress Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <Card className="border border-gray-100 rounded-2xl shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    Today's Progress
                  </h2>
                  <span className="text-sm text-gray-400">
                    {summary?.completedTasksToday || 0}/{summary?.totalTasksToday || 0} tasks
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className="relative h-3 bg-green-100 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-emerald-400 to-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Estimated completion:{" "}
                    <span className="text-gray-700 font-medium">
                      {summary?.estimatedCompletionTime || "N/A"}
                    </span>
                  </p>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                    {summary?.scheduleStatus || "On Schedule"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Tasks Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <Card className="border border-gray-100 rounded-2xl shadow-sm">
              <CardContent>
                {/* Header */}
                <div className="flex items-center justify-between mb-5 mt-2">
                  <h2 className="text-base font-semibold text-gray-900">
                    Active Tasks
                  </h2>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(["Today", "Upcoming"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === tab
                          ? "text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {activeTab === tab && (
                          <motion.div
                            layoutId="tabIndicator"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                            }}
                          />
                        )}
                        <span className="relative z-10">{tab}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task List */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3 max-h-[400px] overflow-y-auto thin-scrollbar"
                  >
                    {displayedTasks.length > 0 ? (
                      displayedTasks.map((task, i) => {
                        const styleInfo = getWasteTypeInfo(task.wasteType);
                        return (
                          <motion.div
                            key={task.taskId}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07, duration: 0.3 }}
                            whileHover={{
                              backgroundColor: "#f8fafc",
                              transition: { duration: 0.15 },
                            }}
                            onClick={() => !isNavigating && handleTaskClick(task.taskId)}
                            className={`flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white cursor-pointer group transition-opacity ${isNavigating ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Icon */}
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styleInfo.color}`}
                              >
                                {styleInfo.icon}
                              </div>

                              {/* Info */}
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {task.wasteType}
                                  </span>
                                  <StatusBadge status={task.status} />
                                  {task.priority && <PriorityBadge />}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {task.distanceKm ? `${task.distanceKm} km` : "N/A"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {task.estimatedMins ? `${task.estimatedMins} mins` : "N/A"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {task.citizenName || "Unknown"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No tasks available for {activeTab.toLowerCase()}.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column — User Feedbacks */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="border border-gray-100 rounded-2xl shadow-sm h-full">
            <CardContent>
              <h2 className="text-base font-semibold text-gray-900 mb-5 mt-2">
                User Feedbacks
              </h2>

              <motion.div
                className="flex flex-col gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {feedbacks.length > 0 ? (
                  feedbacks.map((fb, idx) => (
                    <motion.div
                      key={fb.id || idx}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 cursor-default"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {fb.name || fb.citizenName || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">{fb.date || fb.createdAt || "Recently"}</p>
                        </div>
                        <StarRating rating={fb.rating || 5} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {fb.comment || "No comment provided."}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No feedbacks available yet.
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectorDashboard;
