import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Recycle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Monitor,
  AlertTriangle,
  Leaf,
  BarChart3,
  Star,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { EnterpriseReportService } from "@/services/EnterpriseReportService";
import type { 
  ReportWidgetData, 
  CollectionTrend, 
  WasteDistribution,
  CollectorPerformance
} from "@/types/enterprise-report";

// ─── Types ───────────────────────────────────────────────────────────────────
type Period = "Week" | "Month" | "Quarter";

// ─── Mock data ────────────────────────────────────────────────────────────────
// ─── Waste Type Mapping ──────────────────────────────────────────────────────
const wasteTypeConfig: Record<string, any> = {
  RECYCLABLE: {
    label: "Recyclables",
    icon: Recycle,
    bg: "bg-linear-to-br from-blue-500 to-blue-700",
  },
  ORGANIC: {
    label: "Organic",
    icon: Leaf,
    bg: "bg-linear-to-br from-green-500 to-green-700",
  },
  E_WASTE: {
    label: "E-Waste",
    icon: Monitor,
    bg: "bg-linear-to-br from-purple-500 to-purple-700",
  },
  HAZARDOUS: {
    label: "Hazardous",
    icon: AlertTriangle,
    bg: "bg-linear-to-br from-red-500 to-red-700",
  },
};

const getDefaultWasteConfig = (type: string) => ({
  label: type.charAt(0) + type.slice(1).toLowerCase(),
  icon: AlertTriangle,
  bg: "bg-linear-to-br from-gray-500 to-gray-700",
});

