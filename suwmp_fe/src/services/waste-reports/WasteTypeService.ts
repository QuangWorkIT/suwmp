import authClient from "@/config/axios"
import type { WasteTypeEnterpriseCapacity } from "@/types/wasteType";

export const WasteTypeService = {
    getAll: async (): Promise<WasteTypeEnterpriseCapacity[]> => {
        try {
            const response = await authClient.get("/admin/waste-types");

            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}