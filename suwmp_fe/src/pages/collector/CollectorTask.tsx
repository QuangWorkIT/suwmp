import Pagination from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import wasteReportService from "@/services/WasteReportService";
import type { AssignedTask } from "@/types/collectorTask";
import type { PaginatedResponse } from "@/types/response";
import { AnimatePresence, motion } from "framer-motion";
import {
    Navigation,
    Bell,
    MapPin,
    Clock,
    User,
    Package,
    Play,
    Phone,
    Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


function CollectorTask() {
    const [isFetching, setIsFetching] = useState(false)
    const [tasks, setTasks] = useState<AssignedTask[]>([])
    const [filter, setFilter] = useState("all")
    const [filteredTasks, setFilterTasks] = useState(tasks)
    const [searchQuery, setSearchQuery] = useState("")

    // paging
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)

    const fetchTasks = async (page: number, size: number = 4) => {
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
        setFilterTasks(pagedData.data)  
        setCurrentPage(pagedData.currentPage)
        setTotalPages(pagedData.totalPages)
        setHasNext(pagedData.hasNext)
        setHasPrev(pagedData.hasPrevious)
    }

    // fetch tasks
    useEffect(() => {
        fetchTasks(0);
    }, [])



    return (
        <div className="relative pb-10">
            <header className="fixed top-0 left-0 md:left-[250px] w-full md:w-[calc(100%-250px)] z-50
            bg-white/50 px-8 py-5 border-b border-foreground/20 flex
            justify-between items-center backdrop-blur-xl backdrop-saturate-200">
                <div className="">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-bold text-2xl">
                        My Tasks
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }} className="text-sm text-muted-foreground">
                        Manage assigned collection tasks
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="hover:bg-foreground/10 transition-all duration-300 p-2 rounded-lg">
                    <Bell />
                </motion.div>
            </header>

            <main className="pt-[100px]">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="px-8 py-4 flex flex-col md:flex-row gap-4 items-center justify-between"
                >
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tasks..."
                            className="pl-10 bg-white" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">All</Button>
                        <Button variant={filter === "URGENT" ? "destructive" : "outline"} onClick={() => setFilter("URGENT")} size="sm">Urgent</Button>
                    </div>
                </motion.div>

                <div className="px-8 grid gap-4">
                    <AnimatePresence mode="wait">
                        {isFetching && (
                            <div className="flex items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-18 w-18 border-b-2 border-primary" />
                            </div>
                        )}

                        {!isFetching && filteredTasks.length === 0 && tasks.length === 0 && (
                            <motion.div
                                key="empty-all"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-600/10 flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-blue-500/50" />
                                </div>
                                <h3 className="font-semibold text-lg text-foreground/80 mb-1">All caught up!</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">No more tasks found. Check back later for new assignments.</p>
                            </motion.div>
                        )}

                        {!isFetching && filteredTasks.length === 0 && tasks.length > 0 && (
                            <motion.div
                                key="empty-search"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-amber-500/50" />
                                </div>
                                <h3 className="font-semibold text-lg text-foreground/80 mb-1">No results found</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">No tasks match your search. Try different keywords.</p>
                            </motion.div>
                        )}

                        {filteredTasks.length > 0 && (
                            <motion.div
                                key="task-list"
                                className="grid gap-4"
                            >
                                {filteredTasks.map((task, index) => (
                                    <motion.div
                                        key={task.requestId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.08,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 20,
                                        }}
                                        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                    >
                                        <Card className="p-5">
                                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                                <div className={`group w-24 h-24 rounded-lg flex items-center justify-center shadow-md`}>
                                                    <img src={task.photoUrl} alt={task.wasteTypeName}
                                                        className="w-full h-full object-cover rounded-lg" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">{task.wasteTypeName}</h3>
                                                        {task.priority === "URGENT" && <Badge className="bg-red-500 text-white border-0">Urgent</Badge>}
                                                    </div>
                                                    <div className="grid sm:grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{task.address}</div>
                                                        <div className="flex items-center gap-2"><User className="w-4 h-4" />{task.citizenName}</div>
                                                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{new Date(task.collectTime).toLocaleString()}</div>
                                                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{task.citizenPhone}</div>
                                                    </div>
                                                </div>
                                                <div className="flex md:flex-col gap-2 justify-center">
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                        <Play className="w-4 h-4 mr-2" /> Start
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Navigation className="w-4 h-4 mr-2" /> Map
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center">
                    {!isFetching && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            hasPrev={hasPrev}
                            hasNext={hasNext}
                            fetchItems={fetchTasks}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}

export default CollectorTask