import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CitizenWasteReportStatus, AttachmentResponse } from "@/types/WasteReportRequest";
import wasteReportService from "@/services/WasteReportService";
import PageLoading from "@/components/common/PageLoading";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Recycle,
  CheckCircle2,
  Navigation2,
  UserRound,
  Star,
  Paperclip,
  X,
  Plus,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function ReportStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState<CitizenWasteReportStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState<string | null>(null);

  // Attachment states
  const [attachments, setAttachments] = useState<AttachmentResponse[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [issueDescription, setIssueDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  // Manage file previews memory
  useEffect(() => {
    // Generate new previews
    const newPreviews = selectedFiles.map(file => 
      file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
    );
    setFilePreviews(newPreviews);

    // Cleanup: Revoke all ObjectURLs on change or unmount
    return () => {
      newPreviews.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statusData, attachmentsData] = await Promise.all([
          wasteReportService.getReportStatus(Number(id)),
          wasteReportService.getAttachments(Number(id)).catch(() => []),
        ]);
        setReport(statusData);
        setAttachments(attachmentsData);
      } catch (err) {
        console.error(err);
        setError("Unable to load report status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const refreshAttachments = async () => {
    if (!id) return;
    try {
      const data = await wasteReportService.getAttachments(Number(id));
      setAttachments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    files.forEach((file) => {
      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (>5MB)`);
        return;
      }
      // Type check
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }
      validFiles.push(file);
    });

    if (selectedFiles.length + validFiles.length > 5) {
      toast.error("You can only upload up to 5 files");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    // Clear input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitIssue = async () => {
    if (!id || (selectedFiles.length === 0 && !issueDescription.trim())) {
      toast.error("Please provide a description or at least one file");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(20);
      await wasteReportService.uploadAttachments(
        Number(id),
        selectedFiles,
        issueDescription
      );
      setUploadProgress(100);
      toast.success("Your evidence has been submitted successfully");
      setShowIssueForm(false);
      setSelectedFiles([]);
      setIssueDescription("");
      refreshAttachments();

      // Update local report description if provided
      if (issueDescription.trim() && report) {
        setReport({ ...report, description: issueDescription });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload attachments. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const handleSubmitRating = async () => {
    if (!id || rating == null) return;

    setSubmittingRating(true);
    setRatingMessage(null);

    try {
      await wasteReportService.submitRating(Number(id), rating);
      setRatingMessage("Thanks for your feedback!");
    } catch (err) {
      console.error(err);
      setRatingMessage("Failed to submit rating. Please try again.");
    } finally {
      setSubmittingRating(false);
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
            <div className="h-40 sm:h-48 md:h-56 bg-muted flex items-center justify-center">
              <Recycle className="w-12 h-12 text-muted-foreground/60" />
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
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {`${report.latitude.toFixed(4)}, ${report.longitude.toFixed(
                    4,
                  )}`}
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
              onReportIssue={() => setShowIssueForm(true)}
            />
          </div>

          {/* Attachments List */}
          {attachments.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Evidence Attachments ({attachments.length})</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {attachments.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square rounded-lg border bg-muted overflow-hidden flex items-center justify-center hover:border-emerald-500 transition-colors"
                  >
                    {file.fileName.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex flex-col items-center gap-1 p-2 text-center">
                        <FileText className="w-8 h-8 text-red-500" />
                        <span className="text-[10px] truncate max-w-full font-medium">
                          {file.fileName}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={file.url}
                        alt={file.fileName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    )}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Report Issue Dialog */}
          <Dialog open={showIssueForm} onOpenChange={setShowIssueForm}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report an issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the issue you're facing..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="min-h-[120px]"
                    maxLength={500}
                  />
                  <p className="text-[10px] text-muted-foreground text-right">
                    {issueDescription.length}/500
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    Evidence (Images or PDFs)
                    <span className="text-[10px] font-normal text-muted-foreground">Up to 5 files, max 5MB each</span>
                  </label>
                  
                    <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                        {file.type === "application/pdf" ? (
                          <FileText className="w-6 h-6 text-red-500" />
                        ) : (
                          <img 
                            src={filePreviews[idx]} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 shadow-sm hover:bg-destructive hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {selectedFiles.length < 5 && (
                      <label className="aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-1">Add file</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground">Uploading files...</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowIssueForm(false)} disabled={uploading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitIssue} 
                  disabled={uploading || (selectedFiles.length === 0 && !issueDescription.trim())}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {uploading ? "Uploading..." : "Submit Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <div key={item.id} className="relative pl-14">
                    <div
                      className={`absolute left-2 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
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

          {/* Rate your experience */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-medium">Rate your experience</h3>
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                  aria-label={`Rate ${idx + 1} star${idx === 0 ? "" : "s"}`}
                  onClick={() => setRating(idx + 1)}
                  onMouseEnter={() => setHoverRating(idx + 1)}
                  onMouseLeave={() => setHoverRating(null)}
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
            <Button
              size="sm"
              className="mt-2"
              disabled={rating == null || submittingRating}
              onClick={handleSubmitRating}
            >
              {submittingRating ? "Submitting..." : "Submit rating"}
            </Button>
            {ratingMessage && (
              <p className="text-xs text-muted-foreground mt-1">
                {ratingMessage}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function CollectorAndHelpCards({
  collectorName,
  onReportIssue,
}: {
  collectorName: string | null;
  onReportIssue: () => void;
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
        <Button variant="outline" className="w-full justify-start gap-2" onClick={onReportIssue}>
          <AlertCircle className="w-4 h-4" />
          Report an issue
        </Button>
        <Button variant="ghost" className="w-full justify-start text-destructive gap-2">
          <X className="w-4 h-4" />
          Cancel this request
        </Button>
      </Card>
    </>
  );
}

export default ReportStatusPage;


