import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UserForm, type UserFormValues } from "./UserForm";

interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onSubmit: (data: UserFormValues) => void;
    onCancel: () => void;
}

const getRoleId = (role: string) => {
    switch(role.toUpperCase()) {
        case 'CITIZEN': return "1";
        case 'ENTERPRISE': return "2";
        case 'COLLECTOR': return "3";
        default: return "1";
    }
};

export function UserDialog({ open, onOpenChange, user, onSubmit, onCancel }: UserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                </DialogHeader>
                <UserForm 
                    initialData={user ? {
                        fullName: user.fullName,
                        email: user.email,
                        phone: user.phone || '',
                        roleId: getRoleId(user.role) as "1" | "2" | "3",
                        status: (user.status.toUpperCase()) as "ACTIVE" | "SUSPENDED" | "INACTIVE"
                    } : undefined}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            </DialogContent>
        </Dialog>
    );
}
