import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { EnterpriseCapacity } from "@/types/enterpriseCapacity";
import {
  formatKg,
  generateColorFromWasteType,
  getCapacityStatus,
  getUtilizationPct,
} from "@/utilities/capacityUtils";

function statusPillClass(status: ReturnType<typeof getCapacityStatus>) {
  switch (status) {
    case "WARNING":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    default:
      return "bg-green-100 text-green-700 border border-green-200";
  }
}

export default function OverallCapacityCard({
  items,
  isLoading,
}: {
  items: EnterpriseCapacity[];
  isLoading?: boolean;
}) {
  const totalCapacity = items.reduce(
    (sum, i) => sum + (i.dailyCapacityKg || 0),
    0,
  );
  const used = items.reduce((sum, i) => sum + (i.totalVolume || 0), 0);
  const available = Math.max(0, totalCapacity - used);
  const utilization = getUtilizationPct(used, totalCapacity);

  // overall status: worst among items
  const status = items.reduce<ReturnType<typeof getCapacityStatus>>(
    (acc, item) => {
      const s = getCapacityStatus(used, item);
      if (acc === "WARNING" || s === "WARNING") return "WARNING";
      return "NORMAL";
    },
    "NORMAL",
  );

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Overall Capacity</CardTitle>
            <CardDescription>
              Total processing capacity across all categories
            </CardDescription>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-20 rounded-full" />
          ) : (
            <Badge
              className={cn(
                "h-6 rounded-full px-3 text-xs font-semibold",
                statusPillClass(status),
              )}
            >
              {status === "WARNING" ? "Warning" : "Healthy"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/40 p-4 ring-1 ring-foreground/5">
            <div className="text-xs text-muted-foreground">Total Capacity</div>
            <div className="mt-1 text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `${formatKg(totalCapacity)} kg`
              )}
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 ring-1 ring-foreground/5">
            <div className="text-xs text-muted-foreground">Currently Used</div>
            <div className="mt-1 text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `${formatKg(used)} kg`
              )}
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 ring-1 ring-foreground/5">
            <div className="text-xs text-muted-foreground">Available</div>
            <div className="mt-1 text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                `${formatKg(available)} kg`
              )}
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 p-4 ring-1 ring-foreground/5">
            <div className="text-xs text-muted-foreground">Utilization</div>
            <div className="mt-1 text-lg font-semibold">
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                `${Math.round(utilization)}%`
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {isLoading ? (
             <Skeleton className="h-3 w-full rounded-full" />
          ) : (
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted ring-1 ring-foreground/5">
              <div className="flex h-full">
                {items.map((i) => {
                  const w =
                    totalCapacity > 0 ? (i.totalVolume / totalCapacity) * 100 : 0;
                  const barColor = generateColorFromWasteType(
                    i.wasteTypeId,
                    i.wasteTypeName,
                  );
                  return (
                    <div
                      key={i.id}
                      className="h-full"
                      style={{
                        width: `${Math.max(0, w)}%`,
                        backgroundColor: barColor,
                      }}
                      title={`${i.wasteTypeName}: ${formatKg(i.totalVolume)} kg`}
                    />
                  );
                })}
                <div className="h-full flex-1 bg-transparent" />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-5 pt-1 text-xs text-muted-foreground">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))
              : items.map((i) => {
                  const barColor = generateColorFromWasteType(
                    i.wasteTypeId,
                    i.wasteTypeName,
                  );
                  return (
                    <div key={i.id} className="inline-flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: barColor }}
                      />
                      <span>{i.wasteTypeName}</span>
                    </div>
                  );
                })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
