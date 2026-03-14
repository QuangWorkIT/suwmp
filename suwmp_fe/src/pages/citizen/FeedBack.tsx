import { useState, useEffect } from "react";
import {
    MessageSquare,
    ChevronRight,
    CircleCheck,
    Clock,
    XCircle,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { ComplaintService } from "@/services/ComplaintService";
import type { Complaint, PaginatedComplaints } from "@/types/complaint";

const getStatusStyles = (status: Complaint["status"]) => {
    if (status === "RESOLVED") {
        return "bg-green-100 text-green-600";
    }
    if (status === "OPEN") {
        return "bg-red-100 text-red-600";
    }
    return "bg-blue-100 text-blue-600";
};

const getStatusIcon = (status: Complaint["status"]) => {
    if (status === "RESOLVED") {
        return <CircleCheck className="text-green-600 size-5" />;
    }
    if (status === "OPEN") {
        return <XCircle className="text-red-600 size-5" />;
    }
    return <Clock className="text-blue-600 size-5" />;
};

const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const formatStatusText = (status: Complaint["status"]) => {
    if (status === "RESOLVED") return "Resolved";
    if (status === "OPEN") return "Open";
    return "Investigating";
}

const FeedbackPage = () => {
    const [data, setData] = useState<PaginatedComplaints | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchComplaints = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await ComplaintService.getComplaintsByUser(pageNumber, 5);
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

    const complaints = data?.content || [];

    return (
        <div className="min-h-screen bg-gray-50 px-12 py-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Feedback & Support
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Share your thoughts or report issues
                        </p>
                    </div>
                </div>

                {/* Feedback History Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Feedback History
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Track the status of your reported issues and
                                suggestions
                            </p>
                        </div>

                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-center text-gray-500 py-8">Loading feedback history...</p>
                        ) : complaints.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">You haven't submitted any feedback yet.</p>
                        ) : (
                            complaints.map((item) => (
                                <div
                                    key={item.id}
                                    className="border rounded-xl p-4 flex justify-between items-center hover:shadow transition"
                                >
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex self-center items-center justify-center">
                                            <MessageSquare className="text-green-600" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">
                                                    COMPLAINT
                                                </span>
                                                {item.createdAt && <span>{formatDateTime(item.createdAt)}</span>}
                                            </div>

                                            <h3 className="font-semibold text-gray-800">
                                                {item.description}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Reference ID: CMP-00{item.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium flex gap-2 items-center ${getStatusStyles(
                                                item.status
                                            )}`}
                                        >
                                            {getStatusIcon(item.status)}
                                            {formatStatusText(item.status)}
                                        </span>

                                        <ChevronRight className="text-gray-400" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {data && data.totalPages > 1 && (
                        <Pagination 
                            currentPage={data.number}
                            totalPages={data.totalPages}
                            hasPrev={!data.first}
                            hasNext={!data.last}
                            fetchItems={setPage}
                        />
                    )}
                </div>

                {/* Info Section */}
                <div className="mt-8 bg-green-50 rounded-xl p-6">
                    <h3 className="font-semibold text-green-700 mb-2">
                        How feedback works
                    </h3>
                    <p className="text-sm text-green-700">
                        Our team reviews every piece of feedback. Responses
                        typically arrive within 24–48 hours. You’ll receive a
                        notification once the status of your submission changes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
