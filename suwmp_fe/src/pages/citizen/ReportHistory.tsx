import { Input } from "@/components/ui/input";
import { ReportHistoryService } from "@/services/ReportHistoryService";
import type { ReportHistory, ReportStatus } from "@/types/reportHistory";
import { reverseGeocode } from "@/utilities/geocoding";
import {
    Calendar,
    ChevronRight,
    CircleCheck,
    Clock,
    LayoutGrid,
    MapPin,
    Package,
    Scale,
    Search,
    TextAlignJustify,
    Truck,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ReportHistoryPage = () => {
    const navigate = useNavigate();

    type FilterOption = "All" | "Pending" | "In Progress" | "Collected";
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

    const filterStatusMap: Record<
        Exclude<FilterOption, "All">,
        ReportStatus[]
    > = {
        Pending: ["PENDING"],
        "In Progress": ["ASSIGNED", "ON_THE_WAY"],
        Collected: ["COLLECTED"],
    };

    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [reports, setReports] = useState<ReportHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReports = async () => {
            try {
                setLoading(true);
                const data = await ReportHistoryService.getMyReportHistory();
                setReports(data);
            } catch {
                setError("Failed to load report history");
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, []);

    const ReportLocation = ({ report }: any) => {
        const [address, setAddress] = useState<string>("Loading location...");

        useEffect(() => {
            const fetchAddress = async () => {
                try {
                    const result = await reverseGeocode(
                        report.longitude,
                        report.latitude
                    );
                    setAddress(result);
                } catch (error) {
                    setAddress("Unknown location");
                }
            };

            if (report.longitude && report.latitude) {
                fetchAddress();
            }
        }, [report.longitude, report.latitude]);

        return <div className="flex items-center gap-1">{address}</div>;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COLLECTED":
                return "bg-green-100 text-green-700";
            case "ON_THE_WAY":
            case "ASSIGNED":
                return "bg-blue-100 text-blue-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "REJECTED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COLLECTED":
                return <CircleCheck className="w-3 h-3" />;
            case "ON_THE_WAY":
            case "ASSIGNED":
                return <Truck className="w-3 h-3" />;
            case "PENDING":
                return <Clock className="w-3 h-3" />;
            case "REJECTED":
                return <XCircle className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
        });
    };

    const filteredReports =
        activeFilter === "All"
            ? reports
            : reports.filter((r) =>
                  filterStatusMap[activeFilter].includes(r.status)
              );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View and track all your waste reports
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            {" "}
                            <div className="relative">
                                {" "}
                                <Input
                                    type="text"
                                    placeholder="Search by waste type or location..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                                />{" "}
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />{" "}
                            </div>{" "}
                        </div>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                {(
                                    [
                                        "All",
                                        "Pending",
                                        "In Progress",
                                        "Collected",
                                    ] as const
                                ).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                        ${
                                            activeFilter === filter
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"
                                        } cursor-pointer`}
                                    >
                                        {" "}
                                        {filter}{" "}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded ${
                                        viewMode === "list"
                                            ? "bg-green-500 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <TextAlignJustify className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded ${
                                        viewMode === "grid"
                                            ? "bg-green-500 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-12">Loading reports...</div>
                )}
                {error && (
                    <div className="text-center py-12 text-red-500">
                        {error}
                    </div>
                )}

                {/* Reports List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
                                : "divide-y divide-gray-200"
                        }
                    >
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() =>
                                    navigate(`/citizen/reports/${report.id}`)
                                }
                                className={`p-6 hover:bg-gray-50 cursor-pointer group ${
                                    viewMode === "grid"
                                        ? "rounded-lg border border-gray-200 hover:shadow-sm"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="flex justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full">
                                            <Package className="size-6" />
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-semibold">
                                                    {report.wasteTypeName}
                                                </h3>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(
                                                        report.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        report.status
                                                    )}
                                                    {report.status ===
                                                    "ON_THE_WAY"
                                                        ? "In Progress"
                                                        : report.status}
                                                </span>
                                            </div>

                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <ReportLocation
                                                        report={report}
                                                    />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(
                                                        report.createdAt
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Scale className="w-4 h-4" />
                                                    {report.volume} kg
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-bold text-green-600">
                                            +{report.rewardPoints} pts
                                        </div>

                                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-gray-600">
                    Showing {filteredReports.length} reports
                </div>
            </div>
        </div>
    );
};

export default ReportHistoryPage;
