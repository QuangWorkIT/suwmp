import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Truck,
    CheckCircle2,
    Circle,
    Bell,
    Eye,
    Edit,
    UserPlus,
    Inbox,
    ClipboardCheck,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import type { WasteReportEnterprise } from "@/types/WasteReportRequest";
import wasteReportService from "@/services/WasteReportService";

const statusConfig = {
    PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Circle },
    ON_THE_WAY: { label: "Processing", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
    COLLECTED: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
    ACCEPTED: { label: "Accepted", color: "bg-purple-100 text-purple-700 border-purple-200", icon: ClipboardCheck },
    ASSIGNED: { label: "Assigned", color: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: User }
};

const priorityConfig = {
    urgent: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
    high: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-200" },
    normal: { label: "Normal", color: "bg-gray-100 text-gray-700 border-gray-200" },
    low: { label: "Low", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

function CollectionRequest() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
    const [fetchedRequests, setFetchRequests] = useState<WasteReportEnterprise[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await wasteReportService.getWasteReportsByEnterprise(2)
                setFetchRequests(response);
            } catch (error) {
                console.log("Error fetching requests:", error);
            }
        };
        fetchRequests();
    }, [])

    const filteredRequests = fetchedRequests.filter((req) => {
        if (statusFilter !== "all" && req.currentStatus !== statusFilter) return false;
        if (searchQuery && !req.requestId.toString().toLowerCase().includes(searchQuery.toLowerCase()) && !req.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === filteredRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredRequests.map(r => r.requestId.toString()));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background"
        >
            <div>
                <header className="fixed top-0 left-0 w-full lg:left-[250px] lg:w-[calc(100%-250px)]
                 bg-white/50 px-6 py-5 border-b border-foreground/20 flex 
                 justify-between items-center backdrop-blur-xl backdrop-saturate-200">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Collection Requests</h1>
                        <p className="text-sm text-muted-foreground">Manage and assign waste collection requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <main className="space-y-6 pt-[120px] px-6">
                    <Card className="p-4 shadow-md">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-1 gap-3 flex-wrap">
                                <div className="relative flex-1 min-w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID or address..."
                                        className="pl-10 focus-visible:ring-amber-500 focus-visible:border-amber-500 
                                        focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:shadow-md"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        data-testid="input-search"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40" data-testid="select-status">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    More Filters
                                </Button>
                            </div>
                            <AnimatePresence>
                                {selectedRequests.length > 0 && (
                                    <motion.div
                                        key="assign-bar"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-sm text-muted-foreground">
                                            {selectedRequests.length} selected
                                        </span>
                                        <Button size="sm">
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Assign Collector
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </Card>

                    <Card className="overflow-hidden text-foreground shadow-md">
                        <div className="overflow-x-auto overflow-y-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left py-3 px-4">
                                            <Checkbox
                                                checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                                className="border-2 border-black/50"
                                            />
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Location</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Citizen</th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Collector</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-right py-3 pr-6 text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req, index) => {
                                        const status = statusConfig[req.currentStatus as keyof typeof statusConfig] || { label: req.currentStatus, color: "bg-gray-100 text-gray-700", icon: Circle };
                                        const priority = priorityConfig[req.priority as keyof typeof priorityConfig] || { label: "Normal", color: "bg-gray-100 text-gray-700" };
                                        return (
                                            <motion.tr
                                                key={req.requestId}
                                                initial={{ opacity: 0, y: -16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -16 }}
                                                transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 * index }}
                                                className="border-b border-border hover:bg-muted/50"
                                                data-testid={`request-${req.requestId}`}
                                            >
                                                <td className="py-4 px-4">
                                                    <Checkbox
                                                        checked={selectedRequests.includes(req.requestId.toString())}
                                                        onCheckedChange={() => toggleSelect(req.requestId.toString())}
                                                        className="border-2 border-black/50"
                                                    />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-mono text-sm font-medium">{req.requestId}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className={`text-xs ${req.wasteTypeName === "Recyclables" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        req.wasteTypeName === "Organic" ? "bg-green-50 text-green-700 border-green-200" :
                                                            req.wasteTypeName === "E-Waste" ? "bg-violet-50 text-violet-700 border-violet-200" :
                                                                "bg-red-50 text-red-700 border-red-200"
                                                        }`}>
                                                        {req.wasteTypeName}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{req.volume}</td>
                                                <td className="py-5 px-6 max-w-[200px]">
                                                    <div className="text-sm">
                                                        <p className="font-medium line-clamp-2">
                                                            {req.address}
                                                        </p>
                                                        <p className="pt-2 text-muted-foreground truncate">
                                                            {req.zone}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 max-w-[200px]">
                                                    <div className="text-sm">
                                                        <p className="font-medium line-clamp-2">{req.citizenName}</p>
                                                        <p className="pt-1 text-muted-foreground truncate">{req.citizenPhone}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    {req.collectorName ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                                                                {req.collectorName.charAt(0)}
                                                            </div>
                                                            <span className="text-sm">{req.collectorName}</span>
                                                        </div>
                                                    ) : (
                                                        <Button variant="outline" size="sm" className="h-7 text-xs">
                                                            <UserPlus className="w-3 h-3 mr-1" />
                                                            Assign
                                                        </Button>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className={`text-xs ${priority.color}`}>
                                                        {priority.label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className={`text-xs ${status.color}`}>
                                                        <status.icon className="w-3 h-3 mr-1" />
                                                        {status.label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 pr-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                    {filteredRequests.length === 0 && (
                                        <motion.tr
                                            key="no-requests"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ duration: 0.25, ease: "easeOut" }}
                                        >
                                            <td colSpan={12} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                                    <div className="bg-muted/50 p-4 rounded-full mb-3">
                                                        <Inbox className="w-8 h-8 text-muted-foreground/50" />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-foreground">No requests found</h3>
                                                    <p className="text-sm max-w-[250px] mt-1 text-muted-foreground/80">
                                                        {searchQuery || statusFilter !== 'all'
                                                            ? "Try adjusting your filters or search query."
                                                            : "New collection requests will appear here."}
                                                    </p>
                                                    {(searchQuery || statusFilter !== 'all') && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="mt-4"
                                                            onClick={() => {
                                                                setSearchQuery("");
                                                                setStatusFilter("all");
                                                            }}
                                                        >
                                                            Clear Filters
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">Showing {filteredRequests.length} of {fetchedRequests.length} requests</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled>Previous</Button>
                                <Button variant="outline" size="sm">Next</Button>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </motion.div >)
}

export default CollectionRequest