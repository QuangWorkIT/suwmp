import type { BaseResponse } from "@/types/baseResponse";
import authClient from "../config/axios";
import type { CitizenProfileGetResponse, CitizenProfileUpdateRequest } from "../types/citizenProfile";

export const CitizenService = {
    getCitizenProfile: async (citizenId: string): Promise<BaseResponse<CitizenProfileGetResponse>> => {
        try {
            const response = await authClient.get(`/citizens/profile/${citizenId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching citizen profile:", error);
            throw error;
        }
    },

    updateCitizenProfile: async (citizenId: string, request: CitizenProfileUpdateRequest) => {
        try {
            await authClient.put(`/citizens/profile/${citizenId}`, request);
        } catch (error: any) {
            console.error("Error updating citizen profile:", error);
            throw error;
        }
    }
};
