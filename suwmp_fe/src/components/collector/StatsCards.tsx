import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, ClipboardList, Star } from "lucide-react";
import type { CollectorStats } from "@/types/collector";

interface StatsCardsProps {
  stats: CollectorStats;
}

const statConfig = [
  {
    label: "Total Collectors",
    value: (stats: CollectorStats) => stats.totalCollectors.toString(),
    icon: Users,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Active Now",
    value: (stats: CollectorStats) => stats.activeNow.toString(),
    icon: Activity,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    label: "Tasks Today",
    value: (stats: CollectorStats) => stats.tasksToday.toString(),
    icon: ClipboardList,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Avg. Rating",
    value: (stats: CollectorStats) => stats.avgRating.toFixed(1),
    icon: Star,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardContent className="p-6">
                <div className={`mb-4 w-fit rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value(stats)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