//Sub-components
interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delta: string;
  positive: boolean;
  label: string;
  value: string;
  index: number;
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  delta,
  positive,
  label,
  value,
  index,
}: StatCardProps) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 cursor-default"
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive ? "text-emerald-500" : "text-red-400"
          }`}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {delta}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EnterpriseReports() {
  const [period, setPeriod] = useState<Period>("Week");
  const [widgetData, setWidgetData] = useState<ReportWidgetData | null>(null);
  const [trends, setTrends] = useState<CollectionTrend[]>([]);
  const [distribution, setDistribution] = useState<WasteDistribution[]>([]);
  const [collectors, setCollectors] = useState<CollectorPerformance[]>([]);
  const [collectorSize, setCollectorSize] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [widgetRes, trendsRes, distRes, collectorsRes] = await Promise.all([
          EnterpriseReportService.getReportWidget(),
          EnterpriseReportService.getCollectionTrends(),
          EnterpriseReportService.getWasteDistribution(),
          EnterpriseReportService.getCollectorPerformance(0, collectorSize)
        ]);

        if (widgetRes.isSuccess) setWidgetData(widgetRes.data);
        if (trendsRes.isSuccess) setTrends(trendsRes.data);
        if (distRes.isSuccess) setDistribution(distRes.data);
        if (collectorsRes.isSuccess) setCollectors(collectorsRes.data.content);
      } catch (error) {
        console.error("Error fetching enterprise report data:", error);
      }
    };

    fetchData();
  }, [period, collectorSize]);

  const statCards: StatCardProps[] = [
    {
      icon: CheckCircle2,
      iconBg: "bg-linear-to-br from-emerald-500 to-emerald-700",
      iconColor: "white",
      delta: "+0%",
      positive: true,
      label: "Total Collections",
      value: widgetData?.totalCollections.toString() || "0",
      index: 0,
    },
    {
      icon: Recycle,
      iconBg: "bg-linear-to-br from-blue-500 to-blue-700",
      iconColor: "white",
      delta: "+0%",
      positive: true,
      label: "Volume Processed",
      value: `${widgetData?.volumeProcessed.toFixed(2) || "0.00"} tons`,
      index: 1,
    },
    {
      icon: Clock,
      iconBg: "bg-linear-to-br from-orange-400 to-orange-600",
      iconColor: "white",
      delta: "0%",
      positive: false,
      label: "Avg Response Time",
      value: `${widgetData?.averageResponseTime.toFixed(1) || "0.0"} mins`,
      index: 2,
    },
    {
      icon: TrendingUp,
      iconBg: "bg-linear-to-br from-purple-500 to-purple-700",
      iconColor: "white",
      delta: "+0%",
      positive: true,
      label: "Citizen Satisfaction",
      value: `${widgetData?.citizenSatisfactionScore.toFixed(0) || "0"}%`,
      index: 3,
    },
  ];

  const chartData = trends.map(t => ({
    label: t.date,
    collections: t.totalCollections,
    volume: 0 // Not provided in trends API
  }));

  const wasteTypes = distribution.map(d => {
    const config = wasteTypeConfig[d.wasteType] || getDefaultWasteConfig(d.wasteType);
    return {
      ...config,
      pct: Math.round(d.percentage),
      color: "white"
    };
  });

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Performance metrics and insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-6"
        >
          {/* Period Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-2">
            {(["Week", "Month", "Quarter"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  period === p
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period === p && (
                  <motion.span
                    layoutId="periodBg"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{p}</span>
              </button>
            ))}
          </div>

          {/* Export */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-[#1a7a4a] hover:bg-[#155f3a] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Download size={15} />
            Export PDF
          </motion.button>
        </motion.div>
      </div>

      {/* ── Body ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="px-8 py-7 max-w-7xl mx-auto space-y-6"
      >
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <AnimatePresence mode="wait">
            {statCards.map((card) => (
              <StatCard key={card.label + period} {...card} />
            ))}
          </AnimatePresence>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-5 gap-4">
          {/* Collection Trends */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            className="col-span-3 bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 text-base">
                Collection Trends
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <BarChart3 size={14} />
                <span>Live data</span>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="h-56"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                      iconType="circle"
                      iconSize={8}
                    />
                    <Line
                      type="monotone"
                      dataKey="collections"
                      name="Collections"
                      stroke="#1a7a4a"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#1a7a4a", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      name="Volume (tons)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                      strokeDasharray="5 4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Waste Distribution */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6"
          >
            <h2 className="font-bold text-gray-900 text-base mb-5">
              Waste Distribution
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {wasteTypes.map((w, i) => (
                <motion.div
                  key={w.label}
                  custom={6 + i}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  className="rounded-xl p-4 flex flex-col gap-2 cursor-default bg-gray-50"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${w.bg}`}
                  >
                    <w.icon size={18} style={{ color: w.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {w.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{w.pct}%</p>
                  </div>
                  {/* mini bar */}
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${w.bg}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${w.pct}%` }}
                      transition={{
                        delay: 0.5 + i * 0.1,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Collector Performance */}
        <motion.div
          custom={10}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 text-base">
              Collector Performance
            </h2>
            <button 
              onClick={() => setCollectorSize(100)}
              className="text-xs font-semibold text-[#1a7a4a] hover:text-[#155f3a] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 border-b border-gray-100 mb-1">
              <span>Collector</span>
              <span>Zone</span>
              <span>Collections</span>
              <span>Efficiency</span>
              <span>Rating</span>
            </div>

            {/* Rows */}
            {collectors.map((c, i) => {
              const efficiencyVariant = c.efficiency >= 90 ? "high" : c.efficiency >= 70 ? "medium" : "low";
              const efficiencyClasses = {
                high: "text-emerald-700 bg-emerald-100",
                medium: "text-amber-700 bg-amber-100",
                low: "text-red-700 bg-red-100",
              };

              return (
                <motion.div
                  key={c.collectorName + i}
                  custom={11 + i}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="grid grid-cols-5 items-center py-4 border-b border-gray-50 last:border-0 rounded-lg px-1 -mx-1 transition-colors cursor-default"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">
                      {c.collectorName}
                    </span>
                  </div>

                  {/* Zone */}
                  <span className="text-sm text-gray-500">{c.zone}</span>

                  {/* Collections */}
                  <span className="text-sm text-gray-800">{c.collections}</span>

                  {/* Efficiency badge */}
                  <div>
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${efficiencyClasses[efficiencyVariant]}`}
                    >
                      {c.efficiency.toFixed(1)}%
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm text-gray-800">{c.rating.toFixed(1)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
