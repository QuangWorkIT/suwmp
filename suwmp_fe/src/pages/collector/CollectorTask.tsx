import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebouse";
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

const mockTasks = [
    { id: 1, type: "Recyclables", status: "assigned", address: "123 Green Street, Apt 4B", distance: "0.8 km", time: "10 mins", citizen: "John D.", phone: "+1 555-0123", priority: "urgent" },
    { id: 2, type: "Organic Waste", status: "assigned", address: "456 Eco Lane", distance: "1.2 km", time: "15 mins", citizen: "Sarah M.", phone: "+1 555-0456", priority: "normal" },
    { id: 3, type: "E-Waste", status: "assigned", address: "789 Tech Road, Unit 12", distance: "2.1 km", time: "25 mins", citizen: "Mike R.", phone: "+1 555-0789", priority: "normal" },
    { id: 4, type: "Hazardous", status: "assigned", address: "321 Safe Ave", distance: "3.5 km", time: "40 mins", citizen: "Lisa P.", phone: "+1 555-0321", priority: "urgent" },
];
function CollectorTask() {
    const [filter, setFilter] = useState("all")
    const [filteredTasks, setFilterTasks] = useState(mockTasks)
    const [searchQuery, setSearchQuery] = useState("")
    const debounceSearchQuery = useDebounce(searchQuery, 300)

    const filterTasks = () => mockTasks.filter((t) => {
        const matchPriority =
            filter === "all" ? true : t.priority === filter

        const keyword = debounceSearchQuery.trim().toLowerCase()

        const searchItem = (
            t.address +
            " " +
            t.citizen +
            " " +
            t.phone
        ).toLowerCase()

        const matchKeyword =
            keyword === "" ? true : searchItem.includes(keyword)

        return matchPriority && matchKeyword
    })

    useEffect(() => {
        const filtered = filterTasks()
        setFilterTasks(filtered)
    }, [debounceSearchQuery, filter])


    return (
        <div className="relative">
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
                            onKeyDown={(e) => {
                                if (e.key === "enter") {
                                    const filtered = filterTasks()
                                    setFilterTasks(filtered)
                                }
                            }}
                            placeholder="Search tasks..."
                            className="pl-10 bg-white" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">All</Button>
                        <Button variant={filter === "urgent" ? "destructive" : "outline"} onClick={() => setFilter("urgent")} size="sm">Urgent</Button>
                    </div>
                </motion.div>

                <div className="px-8 grid gap-4">
                    <AnimatePresence mode="wait">
                        {filteredTasks.length === 0 && mockTasks.length === 0 && (
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

                        {filteredTasks.length === 0 && mockTasks.length > 0 && (
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
                                        key={task.id}
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
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${task.type === "Recyclables" ? "bg-gradient-to-br from-blue-500 to-cyan-600" :
                                                    task.type === "Organic Waste" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                                                        "bg-gradient-to-br from-violet-500 to-purple-600"
                                                    }`}>
                                                    <Package className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold">{task.type}</h3>
                                                        {task.priority === "urgent" && <Badge className="bg-red-500 text-white border-0">Urgent</Badge>}
                                                        {task.priority === "high" && <Badge className="bg-orange-500 text-white border-0">High</Badge>}
                                                    </div>
                                                    <div className="grid sm:grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{task.address}</div>
                                                        <div className="flex items-center gap-2"><User className="w-4 h-4" />{task.citizen}</div>
                                                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{task.time} ({task.distance})</div>
                                                        <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{task.phone}</div>
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
            </main>
        </div>
    )
}

export default CollectorTask