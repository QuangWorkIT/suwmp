import AssignEnterpriseDialog from "@/components/common/complaint/AssignEnterpriseDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ComplaintService } from "@/services/ComplaintService";
import type {
  Complaint,
  ComplaintGetResponse,
  PaginatedComplaints,
} from "@/types/complaint";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  MoreVertical,
  Search,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

// ─── Helper Components ───────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Complaint["status"] }) => {
  if (status === "OPEN") {
    return (
      <Badge className="bg-red-100 text-red-600 hover:bg-red-300 font-semibold">
        Open
      </Badge>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-300 font-semibold">
        In Progress
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-600 hover:bg-green-300 font-semibold">
      Resolved
    </Badge>
  );
};

const StatusIcon = ({ status }: { status: Complaint["status"] }) => {
  if (status === "OPEN") {
    return (
      <div className="p-3 rounded-full bg-red-100">
        <XCircle className="text-red-500" size={20} />
      </div>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <div className="p-3 rounded-full bg-blue-100">
        <Clock className="text-blue-500" size={20} />
      </div>
    );
  }
  return (
    <div className="p-3 rounded-full bg-green-100">
      <CheckCircle2 className="text-green-500" size={20} />
    </div>
  );
};

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ComplaintsPage = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<PaginatedComplaints | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  // Detail dialog
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Assign dialog
  const [assignComplaint, setAssignComplaint] =
    useState<ComplaintGetResponse | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAssignLoading, setIsAssignLoading] = useState<number | null>(null); // stores complaint.id being loaded

  const fetchComplaints = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await ComplaintService.getComplaints(pageNumber, 5);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(page);
  }, [page]);

  const handleViewDetails = async (complaint: Complaint) => {
    try {
      const res = await ComplaintService.getComplaintById(complaint.id);
      // The details API response maps description, status, citizenName, photoUrl
      // We merge it with the existing complaint so we retain 'id' and 'createAt'
      setSelectedComplaint({ ...complaint, ...res.data });
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (status: Complaint["status"]) => {
    if (!selectedComplaint) return;
    try {
      await ComplaintService.updateComplaintStatus(
        selectedComplaint.id,
        status
      );
      // close dialog and refresh list
      setIsDialogOpen(false);
      fetchComplaints(page);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenAssign = async (
    e: React.MouseEvent,
    complaint: Complaint
  ) => {
    e.stopPropagation(); // prevent opening detail dialog
    setIsAssignLoading(complaint.id);
    try {
      const res = await ComplaintService.getComplaintWithWasteReportById(
        complaint.id
      );
      setAssignComplaint(res);
    } catch {
    } finally {
      setIsAssignLoading(null);
      setIsAssignDialogOpen(true);
    }
  };

  const complaints = data?.content || [];
  const filtered = complaints.filter((c) =>
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-4">
        {/* Header */}
        <div className="w-full flex justify-end gap-3">
          <Button variant="outline" className="gap-2">
            <Filter size={16} /> Filter
          </Button>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-60"
            />
          </div>
        </div>

        {/* Complaint List */}
        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500 py-8">
              Loading complaints...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No complaints found.
            </p>
          ) : (
            filtered.map((complaint) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className="rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
                  onClick={() => handleViewDetails(complaint)}
                >
                  <CardContent className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                      <StatusIcon status={complaint.status} />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {complaint.description}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Reported by{" "}
                          <span className="font-semibold text-black">
                            {complaint.citizenName}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">
                          CMP-00{complaint.id}
                        </p>
                        {complaint.createdAt && (
                          <p className="text-sm text-gray-500">
                            {formatDateTime(complaint.createdAt)}
                          </p>
                        )}
                      </div>

                      <StatusBadge status={complaint.status} />
                      <StatusBadge status={complaint.status} />

                      {/* Assign button - only for OPEN */}
                      {complaint.status === "OPEN" && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 gap-1.5"
                          disabled={isAssignLoading !== null}
                          onClick={(e) => handleOpenAssign(e, complaint)}
                        >
                          {isAssignLoading === complaint.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              <UserCheck size={14} />
                              Assign
                            </>
                          )}
                        </Button>
                      )}

                      <MoreVertical className="text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button
              variant="outline"
              disabled={data.first}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 font-medium">
              Page {data.number + 1} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={data.last}
              onClick={() =>
                setPage((p) => Math.min(data.totalPages - 1, p + 1))
              }
            >
              Next
            </Button>
          </div>
        )}

        {/* Complaint Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Complaint Details</DialogTitle>
            </DialogHeader>
            {selectedComplaint && (
              <div className="space-y-5 pt-2">
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                    Citizen Name
                  </span>
                  <p className="text-md font-medium mt-1">
                    {selectedComplaint.citizenName}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500">
                    Description
                  </span>
                  <p className="text-md mt-1">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 block mb-1">
                      Status
                    </span>
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 block mb-1">
                      Created At
                    </span>
                    <p className="text-sm font-medium">
                      {selectedComplaint.createdAt
                        ? formatDateTime(selectedComplaint.createdAt)
                        : "N/A"}
                    </p>
                  </div>
                </div>
                {selectedComplaint.photoUrl && (
                  <div>
                    <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 block mb-2">
                      Photo Evidence
                    </span>
                    <img
                      src={selectedComplaint.photoUrl}
                      alt="Complaint"
                      className="max-w-full h-auto rounded-lg shadow-sm border"
                    />
                  </div>
                )}

                <div className="pt-4 border-t flex flex-col gap-2">
                  <span className="font-semibold text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Actions
                  </span>
                  <div
                    className={`grid gap-3 ${
                      selectedComplaint.status === "OPEN"
                        ? "grid-cols-3"
                        : "grid-cols-2"
                    }`}
                  >
                    {selectedComplaint.status === "OPEN" && (
                      <Button
                        variant="outline"
                        className="w-full bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 gap-1.5"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <UserCheck size={14} />
                        Assign
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      onClick={() => handleUpdateStatus("IN_PROGRESS")}
                      disabled={selectedComplaint.status === "IN_PROGRESS"}
                    >
                      Investigate
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      onClick={() => handleUpdateStatus("RESOLVED")}
                      disabled={selectedComplaint.status === "RESOLVED"}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Assign Enterprise Dialog */}
        {assignComplaint && (
          <AssignEnterpriseDialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
            complaint={assignComplaint}
            onAssigned={() => fetchComplaints(page)}
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
