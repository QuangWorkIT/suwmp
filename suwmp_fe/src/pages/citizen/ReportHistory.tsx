import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import type { CitizenWasteReport } from "@/types/WasteReportRequest";
import wasteReportService from "@/services/WasteReportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, CalendarDays, Scale, Loader2, AlertCircle, ChevronRight, Recycle } from "lucide-react";

type StatusFilter = "ALL" | "PENDING" | "ACCEPTED" | "ASSIGNED" | "COLLECTED";

const STATUS_LABEL: Record<Exclude<StatusFilter, "ALL">, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  ASSIGNED: "In Progress",
  COLLECTED: "Collected",
};

function getStatusBadgeVariant(status: CitizenWasteReport["status"]): { label: string; className: string } {
  switch (status) {
    case "PENDING":
      return { label: "Pending", className: "bg-orange-100 text-orange-800 border-orange-200" };
    case "ACCEPTED":
      return { label: "Accepted", className: "bg-sky-100 text-sky-800 border-sky-200" };
    case "ASSIGNED":
      return { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" };
    case "COLLECTED":
      return { label: "Collected", className: "bg-green-100 text-green-800 border-green-200" };
    default:
      return { label: status, className: "" };
  }
}

function getWasteTypeColor(wasteTypeName: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-amber-500",
    "bg-cyan-500",
  ];
  const hash = wasteTypeName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function calculatePoints(volume: number | null, status: CitizenWasteReport["status"]): number {
  if (status !== "COLLECTED" || volume == null) return 0;
  // Simple calculation: 20 points per kg, minimum 10 points
  return Math.max(10, Math.round(volume * 20));
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatVolume(volume: number | null) {
  if (volume == null) return "-";
  return `${volume.toFixed(1)} kg`;
}

function ReportHistory() {
  const user = useAppSelector((state) => state.user.user);
  const [reports, setReports] = useState<CitizenWasteReport[]>([]);
  const [allReports, setAllReports] = useState<CitizenWasteReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [displayCount, setDisplayCount] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      if (!user?.id) {
        setAllReports([]);
        setDisplayCount(10);
        setHasMore(false);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
          setError(null);
        }
        const data = await wasteReportService.getReportsByCitizen(user.id);
        if (!cancelled) {
          setAllReports(data);
          setDisplayCount(10);
          setHasMore(data.length > 10);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Unable to load your reports right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    const filtered = allReports.filter((r) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : r.status === statusFilter;
      const term = search.trim().toLowerCase();
      if (!term) return matchesStatus;
      return (
        matchesStatus &&
        (r.wasteTypeName.toLowerCase().includes(term) ||
          formatDate(r.createdAt).toLowerCase().includes(term))
      );
    });
    setReports(filtered.slice(0, displayCount));
    setHasMore(filtered.length > displayCount);
  }, [allReports, statusFilter, search, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 10);
  };


  return (
    <div className="px-6 pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">My Reports</h1>
        <p className="text-sm text-muted-foreground">
          View and track all your waste reports
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by waste type or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(["ALL", "PENDING", "ACCEPTED", "ASSIGNED", "COLLECTED"] as StatusFilter[]).map(
              (status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "ALL" ? "All" : STATUS_LABEL[status as Exclude<StatusFilter, "ALL">]}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading reports...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && reports.length === 0 && (
        <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          {search || statusFilter !== "ALL"
            ? "No reports match your filters."
            : "You haven&apos;t submitted any reports yet."}
        </div>
      )}

      <div className="space-y-0 divide-y divide-border">
        {reports.map((report) => {
          const status = getStatusBadgeVariant(report.status);
          const iconColor = getWasteTypeColor(report.wasteTypeName);
          const points = calculatePoints(report.volume, report.status);
          
          return (
            <div
              key={report.reportId}
              className="flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconColor} text-white shrink-0`}>
                <Recycle className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-base font-medium text-foreground">
                    {report.wasteTypeName}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`${status.className} rounded-full px-2.5 py-0.5 text-xs font-medium`}
                  >
                    {status.label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{formatDate(report.createdAt)}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5" />
                    <span>{formatVolume(report.volume)}</span>
                  </span>
                </div>
              </div>

              {/* Points and Arrow */}
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-sm font-medium ${points > 0 ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {points > 0 ? `+${points} pts` : "+0 pts"}
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {!loading && reports.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {reports.length} of {allReports.filter((r) => {
              const matchesStatus =
                statusFilter === "ALL" ? true : r.status === statusFilter;
              const term = search.trim().toLowerCase();
              if (!term) return matchesStatus;
              return (
                matchesStatus &&
                (r.wasteTypeName.toLowerCase().includes(term) ||
                  formatDate(r.createdAt).toLowerCase().includes(term))
              );
            }).length} reports
          </span>
          {hasMore && (
            <Button variant="outline" size="sm" onClick={handleLoadMore}>
              Load More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportHistory
