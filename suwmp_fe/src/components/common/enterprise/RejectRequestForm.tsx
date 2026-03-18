"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import wasteReportService from "@/services/waste-reports/WasteReportService"
import type { CancelWasteReportRequest } from "@/types/WasteReportRequest"
import { toast } from "sonner"

const formSchema = z.object({
    wasteReportId: z.string().min(1, "Request ID is required"),
    note: z.string()
        .min(1, "Note is required")
        .max(500, "Note is too long"),
})

interface RejectRequestFormProps {
    wasteReportId: number | null;
    setIsRejectFormOpen: (v: boolean) => void;
    onSuccess?: () => void;
}

function RejectRequestForm({ wasteReportId, setIsRejectFormOpen, onSuccess }: RejectRequestFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            wasteReportId: wasteReportId?.toString() || "",
            note: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!wasteReportId) return
        try {
            const payload: CancelWasteReportRequest = {
                wasteReportId,
                note: data.note,
            }
            await wasteReportService.cancelWasteReport(payload)
            setIsRejectFormOpen(false)
            onSuccess?.()
            toast.success("Request cancelled successfully")
        } catch (error) {
            toast.error("Failed to cancel request")
        }
    }
    return (
        <Card className="min-w-[450px] sm:max-w-md">
            <CardHeader>
                <CardTitle>Confirm cancellation</CardTitle>
                <CardDescription>
                    Please give a reason for cancelling the request.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="wasteReportId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Request ID
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Request ID"
                                        autoComplete="off"
                                        disabled={field.value !== ""}
                                        className="font-bold"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="note"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-description">
                                        Note
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-rhf-demo-description"
                                            placeholder="Can not handle more requests."
                                            rows={6}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length}/500 characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => setIsRejectFormOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="form-rhf-demo" variant="destructive">
                        Reject
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}

export default RejectRequestForm