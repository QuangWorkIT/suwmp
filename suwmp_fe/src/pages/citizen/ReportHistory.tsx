import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import type { CitizenWasteReport } from "@/types/WasteReportRequest";
import wasteReportService from "@/services/WasteReportService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, CalendarDays, Scale, Loader2, AlertCircle } from "lucide-react";

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
      return { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" };
    case "ACCEPTED":
      return { label: "Accepted", className: "bg-sky-100 text-sky-800 border-sky-200" };
    case "ASSIGNED":
      return { label: "In Progress", className: "bg-sky-100 text-sky-800 border-sky-200" };
    case "COLLECTED":
      return { label: "Collected", className: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    default:
      return { label: status, className: "" };
  }
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
    const fetchReports = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await wasteReportService.getReportsByCitizen(user.id);
        setAllReports(data);
        setDisplayCount(10);
        setHasMore(data.length > 10);
      } catch (err) {
        console.error(err);
        setError("Unable to load your reports right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
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

      <div className="space-y-3">
        {reports.map((report) => {
          const status = getStatusBadgeVariant(report.status);
          return (
            <Card
              key={report.reportId}
              className="flex flex-col border border-muted shadow-none md:flex-row md:items-center md:justify-between"
            >
              <CardHeader className="border-none px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white text-sm font-semibold">
                    {report.wasteTypeName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">
                      {report.wasteTypeName}
                    </CardTitle>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        <span>{formatDate(report.createdAt)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        <span>{formatVolume(report.volume)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm md:border-l md:border-t-0 md:px-6 md:py-4">
                <Badge
                  variant="outline"
                  className={status.className}
                >
                  {status.label}
                </Badge>
                <span className="text-xs font-medium text-emerald-600">
                  +0 pts
                </span>
              </CardContent>
            </Card>
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
