import type { BaseResponse } from "@/types/baseResponse";
import authClient from "../config/axios";
import type { CitizenProfileGetResponse } from "../types/citizenProfile";

export interface DashboardWidgetsResponse {
    totalReports: number;
    rewardPoints: number;
    totalVolume: number;
    itemsRecycled: number;
}

export interface MonthlyProgressResponse {
    currentPlasticKg: number;
    targetPlasticKg: number;
    currentReports: number;
    targetReports: number;
    currentPoints: number;
    targetPoints: number;
}

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
    getDashboardWidgets: async (): Promise<BaseResponse<DashboardWidgetsResponse>> => {
        try {
            const response = await authClient.get("/citizens/dashboard/widgets");
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard widgets:", error);
            throw error;
        }
    },
    getMonthlyProgress: async (): Promise<BaseResponse<MonthlyProgressResponse>> => {
        try {
            const response = await authClient.get("/citizens/dashboard/monthly-progress");
            return response.data;
        } catch (error) {
            console.error("Error fetching monthly progress:", error);
            throw error;
        }
    }
};
