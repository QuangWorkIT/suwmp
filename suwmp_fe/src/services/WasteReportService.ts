import authClient from "@/config/axios";
import type { AssignedTask } from "@/types/collectorTask";
import type { CancelWasteReportRequest, CitizenWasteReportStatus, NearbyEnterpriseRequest, RatingStatusResponse, WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";
import type { PaginatedResponse } from "@/types/response";
const wasteReportService = {
    createWasteReport: async (data: WasteReportRequest) => {
        try {
            const response = await authClient.post("/waste-reports", data);
            return response.data;
        } catch (error) {
            console.error("Error creating waste report:", error);
            throw error;
        }
    },
    getWasteReportsByEnterprise: async (page: number, size: number): Promise<PaginatedResponse<WasteReportEnterprise>> => {
        try {
            const response = await authClient.get(`/waste-reports/enterprises/requests/me`, { params: { page, size } });
            const arr: WasteReportEnterprise[] = []
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i];
                arr.push(await standardizeWasteReportRequest(element))
            }
            return { ...response.data, data: arr };
        } catch (error) {
            console.error("Error getting waste reports by enterprise:", error);
            throw error;
        }
    },
    getEnterprisesNearbyCitizen: async (payload: NearbyEnterpriseRequest) => {
        try {
            const response = await authClient.get("/waste-reports/enterprises/nearby/citizens",
                { params: payload }
            );
            return response.data;
        } catch (error) {
            console.error("Error getting enterprises nearby citizen:", error);
            throw error;
        }
    },
    cancelWasteReport: async (payload: CancelWasteReportRequest) => {
        try {
            const response = await authClient.patch("/waste-reports/enterprises/cancellation", payload);
            return response.data;
        } catch (error) {
            console.error("Error canceling waste report:", error);
            throw error;
        }
    },
    getCollectorAssignedTasks: async (page: number, size: number): Promise<PaginatedResponse<AssignedTask>> => {
        try {
            const response = await authClient.get("/waste-reports/collectors/tasks/me", { params: { page, size } });
            return response.data;
        } catch (error) {
            console.error("Error getting collector assigned tasks:", error);
            throw error;
        }
    },
    getReportStatus: async (
        reportId: number,
    ): Promise<CitizenWasteReportStatus> => {
        const response = await authClient.get(`/waste-reports/${reportId}/status`);
        return response.data.data as CitizenWasteReportStatus;
    },

    getMyReports: async (): Promise<CitizenWasteReportStatus[]> => {
        const response = await authClient.get("/waste-reports/citizen/me");
        return response.data.data as CitizenWasteReportStatus[];
    },

    submitRating: async (reportId: number, rating: number): Promise<void> => {
        await authClient.post(`/waste-reports/${reportId}/rating`, { rating });
    },
    getRatingStatus: async (reportId: number): Promise<RatingStatusResponse> => {
        const response = await authClient.get(`/waste-reports/${reportId}/rating`);
        return response.data.data as RatingStatusResponse;
    },
}

export default wasteReportService;