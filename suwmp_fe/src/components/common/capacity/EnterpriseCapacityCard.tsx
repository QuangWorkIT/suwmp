import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { EnterpriseCapacity, UpdateEnterpriseCapacityRequest } from "@/types/enterpriseCapacity";
import { Check, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatKg,
  formatWasteTypeName,
  generateColorFromWasteType,
  getCapacityStatus,
  getUtilizationPct,
  safePct,
} from "@/utilities/capacityUtils";

function statusPill(status: ReturnType<typeof getCapacityStatus>) {
  switch (status) {
    case "CRITICAL":
      return {
        label: "Critical",
        className: "bg-red-100 text-red-800 border border-red-200",
      };
    case "WARNING":
      return {
        label: "Warning",
        className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      };
    default:
      return {
        label: "Normal",
        className: "bg-green-100 text-green-700 border border-green-200",
      };
  }
}

export default function EnterpriseCapacityCard({
  item,
  onUpdate,
  onDelete,
  usedKg,
}: {
  item: EnterpriseCapacity;
  onUpdate: (id: number, data: UpdateEnterpriseCapacityRequest) => void;
  onDelete: (item: EnterpriseCapacity) => void;
  usedKg: number;
}) {
  const [localCapacity, setLocalCapacity] = useState(item.dailyCapacityKg);
  const [localThreshold, setLocalThreshold] = useState(item.warningThreshold);
  const [localIsActive, setLocalIsActive] = useState(item.active);

  useEffect(() => {
    setLocalCapacity(item.dailyCapacityKg);
    setLocalThreshold(item.warningThreshold);
    setLocalIsActive(item.active);
  }, [item]);

  // Check if dirty
  const isDirty =
    localCapacity !== item.dailyCapacityKg ||
    localThreshold !== item.warningThreshold ||
    localIsActive !== item.active;

  const handleSave = () => {
    onUpdate(item.id, {
      dailyCapacityKg: localCapacity,
      warningThreshold: localThreshold,
      active: localIsActive,
    });
  };

  const handleCancel = () => {
    setLocalCapacity(item.dailyCapacityKg);
    setLocalThreshold(item.warningThreshold);
    setLocalIsActive(item.active);
  };

  const barColor = generateColorFromWasteType(
    item.wasteTypeId,
    item.wasteTypeName,
  );
  // Calculate status/utilization based on LOCAL values to show preview
  const previewItem = { ...item, dailyCapacityKg: localCapacity, warningThreshold: localThreshold, active: localIsActive };
  const status = getCapacityStatus(usedKg,previewItem);
  const statusMeta = statusPill(status);

  // Utilization depends on usedKg (static) vs localCapacity
  const utilization = getUtilizationPct(usedKg, localCapacity);
  const threshold = safePct(localThreshold);

  return (
    <Card className={cn("border-0 shadow-md transition-all", !localIsActive && "opacity-60")}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="text-base">{formatWasteTypeName(item.wasteTypeName)}</CardTitle>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <span>{formatKg(usedKg)} / </span>
               {/* Inline Edit for Capacity */}
              <div className="relative w-24">
                 <Input
                    type="number"
                    value={localCapacity}
                    onChange={(e) => setLocalCapacity(Number(e.target.value))}
                    className="h-6 px-1 py-0 text-right text-sm"
                    min={1}
                 />
              </div>
              <span>kg</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "h-6 rounded-full px-3 text-xs font-semibold",
                statusMeta.className,
              )}
            >
              {statusMeta.label}
            </Badge>

            {/* Save/Cancel Controls */}
            {isDirty && (
              <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                <Button
                  size="icon-sm"
                  onClick={handleSave}
                  className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  title="Save changes"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={handleCancel}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    title="Undo changes"
                >
                    <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {!isDirty && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(item)}
                    title="Delete"
                    className="text-muted-foreground hover:text-destructive ml-1"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Usage</span>
            <span className="font-medium text-foreground">
              {Math.round(utilization)}%
            </span>
          </div>

          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted ring-1 ring-foreground/5">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${utilization}%`, backgroundColor: barColor }}
            />
            {/* threshold marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-500/80"
              style={{ left: `${threshold}%` }}
              title={`Threshold: ${threshold}%`}
            />
          </div>

           {/* Remove separate threshold text line if redundant */}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Warning Threshold</div>
            <div className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 rounded">{threshold}%</div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setLocalThreshold(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer hover:accent-primary/80 transition-colors"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Status</div>
            <div className="text-xs text-muted-foreground">
              {localIsActive ? "Collecting waste" : "Suspended"}
            </div>
          </div>

          <button
            type="button"
            aria-pressed={localIsActive}
            onClick={() => setLocalIsActive(!localIsActive)}
            className={cn(
              "h-6 w-11 rounded-full p-0.5 ring-1 ring-foreground/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              localIsActive ? "bg-primary" : "bg-muted",
            )}
            title="Toggle active status"
          >
            <span
              className={cn(
                "block h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200",
                localIsActive ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
