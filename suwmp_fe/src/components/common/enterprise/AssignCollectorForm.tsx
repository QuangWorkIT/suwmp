"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { format, formatISO } from "date-fns"
import type { Collector } from "@/types/collector"
import { CollectorService } from "@/services/CollectorService"
import { useAppSelector } from "@/redux/hooks"
import { collectionAssignmentService } from "@/services/CollectionAssignmentService"

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
            const [hours, minutes] = data.time.split(":").map(Number)
            const scheduledDate = new Date(data.date)
            scheduledDate.setHours(hours, minutes, 0, 0)

            const payload = {
                wasteReportId: selectedRequests,
                collectorId: data.collectorId,
                startCollectAt: formatISO(scheduledDate),
                enterpriseId: user.enterpriseId
            }

            await collectionAssignmentService.assignCollection(payload)
        
            onSuccess()
            setIsAssignFormOpen(false)
            toast.success("Requests assigned successfully")
        } catch (error) {
            toast.error("Failed to assign requests")
            console.log(error)
        }
    }

    return (
        <Card className="min-w-[450px] sm:max-w-md">
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

                        {/* Collector Select */}
                        <FormField
                            control={form.control}
                            name="collectorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collector</FormLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={collectors.length > 0 ? "Select a collector" : "No collector found"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {collectors.map((collector) => (
                                                <SelectItem
                                                    key={collector.id}
                                                    value={collector.id}
                                                >
                                                    {collector.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAssignFormOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Assign</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default AssignCollectorForm