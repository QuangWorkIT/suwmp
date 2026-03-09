import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaType?: "percentage" | "absolute";
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  statusText?: string;
  loading?: boolean;
  error?: string | null;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  deltaType = "absolute",
  icon: Icon,
  iconBgColor,
  iconColor,
  statusText,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card className="overflow-hidden border-none shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-none shadow-sm bg-white border-red-50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-red-400 mb-1">{title}</p>
              <p className="text-xs text-red-500 font-medium leading-tight max-w-[140px]">Error loading data</p>
            </div>
            <div className={`p-3 rounded-xl bg-red-50`}>
              <Icon size={24} className="text-red-400 opacity-50" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }


  const isPositive = delta && delta > 0;
  const isNegative = delta && delta < 0;

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {value !== undefined && value !== null ? value : "—"}
            </h3>
            
            <div className="flex items-center mt-2">
              {delta !== undefined && (
                <div
                  className={`flex items-center text-xs font-medium mr-2 ${
                    isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
                  }`}
                >
                  {isPositive && <ArrowUp size={12} className="mr-0.5" />}
                  {isNegative && <ArrowDown size={12} className="mr-0.5" />}
                  <span>
                    {isPositive ? "+" : ""}
                    {delta}
                    {deltaType === "percentage" ? "%" : ""}
                  </span>
                </div>
              )}
              {statusText && (
                <span className="text-xs text-blue-600 font-medium">{statusText}</span>
              )}
            </div>
          </div>
          
          <div className={`p-3 rounded-xl ${iconBgColor}`}>
            <Icon size={24} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
