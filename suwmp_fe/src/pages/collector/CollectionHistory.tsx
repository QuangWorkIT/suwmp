import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Bell,
    Search,
    Filter,
    Download,
    Calendar,
    Package,
    CheckCircle2,
    Clock,
    MapPin,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CollectionLogHistory } from "@/types/collectionLog";
import { collectionLogService } from "@/services/CollectionLogService";
import ImageDetail from "@/components/common/ImageDetail";


export default function CollectorHistory() {
    const [historyLogs, setHistoryLogs] = useState<CollectionLogHistory[]>([])
    const [currentPhoto, setCurrentPhoto] = useState<string>("")
    const [isFetching, setIsFetching] = useState(false)

    // Filtering state
    const [searchTerm, setSearchTerm] = useState("")
    const [filterWasteType, setFilterWasteType] = useState("all")

    // paging
    const [currentPage, setCurrentPage] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    const filteredLogs = historyLogs.filter((item) => {
        const matchesSearch =
            item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.wasteTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            new Date(item.collectedTime).toLocaleDateString().includes(searchTerm);

        const matchesWasteType =
            filterWasteType === "all" ||
            item.wasteTypeName.toLowerCase() === filterWasteType.toLowerCase();

        return matchesSearch && matchesWasteType;
    });


    const fetchHistoryLogs = async (page: number = 0, size: number = 10) => {
        try {
            setIsFetching(true)
            const response = await collectionLogService.getCollectionLogHistory(page, size);

            setHistoryLogs(response.data);
            setCurrentPage(response.currentPage)
            setTotalItems(response.totalItems)
            setHasNext(response.hasNext)
            setHasPrev(response.hasPrevious)
            setIsFetching(false)
        } catch (error) {
            console.error(error);
            setIsFetching(false)
        }
    };

    useEffect(() => {
        fetchHistoryLogs(0, 10);
    }, []);

    return (
        <div className="bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Collection History</h1>
                        <p className="text-sm text-muted-foreground">View your past collection tasks and achievements</p>
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
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by address, waste type, or date..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={filterWasteType}
                                onValueChange={(value) => setFilterWasteType(value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Waste Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="organic">Organic</SelectItem>
                                    <SelectItem value="recyclable">Recyclables</SelectItem>
                                    <SelectItem value="hazardous">Hazardous</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="overflow-hidden min-h-[400px]">
                    <motion.div
                        key={isFetching ? "fetching" : "ready"}
                        className="divide-y divide-border px-5"
                        initial="hidden"
                        animate="show"
                    >
                        {isFetching && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        )}

                        <AnimatePresence mode="popLayout">
                            {!isFetching && filteredLogs.length === 0 && historyLogs.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                    <h3 className="text-md font-medium">No history result</h3>
                                </motion.div>
                            )}


                            {!isFetching && filteredLogs.length === 0 && historyLogs.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                                    <h3 className="text-lg font-medium">No results found</h3>
                                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                                </motion.div>
                            )}

                            {!isFetching && filteredLogs.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}                                    
                                    className="p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center gap-5"
                                >
                                    {item.photo ?
                                        (<img src={item.photo} alt={item.id.toString()}
                                            className="w-23 shadow-sm min-h-20 object-cover rounded-lg border border-blue-200 cursor-zoom-in hover:scale-105 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCurrentPhoto(item.photo);
                                            }}
                                        />)
                                        : (
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${item.wasteTypeName === "RECYCLABLE" ? "bg-gradient-to-br from-blue-500 to-cyan-600" :
                                                item.wasteTypeName === "ORGANIC" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                                                    "bg-gradient-to-br from-violet-500 to-purple-600"
                                                }`}>
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                        )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{item.wasteTypeName}</h3>
                                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Completed
                                            </Badge>
                                            <span className="text-xs text-muted-foreground font-mono ml-auto md:ml-0">ID: {item.id}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.address}</span>
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.collectedTime).toLocaleDateString()} </span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.collectedTime).toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{item.wasteReportWeight || 0} Kg</p>
                                            <p className="text-xs text-muted-foreground">Weight</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-primary">+{item.points || 0} pts</p>
                                            <p className="text-xs text-muted-foreground">Citizen Reward</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Showing {filteredLogs.length} of {totalItems} collection logs</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={!hasPrev}
                                onClick={() => {
                                    if (hasPrev) {
                                        fetchHistoryLogs(currentPage - 1, 10)
                                    }
                                }}>Previous
                            </Button>
                            <Button variant="outline" size="sm" disabled={!hasNext}
                                onClick={() => {
                                    if (hasNext) {
                                        fetchHistoryLogs(currentPage + 1, 10)
                                    }
                                }}>Next
                            </Button>
                        </div>
                    </div>
                </Card>

                <ImageDetail
                    imgUrl={currentPhoto}
                    open={currentPhoto !== ""}
                    onClose={() => setCurrentPhoto("")}
                />
            </main>
        </div >
    );
}
