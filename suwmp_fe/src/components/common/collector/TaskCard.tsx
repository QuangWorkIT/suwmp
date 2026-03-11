import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AssignedTask } from "@/types/collectorTask";
import { motion } from "framer-motion";
import { MapPin, Clock, User, Phone, Play, Navigation } from "lucide-react";
import { setCurrentTask, setNextTask } from "@/redux/features/assignedTaskSlice"
import { useAppDispatch } from "@/redux/hooks";
import { Link } from "react-router";

interface TaskCardProps {
    task: AssignedTask;
    nextTask: AssignedTask | null;
    index: number;
}

const TaskCard = ({ task, nextTask, index }: TaskCardProps) => {
    const dispatch = useAppDispatch()
    const isUrgent = task.priority === "URGENT";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
        >
            <Card className="py-0 group relative overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                {/* Image */}
                <div className="relative h-50 overflow-hidden bg-muted">
                    {task.photoUrl ? (
                        <img
                            src={task.photoUrl}
                            alt={task.wasteTypeName}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center eco-gradient">
                            <span className="text-3xl font-bold text-primary-foreground opacity-60">
                                {task.wasteTypeName?.charAt(0) || "W"}
                            </span>
                        </div>
                    )}
                    {/* Type badge */}
                    <Badge
                        variant="secondary"
                        className="absolute left-3 top-3 bg-card/90 text-card-foreground backdrop-blur-sm text-xs font-semibold"
                    >
                        {task.wasteTypeName}
                    </Badge>
                    {isUrgent && (
                        <Badge className="absolute right-3 top-3 bg-destructive text-destructive-foreground text-xs">
                            Urgent
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-4 p-4 pt-0">
                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <span className="line-clamp-2 leading-snug">{task.address}</span>
                    </div>

                    {/* Citizen */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 shrink-0 text-blue-500" />
                        <span>{task.citizenName}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0 text-blue-500" />
                        <span>{task.citizenPhone || "N/A"}</span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 shrink-0 text-blue-500" />
                        <span className="font-bold">{new Date(task.collectTime).toLocaleString()}</span>
                    </div>
                </div>

                {/* Actions */}
                {task.currentStatus === "COLLECTED" ?
                    <div className="border-border p-4 pt-3">
                        <Button
                            disabled
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                            Collected
                        </Button>
                    </div>
                    : (
                        <div className="flex gap-2 border-t border-border p-4 pt-3">
                            <Link to={"/collector/route"}
                                onClick={() => {
                                    dispatch(setCurrentTask(task))
                                    dispatch(setNextTask(nextTask))
                                }}
                                className="flex-1"
                            >
                                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer">
                                    <Play className="h-3.5 w-3.5" />
                                    Start
                                </Button>
                            </Link>
                            <Link to={"/collector/route"}
                                onClick={() => {
                                    dispatch(setCurrentTask(task))
                                    dispatch(setNextTask(nextTask))
                                }}
                                className="flex-1"
                            >
                                <Button variant={"outline"} size="sm" className="w-full cursor-pointer">
                                    <Navigation className="h-3.5 w-3.5" />
                                    Map
                                </Button>
                            </Link>
                        </div>
                    )}
            </Card>
        </motion.div>
    );
};

export default TaskCard;