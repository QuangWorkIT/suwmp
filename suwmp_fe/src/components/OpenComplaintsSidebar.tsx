import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { DashboardComplaint } from "../services/AdminDashboardService";

interface OpenComplaintsSidebarProps {
  complaints: DashboardComplaint[];
  loading: boolean;
  error: string | null;
}

const OpenComplaintsSidebar: React.FC<OpenComplaintsSidebarProps> = ({
  complaints,
  loading,
  error,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "investigating":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "resolved":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit">
      <div className="p-6 flex items-center justify-between border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Open Complaints</h3>
        {!loading && (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-2 h-6 text-[10px] font-bold">
            {complaints.length} pending
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-50 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : error ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Unable to load complaints
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            No open complaints
          </div>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint.id} className="p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {complaint.description || "Untitled Complaint"}
                </h4>
                <Badge variant="outline" className={`px-2 py-0 h-5 text-[9px] uppercase font-bold shrink-0 ml-2 ${getStatusBadgeColor(complaint.status)}`}>
                  {complaint.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mb-1">From: <span className="text-gray-900 font-medium">{complaint.citizenName}</span></p>
              <p className="text-[10px] text-gray-400">
                {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-6 pt-0 mt-auto">
        <Link to="/admin/complaints" className="w-full h-11 flex items-center justify-center rounded-xl border border-gray-100 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors">
          View All Complaints
        </Link>
      </div>
    </div>
  );
};

export default OpenComplaintsSidebar;
