import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CollectorForm } from "./CollectorForm";
import type {
  Collector,
  CreateCollectorRequest,
  UpdateCollectorRequest,
} from "@/types/collector";

interface CollectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  collector?: Collector;
  onSubmit: (
    data: CreateCollectorRequest | UpdateCollectorRequest
  ) => Promise<void>;
}

export const CollectorDialog = ({
  open,
  onOpenChange,
  mode,
  collector,
  onSubmit,
}: CollectorDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    data: CreateCollectorRequest | UpdateCollectorRequest
  ) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="default" className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {mode === "create" ? "Add New Collector" : "Edit Collector"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <CollectorForm
          mode={mode}
          initialData={collector}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
