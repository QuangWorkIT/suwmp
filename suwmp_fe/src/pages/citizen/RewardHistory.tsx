import {
  Calendar,
  ChevronRight,
  CircleCheck,
  Clock,
  MapPin,
  Package,
  Scale,
  Star,
  Truck,
} from "lucide-react";
import React, { useState } from "react";

interface RewardTransaction {
  id: number;
  citizen_id: string;
  waste_report_id: number;
  points: number;
  reason: string;
  created_at: string;
  // Additional display data
  wasteType: string;
  location: string;
  weight: number;
  status: "Collected" | "In Progress" | "Pending";
}

const RewardHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<
    "All" | "Pending" | "In Progress" | "Collected"
  >("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Hardcoded data matching the database schema
  const rewardTransactions: RewardTransaction[] = [
    {
      id: 1,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1001,
      points: 50,
      reason: "Recyclables collection reward",
      created_at: "2026-01-10T14:30:00",
      wasteType: "Recyclables",
      location: "123 Green Street",
      weight: 2.5,
      status: "Collected",
    },
    {
      id: 2,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1002,
      points: 35,
      reason: "Organic waste collection reward",
      created_at: "2026-01-11T09:15:00",
      wasteType: "Organic Waste",
      location: "456 Eco Lane",
      weight: 1.8,
      status: "In Progress",
    },
    {
      id: 3,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1003,
      points: 75,
      reason: "E-waste collection reward",
      created_at: "2026-01-12T16:45:00",
      wasteType: "E-Waste",
      location: "789 Tech Road",
      weight: 4.2,
      status: "Pending",
    },
    {
      id: 4,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1004,
      points: 100,
      reason: "Hazardous waste collection reward",
      created_at: "2026-01-08T11:20:00",
      wasteType: "Hazardous",
      location: "321 Safe Ave",
      weight: 0.5,
      status: "Collected",
    },
    {
      id: 5,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1005,
      points: 45,
      reason: "Recyclables collection reward",
      created_at: "2026-01-06T13:00:00",
      wasteType: "Recyclables",
      location: "555 Park Blvd",
      weight: 3.1,
      status: "Collected",
    },
    {
      id: 6,
      citizen_id: "c1234567-89ab-cdef-0123-456789abcdef",
      waste_report_id: 1006,
      points: 30,
      reason: "Organic waste collection reward",
      created_at: "2026-01-13T10:30:00",
      wasteType: "Organic Waste",
      location: "777 Garden St",
      weight: 2.0,
      status: "Pending",
    },
  ];

  const totalPoints = rewardTransactions.reduce(
    (sum, transaction) => sum + transaction.points,
    0
  );

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
          <h1 className="text-3xl font-bold text-gray-900">My Rewards</h1>
          <p className="text-gray-600 mt-1">
            Track all your earned points and rewards
          </p>
        </div>

        {/* Stats Card */}
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
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by waste type or location..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
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
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-green-500 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

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
                          <span>{transaction.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(transaction.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Scale className="w-4 h-4" />
                          <span>{transaction.weight} kg</span>
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
