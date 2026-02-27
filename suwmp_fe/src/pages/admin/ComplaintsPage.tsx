import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Complaint } from "@/types/complaint";
import {
  MoreVertical,
  Search,
  Filter,
  XCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const complaintsData: Complaint[] = [
  {
    id: 1,
    citizenId: "John D.",
    wasteReportId: "Collector Alex",
    description: "Missed Collection",
    createdAt: "Jan 12, 2026",
    status: "OPEN",
  },
  {
    id: 2,
    citizenId: "GreenCycle",
    wasteReportId: "Citizen Sarah",
    description: "Contaminated Waste",
    createdAt: "Jan 11, 2026",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    citizenId: "Maria S.",
    wasteReportId: "AI System",
    description: "False Classification",
    createdAt: "Jan 10, 2026",
    status: "RESOLVED",
  },
  {
    id: 4,
    citizenId: "Tom W.",
    wasteReportId: "Collector Mike",
    description: "Rude behavior",
    createdAt: "Jan 08, 2026",
    status: "RESOLVED",
  },
];

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
        Investigating
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

const ComplaintsPage = () => {
  const [search, setSearch] = useState("");

  const filtered = complaintsData.filter((c) =>
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
          {filtered.map((complaint) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
                <CardContent className="flex items-center justify-between px-4 py-0">
                  <div className="flex items-center gap-4">
                    <StatusIcon status={complaint.status} />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {complaint.description}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reported by{" "}
                        <span className="font-semibold text-black">
                          {complaint.citizenId}
                        </span>{" "}
                        against{" "}
                        <span className="font-semibold text-black">
                          {complaint.wasteReportId}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        CMP-00{complaint.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {complaint.createdAt}
                      </p>
                    </div>

                    <StatusBadge status={complaint.status} />

                    <MoreVertical className="text-gray-400 cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
