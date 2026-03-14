import TaskCard from "@/components/common/collector/TaskCard";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import wasteReportService from "@/services/WasteReportService";
import type { AssignedTask } from "@/types/collectorTask";
import type { PaginatedResponse } from "@/types/response";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Package,
    Search,
    Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


function CollectorTask() {
    const [isFetching, setIsFetching] = useState(false)
    const [tasks, setTasks] = useState<AssignedTask[]>([])
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    // paging
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    const fetchTasks = async (page: number, size: number = 6) => {
        try {
            setIsFetching(true)
            const response = await wasteReportService.getCollectorAssignedTasks(page, size);

            handlePaging(response)
            setIsFetching(false)
        } catch (error) {
            toast.error("Error fetching tasks")
            setIsFetching(false)
            console.log("Error fetching tasks", error);
        }
    }

    const handlePaging = (pagedData: PaginatedResponse<AssignedTask>) => {
        setTasks(pagedData.data);
        setCurrentPage(pagedData.currentPage)
        setTotalPages(pagedData.totalPages)
        setHasNext(pagedData.hasNext)
        setHasPrev(pagedData.hasPrevious)
    }

    // fetch tasks
    useEffect(() => {
        fetchTasks(0);
    }, [])

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // Filter by priority
            if (filter !== "all" && task.priority !== filter) return false;

            // Filter by search query
            const keyword = searchQuery.trim().toLowerCase();
            if (keyword === "") return true;

            const searchString = (
                task.requestId.toString() + " " +
                (task.address || "") + " " +
                (task.citizenName || "") + " " +
                (task.wasteTypeName || "") + " " +
                (task.priority || "")
            ).toLowerCase();

            return searchString.includes(keyword);
        });
    }, [tasks, searchQuery, filter]);



    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage assigned collection tasks
                        </p>
                    </div>
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors">
                        <Bell className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl py-6 sm:px-6">
                {/* Search & Filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="pl-10 bg-card focus-visible:ring-0 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] focus:border-blue-500 transition-shadow"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700 cursor-pointer" : "bg-white text-black hover:bg-foreground/10"}
                            onClick={() => setFilter("all")}
                            size="sm"
                        >
                            All
                        </Button>
                        <Button
                            className={filter === "URGENT" ? "bg-red-600 hover:bg-red-700 cursor-pointer" : "bg-white text-black cursor-pointer hover:bg-foreground/10"}
                            onClick={() => setFilter("URGENT")}
                            size="sm"
                        >
                            Urgent
                        </Button>
                    </div>
                </div>

                {/* Loading */}
                {isFetching && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Empty states */}
                {!isFetching && filteredTasks.length === 0 && tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-secondary p-4">
                            <Package className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-foreground">All caught up!</p>
                        <p className="text-sm text-muted-foreground">
                            No more tasks found. Check back later.
                        </p>
                    </div>
                )}

                {!isFetching && filteredTasks.length === 0 && tasks.length > 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-secondary p-4">
                            <Search className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-foreground">No results found</p>
                        <p className="text-sm text-muted-foreground">
                            No tasks match your search. Try different keywords.
                        </p>
                    </div>
                )}

                {/* Card Grid */}
                {filteredTasks.length > 0 && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter + searchQuery}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredTasks.map((task, index) => (
                                <TaskCard
                                    key={task.requestId}
                                    task={task} nextTask={(index + 1) < filteredTasks.length
                                        ? filteredTasks[index + 1] : null}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {!isFetching && totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            hasNext={hasNext}
                            hasPrev={hasPrev}
                            fetchItems={fetchTasks}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default CollectorTask