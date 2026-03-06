import type { BaseResponse } from "@/types/baseResponse";
import authClient from "../config/axios";
import type { CitizenProfileGetResponse } from "../types/citizenProfile";

export const CitizenService = {
    getCitizenProfile: async (citizenId: string): Promise<BaseResponse<CitizenProfileGetResponse>> => {
        try {
            const response = await authClient.get(`/citizens/profile/${citizenId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching citizen profile:", error);
            throw error;
        }
    }
};
