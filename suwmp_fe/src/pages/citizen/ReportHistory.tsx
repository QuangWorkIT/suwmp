import { Input } from "@/components/ui/input";
import { RewardService } from "@/services/RewardService";
import type { RewardTransaction } from "@/types/RewardTransaction";
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
  //   Star,
  TextAlignJustify,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

const RewardHistory = () => {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Pending" | "In Progress" | "Collected"
  >("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const [rewardTransactions, setRewardTransactions] = useState<
    RewardTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //   const totalPoints = rewardTransactions.reduce(
  //     (sum, transaction) => sum + transaction.points,
  //     0
  //   );

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        const data = await RewardService.getMyRewards();
        setRewardTransactions(data);
      } catch {
        setError("Failed to load reward history");
      } finally {
        setLoading(false);
      }
    };

    loadRewards();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Collected":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getWasteTypeIcon = (wasteType: string) => {
    const iconClass =
      "w-10 h-10 rounded-full flex items-center justify-center text-white";
    switch (wasteType) {
      case "Recyclables":
        return (
          <div className={`${iconClass} bg-blue-500`}>
            <Package className="size-6" />
          </div>
        );
      case "Organic Waste":
        return (
          <div className={`${iconClass} bg-green-500`}>
            <Package className="size-6" />
          </div>
        );
      case "E-Waste":
        return (
          <div className={`${iconClass} bg-purple-500`}>
            <Package className="size-6" />
          </div>
        );
      case "Hazardous":
        return (
          <div className={`${iconClass} bg-red-500`}>
            <Package className="size-6" />
          </div>
        );
      default:
        return (
          <div className={`${iconClass} bg-gray-500`}>
            <Package className="size-6" />
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-600 mt-1">
            Track all your earned points and rewards
          </p>
        </div>

        {/* Stats Card
        <div className="bg-linear-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">
                Total Points Earned
              </p>
              <h2 className="text-4xl font-bold mt-1">{totalPoints}</h2>
              <p className="text-green-100 text-sm mt-2">
                From {rewardTransactions.length} transactions
              </p>
            </div>
            <div className="bg-green-400/40 rounded-full p-4">
              <Star className="size-10" fill="currentColor" />
            </div>
          </div>
        </div> */}

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by waste type or location..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(["All", "Pending", "In Progress", "Collected"] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      } cursor-pointer`}
                    >
                      {filter}
                    </button>
                  )
                )}
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
          <div className="text-center py-12 text-gray-500">
            Loading reward history...
          </div>
        )}

        {error && <div className="text-center py-12 text-red-500">{error}</div>}

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {rewardTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getWasteTypeIcon(transaction.wasteType)}

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.wasteType}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status === "Collected" && (
                            <CircleCheck className="w-3 h-3" />
                          )}
                          {transaction.status === "In Progress" && (
                            <Truck className="w-3 h-3" />
                          )}
                          {transaction.status === "Pending" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {transaction.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{`${transaction.latitude}, ${transaction.longitude}`}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Scale className="w-4 h-4" />
                          <span>{transaction.volume} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        +{transaction.points} pts
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.reason}
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-left">
          <p className="text-gray-600">
            Showing {rewardTransactions.length} of {rewardTransactions.length}{" "}
            transactions
          </p>
          <button className="mt-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardHistory;
