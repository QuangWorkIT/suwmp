import type { SendPasswordDto } from "@/types/emailSend";
import { api } from "@/config/api";

export const EmailService = {
    sendPassword: async (payload: SendPasswordDto) => {
        try {
            await api.post("/email/send-password", payload);   
        } catch (error: any) {
            console.log(error);
            throw error;
        }
    }
}