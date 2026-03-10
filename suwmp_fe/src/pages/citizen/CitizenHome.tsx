import {
  FileText,
  Award,
  Leaf,
  Recycle,
  MapPin,
  Clock,
  ChevronRight,
  Trophy,
  CircleCheck,
  Truck,
  Circle,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CitizenService } from "../../services/CitizenService";
import type { DashboardWidgetsResponse, MonthlyProgressResponse } from "../../services/CitizenService";
import wasteReportService from "../../services/WasteReportService";
import { LeaderboardService } from "../../services/LeaderboardService";
import type { CitizenWasteReportStatus } from "../../types/WasteReportRequest";
import type { LeaderboardUser } from "../../types/leaderboard";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "COLLECTED": return "bg-green-100 text-green-600";
    case "ACCEPTED":
    case "ASSIGNED": return "bg-blue-100 text-blue-600";
    default: return "bg-yellow-100 text-yellow-600";
  }
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bg }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.10)" }}
      className="bg-white p-5 rounded-xl shadow flex items-center justify-between cursor-default"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${bg}`}
      >
        {icon}
      </div>
    </motion.div>
  );
};

interface ProgressItemProps {
  label: string;
  value: number;
  max: number;
  unit?: string;
  delay: number;
}

const ProgressItem = ({
  label,
  value,
  max,
  unit,
  delay,
}: ProgressItemProps) => {
  const percent = (value / max) * 100;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex-1">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">
          {value}/{max} {unit}
        </span>
      </div>
      <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-green-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{
            delay,
            duration: 1,
            ease: [0.23, 1, 0.32, 1],
          }}
        />
      </div>
    </div>
  );
};

const CitizenHome = () => {
  const [widgets, setWidgets] = useState<DashboardWidgetsResponse | null>(null);
  const [progress, setProgress] = useState<MonthlyProgressResponse | null>(null);
  const [recentReports, setRecentReports] = useState<CitizenWasteReportStatus[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [widgetsRes, progressRes, reportsData, leaderboardRes] = await Promise.all([
          CitizenService.getDashboardWidgets(),
          CitizenService.getMonthlyProgress(),
          wasteReportService.getMyReports(),
          LeaderboardService.getRankings(new Date().toISOString().split('T')[0], 0, 5)
        ]);
        
        // Ensure success property exists or access data directly based on BaseResponse type
        if (widgetsRes?.data) {
          // Some backend endpoints wrap in success, some just return the object directly based on how BaseResponse is typed
          setWidgets(widgetsRes.data);
        } else if (widgetsRes && !('data' in widgetsRes)) {
            // If the response IS the data (e.g. some backend APIs are flattened)
            setWidgets(widgetsRes as unknown as DashboardWidgetsResponse);
        }

        if (progressRes?.data) {
          setProgress(progressRes.data);
        } else if (progressRes && !('data' in progressRes)) {
          setProgress(progressRes as unknown as MonthlyProgressResponse);
        }

        setRecentReports(reportsData || []);
        setLeaderboardData(leaderboardRes || []);
      } catch (error) {
        console.error("Error fetching homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-gray-100 min-h-screen space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Reports"
          value={widgets?.totalReports?.toLocaleString() || "0"}
          icon={<FileText />}
          bg="bg-linear-to-br from-emerald-500 to-emerald-700"
        />

        <StatCard
          title="Reward Points"
          value={widgets?.rewardPoints?.toLocaleString() || "0"}
          icon={<Award />}
          bg="bg-linear-to-br from-orange-500 to-orange-700"
        />

        <StatCard
          title="Total Volume"
          value={widgets?.totalVolume?.toLocaleString() || "0"}
          icon={<Leaf />}
          bg="bg-linear-to-br from-green-400 to-green-600"
        />

        <StatCard
          title="Items Recycled"
          value={widgets?.itemsRecycled?.toLocaleString() || "0"}
          icon={<Recycle />}
          bg="bg-linear-to-br from-blue-500 to-blue-700"
        />
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="col-span-2 bg-white rounded-xl shadow p-6"
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <motion.button
              whileHover={{ x: 3 }}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-black"
            >
              View All <ChevronRight size={16} />
            </motion.button>
          </div>

          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.slice(0, 3).map((report) => (
                <div
                  key={report.id}
                  className="border rounded-xl p-4 flex items-center justify-between hover:shadow transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Recycle className="text-gray-600" />
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{report.wasteTypeName || "Waste Report"}</p>

                        <span
                          className={`flex gap-1.5 items-center px-2 py-1 text-xs rounded-full ${
                            getStatusStyle(report.status)
                          }`}
                        >
                          {report.status === "COLLECTED" && (
                            <CircleCheck className="size-3.5" />
                          )}
                          {(report.status === "ASSIGNED" || report.status === "ACCEPTED") && (
                            <Truck className="size-3.5" />
                          )}
                          {report.status === "PENDING" && (
                            <Circle className="size-3.5" />
                          )}
                          {report.status}
                        </span>
                      </div>

                      <div className="flex text-sm text-gray-500 gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {report.latitude && report.longitude ? `${report.latitude.toFixed(2)}, ${report.longitude.toFixed(2)}` : "Location saved"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="text-gray-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-4 text-center">No recent reports found.</p>
            )}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.28,
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="bg-white rounded-xl shadow p-6"
        >
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Leaderboard</h2>
            <Trophy className="text-orange-500" />
          </div>

          <div className="space-y-4">
            {leaderboardData.slice(0, 5).map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.isCurrentUser ? "bg-green-100 border border-green-200" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 w-4">{user.rank}</span>

                  <div className={`w-9 h-9 rounded-full ${user.avatarColor || 'bg-gray-200'} flex items-center justify-center text-sm font-semibold text-white`}>
                    {user.avatarInitial || user.name.charAt(0)}
                  </div>

                  <span
                    className={user.isCurrentUser ? "text-green-600 font-medium" : ""}
                  >
                    {user.name}
                  </span>
                </div>

                <span className="font-medium">
                  {user.points.toLocaleString()}
                </span>
              </div>
            ))}
            {leaderboardData.length === 0 && (
               <p className="text-gray-500 py-4 text-center">Loading leaderboard...</p>
            )}
          </div>

          <motion.button
            whileHover={{ backgroundColor: "#f9fafb", scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 border rounded-lg py-2 text-sm cursor-pointer"
          >
            View Full Leaderboard
          </motion.button>
        </motion.div>
      </div>

      {/* Monthly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.38,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="bg-white rounded-xl shadow p-6 w-full"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold">Monthly Progress</h2>
            <p className="text-gray-500 text-sm">
              Your recycling goals for January
            </p>
          </div>

          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.55,
              type: "spring",
              stiffness: 300,
            }}
            className="bg-green-100 text-green-700 px-3 py-1 text-sm rounded-full font-medium"
          >
            On Track!
          </motion.span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <ProgressItem
            label="Plastic Recycled"
            value={progress?.currentPlasticKg || 0}
            max={progress?.targetPlasticKg || 15}
            unit="kg"
            delay={0.5}
          />
          <ProgressItem
            label="Reports Submitted"
            value={progress?.currentReports || 0}
            max={progress?.targetReports || 10}
            unit="reports"
            delay={0.65}
          />
          <ProgressItem
            label="Points Earned"
            value={progress?.currentPoints || 0}
            max={progress?.targetPoints || 500}
            unit="pts"
            delay={0.8}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CitizenHome;
