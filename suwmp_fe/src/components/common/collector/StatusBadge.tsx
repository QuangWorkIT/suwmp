import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ACTIVE" | "INACTIVE" | "IDLE" | "OFFLINE";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "ACTIVE":
        return {
          label: "Active",
          className: "bg-green-100 text-green-700 border-green-200",
          dotColor: "bg-green-500",
        };
      case "IDLE":
        return {
          label: "Idle",
          className: "bg-amber-100 text-amber-700 border-amber-200",
          dotColor: "bg-amber-500",
        };
      case "OFFLINE":
        return {
          label: "Offline",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
        };
      case "INACTIVE":
        return {
          label: "Inactive",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
        };
      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-700 border-gray-200",
          dotColor: "bg-gray-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold border",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full mr-1.5",
          config.dotColor
        )}
      />
      {config.label}
    </Badge>
  );
};
