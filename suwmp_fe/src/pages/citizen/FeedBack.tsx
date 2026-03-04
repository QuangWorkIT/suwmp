import {
    Plus,
    MessageSquare,
    ChevronRight,
    CircleCheck,
    Clock,
} from "lucide-react";

type FeedbackStatus = "Resolved" | "Under Review";

interface FeedbackItem {
    id: string;
    type: "COMPLAINT" | "SUGGESTION";
    title: string;
    date: string;
    referenceId: string;
    status: FeedbackStatus;
}

const feedbacks: FeedbackItem[] = [
    {
        id: "1",
        type: "COMPLAINT",
        title: "Missed collection on Main St",
        date: "8/1/2026",
        referenceId: "#FB-2001",
        status: "Resolved",
    },
    {
        id: "2",
        type: "SUGGESTION",
        title: "Add more recycling bins",
        date: "5/1/2026",
        referenceId: "#FB-2002",
        status: "Under Review",
    },
    {
        id: "3",
        type: "COMPLAINT",
        title: "Collector arrived late",
        date: "28/12/2025",
        referenceId: "#FB-2003",
        status: "Resolved",
    },
];

const getStatusStyles = (status: FeedbackStatus) => {
    if (status === "Resolved") {
        return "bg-green-100 text-green-600";
    }
    return "bg-yellow-100 text-yellow-600";
};

const getStatusIcon = (status: FeedbackStatus) => {
    if (status === "Resolved") {
        return <CircleCheck className="text-green-600 size-5" />;
    }
    return <Clock className="text-yellow-600 size-5" />;
};

const FeedbackPage = () => {
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

                        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                            <Plus size={16} />
                            New Report
                        </button>
                    </div>

                    <div className="space-y-4">
                        {feedbacks.map((item) => (
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
                                                {item.type}
                                            </span>
                                            <span>{item.date}</span>
                                        </div>

                                        <h3 className="font-semibold text-gray-800">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Reference ID: {item.referenceId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium flex gap-2 ${getStatusStyles(
                                            item.status
                                        )}`}
                                    >
                                        {getStatusIcon(item.status)}
                                        {item.status}
                                    </span>

                                    <ChevronRight className="text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
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
