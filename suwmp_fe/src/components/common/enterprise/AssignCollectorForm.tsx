"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { CalendarIcon, Clock, Phone, Mail, Check, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { format, formatISO } from "date-fns"
import type { Collector } from "@/types/collector"
import { CollectorService } from "@/services/collectors/CollectorService"
import { useAppSelector } from "@/redux/hooks"
import { collectionAssignmentService } from "@/services/collectors/CollectionAssignmentService"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
    collectorId: z.string().min(1, "Please select a collector"),
    date: z.date(),
    time: z.string().min(1, "Please select a time"),
})

type FormValues = z.infer<typeof formSchema>

interface AssignCollectorFormProps {
    selectedRequests: number[]
    setIsAssignFormOpen: (v: boolean) => void
    onSuccess: () => void
}

function AssignCollectorForm({
    selectedRequests,
    setIsAssignFormOpen,
    onSuccess,
}: AssignCollectorFormProps) {
    const user = useAppSelector((state) => state.user.user)
    const [collectors, setCollectors] = useState<Collector[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredCollectors = collectors.filter((collector) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true

        const target = `${collector.fullName} ${collector.email} ${collector.phone}`.toLowerCase()
        return target.includes(query)
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            collectorId: "",
            time: "10:00",
        },
    })

    useEffect(() => {
        if (!user) return

        const fetchCollectors = async () => {
            const res = await CollectorService.getCollectors(user.enterpriseId)
            if (res.success) {
                setCollectors(res.data?.content || [])
            }
        }

        fetchCollectors()
    }, [user])

    const onSubmit = async (data: FormValues) => {
        if (!user) return
        try {
            setIsSubmitting(true)
            const [hours, minutes] = data.time.split(":").map(Number)
            const scheduledDate = new Date(data.date)
            scheduledDate.setHours(hours, minutes, 0, 0)

            const payload = {
                wasteReportIds: selectedRequests,
                collectorId: data.collectorId,
                startCollectAt: formatISO(scheduledDate),
                enterpriseId: user.enterpriseId
            }

            await collectionAssignmentService.assignCollection(payload)

            onSuccess()
            setIsAssignFormOpen(false)
            setIsSubmitting(false)
            toast.success("Requests assigned successfully")
        } catch (error) {
            setIsSubmitting(false)
            toast.error("Failed to assign requests")
            console.log(error)
        }
    }

    return (
        <Card className="min-w-[450px] h-[550px] sm:max-w-md relative">
            <CardHeader>
                <CardTitle>Assign collector</CardTitle>
                <CardDescription>
                    Select a collector and schedule a time for waste collection.
                </CardDescription>
            </CardHeader>

            <Form {...form}>
                <form
                    id="assign-collector-form"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <CardContent className="space-y-4">
                        {/* Date & Time Row */}
                        <div className="flex gap-3">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col flex-1">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between font-normal"
                                                    >
                                                        {field.value
                                                            ? format(field.value, "PPP")
                                                            : "Pick a date"}
                                                        <CalendarIcon className="h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto overflow-hidden p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    captionLayout="dropdown"
                                                    defaultMonth={field.value}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-36">
                                        <FormLabel>Time</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="pr-8 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                />
                                                <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Collector List */}
                        <FormField
                            control={form.control}
                            name="collectorId"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Collector</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <Search className="w-4 h-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-3" />
                                                <Input
                                                    placeholder="Search collector..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>

                                            <motion.div
                                                className="max-h-60 overflow-y-auto overflow-x-hidden rounded-md border bg-popover thin-scrollbar"
                                                layout
                                            >
                                                <AnimatePresence initial={false}>
                                                    {filteredCollectors.length === 0 ? (
                                                        <motion.div
                                                            key="empty"
                                                            className="p-3 text-sm text-muted-foreground"
                                                            initial={{ opacity: 0, y: 4 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -4 }}
                                                            transition={{ duration: 0.15 }}
                                                        >
                                                            No collectors found.
                                                        </motion.div>
                                                    ) : (
                                                        filteredCollectors.map((collector) => (
                                                            <motion.button
                                                                key={collector.id}
                                                                type="button"
                                                                layout
                                                                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                                                whileHover={{ scale: 1.01 }}
                                                                whileTap={{ scale: 0.99 }}
                                                                transition={{
                                                                    duration: 0.15,
                                                                    ease: "easeOut",
                                                                }}
                                                                disabled={collector.status !== "ACTIVE"}
                                                                onClick={() => field.onChange(collector.id)}
                                                                className={`flex w-full items-center gap-5 p-3 text-left hover:bg-primary/20 transition-colors 
                                                                    ${field.value === collector.id ? "bg-primary/20" : ""}
                                                                    ${collector.status !== "ACTIVE" &&  "cursor-not-allowed bg-muted hover:bg-muted" }`}
                                                            >
                                                                <img
                                                                    src={collector.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                                                    className="w-9 h-9 rounded-full"
                                                                />

                                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                                    <div className="flex gap-2">
                                                                        <p className="text-sm font-semibold truncate">
                                                                            {collector.fullName}
                                                                        </p>
                                                                        <Badge variant="outline" className={`text-[10px]
                                                                             ${collector.status === "ACTIVE" ? "bg-green-100 text-green-700 border-green-200"
                                                                                : "bg-red-100 text-red-700 border-red-200"}`}>
                                                                            {collector.status}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                                                                        <Mail className="w-3 h-3" />
                                                                        {collector.email}
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                        <Phone className="w-3 h-3" />
                                                                        {collector.phone}
                                                                    </div>
                                                                </div>

                                                                <Check
                                                                    className={`ml-auto mr-5 h-4 w-4 text-primary ${field.value === collector.id
                                                                        ? "opacity-100"
                                                                        : "opacity-0"}`}
                                                                />
                                                            </motion.button>
                                                        ))
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2 absolute bottom-5 right-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAssignFormOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ?
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner data-icon="inline-start" />
                                    Assigning...
                                </div> : "Assign"
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default AssignCollectorForm