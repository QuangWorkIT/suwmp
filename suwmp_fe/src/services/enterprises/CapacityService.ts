import authClient from "@/config/axios"
import type { CreateEnterpriseCapacityRequest, UpdateEnterpriseCapacityRequest } from "@/types/enterpriseCapacity";

export const CapacityService = {
    getCapacitiesByEnterpriseId: async (enterpriseId: number) => {
        try {
            const response = await authClient.get("/enterprises/" + enterpriseId + "/capacities");

            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createCapacity: async (payload: CreateEnterpriseCapacityRequest) => {
        try {
            await authClient.post("/enterprises/capacities", payload);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateCapacity: async (id: number, payload: UpdateEnterpriseCapacityRequest) => {
        try {
            await authClient.put("/enterprises/capacities/" + id, payload);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteCapacity: async (id: number) => {
        try {
            await authClient.delete("/enterprises/capacities/" + id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}