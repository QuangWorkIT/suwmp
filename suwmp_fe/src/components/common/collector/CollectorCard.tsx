import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Mail, Phone, Star, Pencil, ClipboardList } from "lucide-react";
import type { Collector } from "@/types/collector";

interface CollectorCardProps {
  collector: Collector;
  onEdit: (collector: Collector) => void;
  onViewTasks?: (collector: Collector) => void;
}

export const CollectorCard = ({
  collector,
  onEdit,
  onViewTasks,
}: CollectorCardProps) => {
  const getInitial = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for metrics (these would come from separate API endpoints)
  const tasksCompleted = 3;
  const tasksTotal = 5;
  const collections = 245;
  const rating = 4.8;
  const efficiency = 94;
  const zone = "Zone A"; // This would come from collector data or separate API

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border-0 shadow-md h-full">
        <CardContent className="p-6">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-semibold shadow-sm">
              {getInitial(collector.fullName)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate">
                {collector.fullName}
              </h3>
            </div>
            {/* Status Badge */}
            <StatusBadge status={collector.status} />
          </div>

          {/* Contact Info */}
          <div className="space-y-2.5 text-sm mb-4">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-primary" />
              </div>
              <span className="truncate">{zone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                <Mail className="w-3 h-3 text-primary" />
              </div>
              <span className="truncate">{collector.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                <Phone className="w-3 h-3 text-primary" />
              </div>
              <span className="truncate">{collector.phone}</span>
            </div>
          </div>



          {/* Today's Tasks */}
          <div className="space-y-3 mb-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Today's Tasks
                </p>
              </div>
              <span className="text-base font-semibold text-foreground">
                {tasksCompleted}/{tasksTotal}
              </span>
            </div>
            <div className="relative w-full overflow-hidden rounded-full bg-primary/10 h-2">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(tasksCompleted / tasksTotal) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-border">
            <div>
              <p className="text-xl font-bold text-foreground">{collections}</p>
              <p className="text-xs text-muted-foreground mt-1">Collections</p>
            </div>
            <div>
              <div className="text-xl font-bold flex items-center justify-center gap-1 text-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                {rating}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">
                {efficiency}
                <span className="text-sm font-normal">%</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Efficiency</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onEdit(collector)}
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              Edit
            </Button>
            {onViewTasks && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onViewTasks(collector)}
              >
                <ClipboardList className="w-4 h-4 mr-1.5" />
                Tasks
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
