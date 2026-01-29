export type UserRole = "ENTERPRISE" | "COLLECTOR" | "ADMIN" | "CITIZEN";

export interface UserInterface {
    id: string,
    fullName: string,
    email: string,
    role: UserRole,
    status: string
}