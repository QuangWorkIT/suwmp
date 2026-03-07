import authClient from "@/config/axios";
import type { AssignedTask } from "@/types/collectorTask";
import type { CancelWasteReportRequest, CitizenWasteReportStatus, NearbyEnterpriseRequest, RatingStatusResponse, WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";
import type { PaginatedResponse } from "@/types/response";
import s3Service from "./S3Service";
import { reverseGeocode } from "@/utilities/trackasiaGeocode";
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
            
            // Enrich tasks with photo URLs and addresses
            const enrichedData = await Promise.all(
                (response.data.data as AssignedTask[]).map(async (task) => {
                    const [photoRes, address] = await Promise.all([
                        task.photoUrl ? s3Service.getImage(task.photoUrl).catch(() => ({ data: undefined })) : Promise.resolve({ data: undefined }),
                        reverseGeocode(task.requestLatitude, task.requestLongitude).catch(() => "Unknown Address")
                    ]);
                    
                    return {
                        ...task,
                        address: address || "Unknown Address",
                        photoUrl: photoRes.data || null
                    };
                })
            );

            return { ...response.data, data: enrichedData };
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