import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CreateEnterpriseCapacityRequest, EnterpriseCapacity } from "@/types/enterpriseCapacity";
import type { WasteTypeEnterpriseCapacity } from "@/types/wasteType";
import { formatWasteTypeName } from "@/utilities/capacityUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scale, Trash2, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type Mode = "create" | "edit";

const formSchema = z.object({
  wasteTypeId: z.number({ 
    error: "Waste type is required" 
  }).min(1, "Waste type is required"),
  dailyCapacityKg: z.number({ 
    error: "Daily capacity must be a number" 
  }).min(1, "Daily capacity must be at least 1kg"),
  warningThreshold: z.number({ 
    error: "Threshold must be a number" 
  }).min(0, "Threshold must be between 0-100%").max(100, "Threshold must be between 0-100%"),
});

type FormValues = z.infer<typeof formSchema>;

const FormField = ({ label, icon: Icon, error, children, className }: any) => (
  <Field className={cn("space-y-2", className)} data-invalid={!!error}>
    <FieldLabel className="flex items-center gap-2 font-medium">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      {label}
    </FieldLabel>
    {children}
    {error && (
      <div className="flex items-center gap-1 text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
        <TriangleAlert className="h-3 w-3" />
        <FieldError errors={[error]} className="text-[12px] font-medium" />
      </div>
    )}
  </Field>
);

export default function EnterpriseCapacityDialog({
  open,
  onOpenChange,
  mode,
  value,
  onSubmit,
  enterpriseId,
  wasteTypes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Mode;
  value?: EnterpriseCapacity;
  onSubmit: (payload: CreateEnterpriseCapacityRequest) => void;
  enterpriseId: number | null;
  wasteTypes: WasteTypeEnterpriseCapacity[];
}) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) reset(mode === "edit" && value ? { ...value } : { active: true } as any);
  }, [open, mode, value, reset]);

  const onFormSubmit = (data: FormValues) => {
    onSubmit({ ...data, enterpriseId: enterpriseId });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xl p-0 overflow-hidden">
        <div className="p-6 pb-0 space-y-1">
          <AlertDialogHeader className="place-items-start text-left">
            <AlertDialogTitle>{mode === "create" ? "Add" : "Edit"} Waste Capacity</AlertDialogTitle>
            <AlertDialogDescription>
              {mode === "create" ? "Configure capacity limits." : "Update configuration details."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField label="Waste Type" error={errors.wasteTypeId} className="sm:col-span-2">
              <Controller
                control={control}
                name="wasteTypeId"
                render={({ field }) => (
                  <InputGroup className="h-11 shadow-sm overflow-hidden border-input focus-within:ring-1 focus-within:ring-primary/20">
                    <InputGroupAddon className="bg-muted/30 px-3 border-r border-input">
                      <Trash2 className="h-4 w-4 text-primary/70" />
                    </InputGroupAddon>
                    <div className="flex-1 relative">
                      <Select 
                        onValueChange={v => field.onChange(v ? Number(v) : undefined)} 
                        value={field.value ? String(field.value) : ""} 
                        disabled={mode === "edit"}
                      >
                        <SelectTrigger className={cn(
                          "w-full border-0 shadow-none ring-0 focus:ring-0 focus-visible:ring-0 bg-transparent h-full px-3 rounded-none",
                          !field.value && "text-muted-foreground"
                        )}>
                          <SelectValue placeholder="Select a waste type to configure..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {wasteTypes.map(wt => (
                            <SelectItem key={wt.id} value={String(wt.id)} className="rounded-lg py-2.5">
                              {formatWasteTypeName(wt.name)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </InputGroup>
                )}
              />
            </FormField>

            <FormField label="Daily Capacity" icon={Scale} error={errors.dailyCapacityKg}>
              <Controller
                control={control}
                name="dailyCapacityKg"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput 
                      type="number" 
                      min={1} 
                      placeholder="500" 
                      {...field} 
                      value={field.value ?? ""} 
                      onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} 
                    />
                    <InputGroupAddon>kg</InputGroupAddon>
                  </InputGroup>
                )}
              />
            </FormField>

            <FormField label="Warning Threshold" icon={TriangleAlert} error={errors.warningThreshold}>
              <Controller
                control={control}
                name="warningThreshold"
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput 
                      type="number" 
                      min={0} 
                      max={100} 
                      placeholder="80" 
                      {...field} 
                      value={field.value ?? ""} 
                      onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} 
                    />
                    <InputGroupAddon>%</InputGroupAddon>
                  </InputGroup>
                )}
              />
            </FormField>
          </div>

          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit">
              {mode === "create" ? "Add" : "Save"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
