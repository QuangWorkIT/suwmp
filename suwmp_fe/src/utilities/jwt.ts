import type { UserInterface, UserRole } from "@/types/Users";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface AuthJwtPayload extends JwtPayload {
    sub: string; // user id
    status: "ACTIVE" | "SUSPENDED";
    role: UserRole;
    email: string;
    fullName: string;
}

export const decodePayLoad = (token: string): UserInterface => {
    const payload = jwtDecode<AuthJwtPayload>(token)
    return {
        id: payload.sub,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
        status: payload.status
    }
}