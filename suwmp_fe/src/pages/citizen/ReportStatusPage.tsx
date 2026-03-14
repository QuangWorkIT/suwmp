import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CitizenWasteReportStatus } from "@/types/WasteReportRequest";
import wasteReportService from "@/services/WasteReportService";
import PageLoading from "@/components/common/PageLoading";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation2,
  UserRound,
  Star,
  Info,
  Camera,
  XCircle,
} from "lucide-react";
import { reverseGeocode } from "@/utilities/trackasiaGeocode";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { RatingStatusResponse } from "@/types/WasteReportRequest";
import type { ComplaintResponse } from "@/services/WasteReportService";
import { toast } from "sonner";

function ReportStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<CitizenWasteReportStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingStatus, setRatingStatus] = useState<RatingStatusResponse | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Issue Reporting State
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [issueFile, setIssueFile] = useState<File | null>(null);
  const [submittingIssue, setSubmittingIssue] = useState(false);
  const [existingIssue, setExistingIssue] = useState<ComplaintResponse | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Cancel state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch report first as it's critical
        const reportData = await wasteReportService.getReportStatus(Number(id));
        setReport(reportData);

        // Fetch address for Bug 1
        reverseGeocode(reportData.latitude, reportData.longitude)
          .then(setAddress)
          .catch((err) => {
            console.error("Geocoding failed:", err);
            setAddress(null);
          });

        // Fetch rating status separately and handle its errors independently
        try {
          const statusData = await wasteReportService.getRatingStatus(Number(id));
          setRatingStatus(statusData);
          if (statusData.alreadyRated) {
            setRating(statusData.userRating);
          }
        } catch (ratingErr) {
          console.error("Failed to load rating status:", ratingErr);
          // Don't set error state globally, just leave ratingStatus as null
        }

        // Fetch issue if it exists
        try {
          const issueData = await wasteReportService.getIssue(Number(id));
          setExistingIssue(issueData);
        } catch (issueErr: any) {
          // 404 is expected if no issue exists
          if (issueErr.response?.status !== 404) {
            console.error("Failed to load issue status:", issueErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load report status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmitRating = async () => {
    if (!id || rating == null || ratingStatus?.alreadyRated) return;

    setSubmittingRating(true);
    setRatingMessage(null);
    setShowConfirm(false);

    try {
      await wasteReportService.submitRating(Number(id), rating);
      setRatingMessage("Thanks for your feedback!");
      // Refresh status to lock the UI
      const updatedStatus = await wasteReportService.getRatingStatus(Number(id));
      setRatingStatus(updatedStatus);
    } catch (err) {
      console.error(err);
      setRatingMessage("Failed to submit rating. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleIssueSubmit = async () => {
    if (!id || !issueDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    setSubmittingIssue(true);
    try {
      const result = await wasteReportService.submitIssue(Number(id), issueDescription, issueFile ?? undefined);
      setExistingIssue(result);
      // Reset form state
      setIssueDescription("");
      setIssueFile(null);
      setFileError(null);
      setShowIssueDialog(false);
      toast.success("Issue submitted successfully");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to submit issue";
      toast.error(message);
    } finally {
      setSubmittingIssue(false);
    }
  };

  const handleCancelReport = async () => {
    if (!id) return;
    setCancelling(true);
    setShowCancelConfirm(false);
    try {
      await wasteReportService.cancelCitizenReport(Number(id));
      toast.success("Report cancelled successfully");
      const updatedReport = await wasteReportService.getReportStatus(Number(id));
      setReport(updatedReport);
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to cancel report";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <PageLoading />;

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-xl font-semibold">Report not available</h2>
          <p className="text-sm text-muted-foreground">
            {error ??
              "We couldn’t find this report or you don’t have permission to view it."}
          </p>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </Card>
      </div>
    );
  }

  const timelineItems = [
    {
      id: 0,
      label: "Report Submitted",
      status: "PENDING" as CitizenWasteReportStatus["status"],
      description: null as string | null,
      timestamp: report.createdAt,
    },
    {
      id: 1,
      label: "Assigned to Collector",
      status: "ASSIGNED" as CitizenWasteReportStatus["status"],
      description: report.collectorName
        ? `Assigned to ${report.collectorName}`
        : null,
      timestamp: null as string | null,
    },
    {
      id: 2,
      label: "In Progress",
      status: "ACCEPTED" as CitizenWasteReportStatus["status"],
      description: null as string | null,
      timestamp: null as string | null,
    },
    {
      id: 3,
      label: "Collected",
      status: "COLLECTED" as CitizenWasteReportStatus["status"],
      description: null as string | null,
      timestamp: null as string | null,
    },
  ];

  const currentIndex = (() => {
    const idx = timelineItems.findIndex(
      (item) => item.status === report.status,
    );
    return idx === -1 ? 0 : idx;
  })();

  const createdAt = new Date(report.createdAt);
  const createdAtLabel = createdAt.toLocaleString();
  const displayWasteType = report.wasteTypeName ?? "Recyclables";

  return (
    <div className="min-h-screen bg-background py-6 px-4 lg:px-10 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-6 lg:flex-row">
        {/* Left column: main card + notes + collector/help row */}
        <div className="flex-1 space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Reports
          </Button>

          {/* Hero card (image 3 style) */}
          <Card className="p-0 overflow-hidden">
            <div className="h-48 sm:h-56 md:h-64 bg-muted flex items-center justify-center relative">
              {report.photoUrl && !imgError ? (
                <img 
                  src={report.photoUrl} 
                  alt="Waste Report" 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                  <Camera className="w-12 h-12" />
                  <p className="text-xs">No image available</p>
                </div>
              )}
            </div>
            <div className="p-6 md:p-7 flex flex-col md:flex-row gap-6 border-t border-border/60">
              <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  {report.referenceCode}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {displayWasteType}
                </Badge>
              </div>

                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  {displayWasteType}
                </h2>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {address ?? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {createdAtLabel}
                </span>
              </div>

              {/* Stats row as 2x2 grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Reported on
                  </p>
                  <p className="font-medium">{createdAtLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Estimated weight
                  </p>
                  <p className="font-medium">
                    {report.volume != null ? `${report.volume} kg` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Reward points
                  </p>
                  <p className="font-medium text-emerald-600">
                    {report.rewardPoints != null
                      ? `${report.rewardPoints} points`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Classification confidence
                  </p>
                  <p className="font-medium">
                    {report.classificationConfidence != null
                      ? `${report.classificationConfidence}% Accuracy`
                      : "—"}
                  </p>
                </div>
              </div>
              </div>

              <div className="w-full md:w-56 flex flex-col items-end gap-3">
                <Badge variant="outline" className="self-start md:self-end">
                {report.status === "PENDING" && "Pending"}
                {report.status === "ACCEPTED" && "Accepted"}
                {report.status === "ASSIGNED" && "Assigned"}
                {report.status === "COLLECTED" && "Collected"}
                {report.status === "CANCELLED" && "Cancelled"}
              </Badge>
              </div>
            </div>
          </Card>

          {/* Notes for collector */}
          <Card className="p-6">
            <h3 className="text-sm font-medium mb-2">Notes for Collector</h3>
            <p className="text-sm text-muted-foreground">
              {report.description ||
                "No additional notes. You can contact support if you need help with this request."}
            </p>
          </Card>

          {/* Collector Assigned + Need Help row directly under card (image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CollectorAndHelpCards 
              collectorName={report.collectorName} 
              onReportIssue={() => setShowIssueDialog(true)}
              hasIssue={!!existingIssue}
              status={report.status}
              onCancelReport={() => setShowCancelConfirm(true)}
              cancelling={cancelling}
            />
          </div>

          {/* Issue Details Section */}
          {existingIssue && (
            <Card className="p-6 border-l-4 border-l-orange-500 bg-orange-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-orange-950 text-lg">Reported Issue</h3>
                <Badge variant="outline" className="ml-auto bg-orange-100/50 text-orange-800 border-orange-200">
                  {existingIssue.status}
                </Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-orange-900 mb-1">Description</p>
                  <p className="text-sm text-orange-800 leading-relaxed whitespace-pre-wrap">
                    {existingIssue.description}
                  </p>
                </div>
                {existingIssue.photoUrl && (
                  <div>
                    <p className="text-sm font-medium text-orange-900 mb-2">Attachment</p>
                    <div className="relative group max-w-sm rounded-xl overflow-hidden border border-orange-200 shadow-sm bg-white">
                      <img 
                        src={existingIssue.photoUrl} 
                        alt="Issue Attachment" 
                        className="w-full h-auto object-cover max-h-64 transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right column: tracking timeline + rating (image 1) */}
        <div className="w-full lg:w-80 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-medium">Tracking Timeline</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-6 top-4 bottom-6 w-px bg-border" />
              {timelineItems.map((item, index) => {
                const isDone = index < currentIndex;
                const isActive = index === currentIndex;
                return (
                  <div key={item.id} className="relative pl-14 min-h-[40px] flex flex-col justify-center">
                    <div
                      className={`absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                        isDone || isActive
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      {index === 0 && <CheckCircle2 className="w-5 h-5" />}
                      {index === 1 && <UserRound className="w-5 h-5" />}
                      {index === 2 && <Navigation2 className="w-5 h-5" />}
                      {index === 3 && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p
                        className={`text-sm font-medium ${
                          isDone || isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs text-emerald-600">
                          {item.description}
                        </p>
                      )}
                      {item.timestamp && (
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleDateString()}
                          <span>•</span>
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Rate your experience (Only visible if COLLECTED) */}
          {report.status === "COLLECTED" && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Rate your experience</h3>
                {ratingStatus?.totalRatings ? (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {ratingStatus.averageRating.toFixed(1)} ({ratingStatus.totalRatings})
                  </span>
                ) : null}
              </div>
              
              <div className="flex gap-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={ratingStatus?.alreadyRated || submittingRating}
                    className={`w-10 h-10 rounded-xl border border-border flex items-center justify-center transition-colors ${
                      ratingStatus?.alreadyRated 
                        ? "cursor-default opacity-80" 
                        : "hover:bg-muted cursor-pointer"
                    }`}
                    aria-label={`Rate ${idx + 1} star${idx === 0 ? "" : "s"}`}
                    onClick={() => setRating(idx + 1)}
                    onMouseEnter={() => !ratingStatus?.alreadyRated && setHoverRating(idx + 1)}
                    onMouseLeave={() => !ratingStatus?.alreadyRated && setHoverRating(null)}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        (hoverRating ?? rating ?? 0) > idx
                          ? "text-emerald-500 fill-emerald-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {!ratingStatus?.alreadyRated ? (
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  disabled={rating == null || submittingRating}
                  onClick={() => setShowConfirm(true)}
                >
                  {submittingRating ? "Submitting..." : "Submit rating"}
                </Button>
              ) : (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                  <p>Thanks for your feedback! Ratings are final and cannot be edited to ensure transparency.</p>
                </div>
              )}
              
              {ratingMessage && (
                <p className={`text-xs mt-1 ${
                  ratingMessage.includes("Failed") ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {ratingMessage}
                </p>
              )}
            </Card>
          )}

          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit your rating?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to give this collection experience a <strong>{rating}-star</strong> rating. 
                  Ratings are final and cannot be modified after submission.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go back</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitRating} className="bg-emerald-600 hover:bg-emerald-700">
                  Confirm Submission
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Report an Issue</DialogTitle>
                <DialogDescription>
                  Explain what went wrong with this collection. You can attach one photo or PDF (max 5MB).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the issue..."
                    className="min-h-[120px] resize-none focus-visible:ring-emerald-500"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">Attachment (Optional)</Label>
                  <div className="grid w-full items-center gap-1.5">
                    <Input
                      id="file"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className={`cursor-pointer file:cursor-pointer file:text-emerald-700 hover:bg-muted/50 transition-colors ${fileError ? 'border-destructive' : ''}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 5 * 1024 * 1024) {
                          setFileError("File must be <= 5MB");
                          setIssueFile(null);
                          e.target.value = ""; // Clear input
                        } else {
                          setFileError(null);
                          setIssueFile(file || null);
                        }
                      }}
                    />
                    {fileError ? (
                      <p className="text-[11px] text-destructive font-medium">
                        {fileError}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Accepted types: .jpg, .png, .pdf (Max 5MB)
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowIssueDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleIssueSubmit}
                  disabled={submittingIssue || !issueDescription.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]"
                >
                  {submittingIssue ? "Submitting..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this waste report? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go back</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelReport}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  Yes, cancel report
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function CollectorAndHelpCards({
  collectorName,
  onReportIssue,
  hasIssue,
  status,
  onCancelReport,
  cancelling,
}: {
  collectorName: string | null;
  onReportIssue: () => void;
  hasIssue: boolean;
  status: string;
  onCancelReport: () => void;
  cancelling: boolean;
}) {
  return (
    <>
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-medium">Collector Assigned</h3>
        {collectorName ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {collectorName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{collectorName}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            A collector has not been assigned yet.
          </p>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-medium">Need Help?</h3>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={onReportIssue}
          disabled={hasIssue}
        >
          <Info className="w-4 h-4" />
          {hasIssue ? "Issue Reported" : "Report an issue"}
        </Button>
        {status === "PENDING" && (
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive gap-2"
            onClick={onCancelReport}
            disabled={cancelling}
          >
            <XCircle className="w-4 h-4" />
            {cancelling ? "Cancelling..." : "Cancel this request"}
          </Button>
        )}
      </Card>
    </>
  );
}

export default ReportStatusPage;


