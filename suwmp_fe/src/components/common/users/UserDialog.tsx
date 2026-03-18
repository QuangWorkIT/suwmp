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
    isSubmitting?: boolean;
}

const getRoleId = (role: string) => {
    switch(role.toUpperCase()) {
        case 'CITIZEN': return "1";
        case 'ENTERPRISE': return "2";
        case 'COLLECTOR': return "3";
        default: return "1";
    }
};

import { useMemo } from "react";

export function UserDialog({ open, onOpenChange, user, onSubmit, onCancel, isSubmitting }: UserDialogProps) {
    const initialData = useMemo(() => {
        return user ? {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            roleId: getRoleId(user.role) as "1" | "2" | "3",
            status: (user.status.toUpperCase()) as "ACTIVE" | "SUSPENDED",
            password: "",
            enterpriseName: "",
            enterprisePhoto: null
        } : undefined;
    }, [user]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                </DialogHeader>
                <UserForm 
                    initialData={initialData}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
