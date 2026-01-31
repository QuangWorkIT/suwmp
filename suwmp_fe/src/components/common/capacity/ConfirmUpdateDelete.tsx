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

interface ConfirmConfig {
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: "destructive" | "default";
}

export default function ConfirmUpdateDelete({
  confirmOpen,
  setConfirmOpen,
  confirmConfig,
}: {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  confirmConfig: ConfirmConfig;
}) {
  return (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmConfig.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmConfig.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              confirmConfig.onConfirm();
              setConfirmOpen(false);
            }}
            className={
              confirmConfig.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
