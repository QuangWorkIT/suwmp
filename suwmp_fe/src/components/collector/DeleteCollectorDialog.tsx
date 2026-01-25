import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Collector } from "@/types/collector";

interface DeleteCollectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collector: Collector | null;
  onConfirm: () => Promise<void>;
}

export const DeleteCollectorDialog = ({
  open,
  onOpenChange,
  collector,
  onConfirm,
}: DeleteCollectorDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting collector:", error);
    }
  };

  if (!collector) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Collector</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{collector.fullName}</strong>? This action
            will set their status to INACTIVE. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
