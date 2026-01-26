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
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const mockRequests = [
    { id: "REQ-001", type: "Recyclables", volume: "450 kg", zone: "Zone A", address: "123 Green St", citizen: "John D.", phone: "+1 555-0123", status: "processing", priority: "high", collector: "Alex C.", date: "Jan 12, 2026" },
    { id: "REQ-002", type: "Organic", volume: "280 kg", zone: "Zone B", address: "456 Eco Lane", citizen: "Sarah M.", phone: "+1 555-0456", status: "pending", priority: "normal", collector: null, date: "Jan 12, 2026" },
    { id: "REQ-003", type: "E-Waste", volume: "120 kg", zone: "Zone A", address: "789 Tech Rd", citizen: "Mike R.", phone: "+1 555-0789", status: "completed", priority: "normal", collector: "Maria S.", date: "Jan 11, 2026" },
    { id: "REQ-004", type: "Hazardous", volume: "45 kg", zone: "Zone C", address: "321 Safe Ave", citizen: "Lisa P.", phone: "+1 555-0321", status: "processing", priority: "urgent", collector: "John D.", date: "Jan 12, 2026" },
    { id: "REQ-005", type: "Recyclables", volume: "320 kg", zone: "Zone B", address: "555 Park Blvd", citizen: "Tom W.", phone: "+1 555-0555", status: "pending", priority: "normal", collector: null, date: "Jan 13, 2026" },
    { id: "REQ-006", type: "Organic", volume: "180 kg", zone: "Zone A", address: "777 Garden St", citizen: "Emma W.", phone: "+1 555-0777", status: "completed", priority: "low", collector: "Alex C.", date: "Jan 10, 2026" },
];

const statusConfig = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Circle },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
    completed: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
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

    const filteredRequests = mockRequests.filter((req) => {
        if (statusFilter !== "all" && req.status !== statusFilter) return false;
        if (searchQuery && !req.id.toLowerCase().includes(searchQuery.toLowerCase()) && !req.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const toggleSelect = (id: string) => {
        setSelectedRequests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === filteredRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredRequests.map(r => r.id));
        }
    };

    return (
        <div className="p-6 min-h-screen bg-background">
            <div>
                <header className="top-0 z-40 glass-light border-b border-border/50">
                    <div className="flex items-center justify-between px-6 py-4">
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
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    <Card className="p-4">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-1 gap-3 flex-wrap">
                                <div className="relative flex-1 min-w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by ID or address..."
                                        className="pl-10"
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
                            {selectedRequests.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{selectedRequests.length} selected</span>
                                    <Button size="sm">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Assign Collector
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="text-left py-3 px-4">
                                            <Checkbox
                                                checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Request ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Volume</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Citizen</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collector</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => {
                                        const status = statusConfig[req.status as keyof typeof statusConfig];
                                        const priority = priorityConfig[req.priority as keyof typeof priorityConfig];
                                        return (
                                            <tr key={req.id} className="border-b border-border hover:bg-muted/30" data-testid={`request-${req.id}`}>
                                                <td className="py-3 px-4">
                                                    <Checkbox
                                                        checked={selectedRequests.includes(req.id)}
                                                        onCheckedChange={() => toggleSelect(req.id)}
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-mono text-sm font-medium">{req.id}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Badge variant="outline" className={`text-xs ${req.type === "Recyclables" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                            req.type === "Organic" ? "bg-green-50 text-green-700 border-green-200" :
                                                                req.type === "E-Waste" ? "bg-violet-50 text-violet-700 border-violet-200" :
                                                                    "bg-red-50 text-red-700 border-red-200"
                                                        }`}>
                                                        {req.type}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-sm">{req.volume}</td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">
                                                        <p className="font-medium">{req.address}</p>
                                                        <p className="text-muted-foreground">{req.zone}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">
                                                        <p className="font-medium">{req.citizen}</p>
                                                        <p className="text-muted-foreground">{req.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {req.collector ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-semibold">
                                                                {req.collector.charAt(0)}
                                                            </div>
                                                            <span className="text-sm">{req.collector}</span>
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
                                                <td className="py-3 px-4">
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
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between p-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">Showing {filteredRequests.length} of {mockRequests.length} requests</p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled>Previous</Button>
                                <Button variant="outline" size="sm">Next</Button>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>)
}

export default CollectionRequest