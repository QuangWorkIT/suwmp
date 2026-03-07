import authClient from "@/config/axios";
import type { AssignedTask } from "@/types/collectorTask";
import type { CancelWasteReportRequest, CitizenWasteReportStatus, NearbyEnterpriseRequest, WasteReportEnterprise, WasteReportRequest, RatingStatusResponse, UpdateWasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";
import { reverseGeocode } from "@/utilities/geocoding";
import s3Service from "./S3Service";
import type { PaginatedResponse } from "@/types/response";
import type { BaseResponse } from "@/types/baseResponse";

const wasteReportService = {
    createWasteReport: async (data: WasteReportRequest) => {
        try {
            const response = await authClient.post("/waste-reports", data);
            return response.data;
        } catch (error) {
            console.error("Error creating waste report");
            throw new Error("Error creating waste report");
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
            console.error("Error getting waste reports by enterprise");
            throw new Error("Error getting waste reports by enterprise");
        }
    },
    getEnterprisesNearbyCitizen: async (payload: NearbyEnterpriseRequest) => {
        try {
            const response = await authClient.get("/waste-reports/enterprises/nearby/citizens",
                { params: payload }
            );
            return response.data;
        } catch (error) {
            console.error("Error getting enterprises nearby citizen");
            throw new Error("Error getting enterprises nearby citizen");
        }
    },
    cancelWasteReport: async (payload: CancelWasteReportRequest) => {
        try {
            const response = await authClient.patch("/waste-reports/enterprises/cancellation", payload);
            return response.data;
        } catch (error) {
            console.error("Error canceling waste report");
            throw new Error("Error canceling waste report");
        }
    },
    updateWasteReportStatus: async (payload: UpdateWasteReportRequest): Promise<BaseResponse<number>> => {
        try {
            const response = await authClient.patch("/waste-reports/status", payload)
            return {
                isSuccess: true,
                message: response.data.message,
                data: response.data.data
            }
        } catch (error) {
            console.log("Fail to update status")
            return {
                isSuccess: false,
                message: "Fail to update report status",
                data: -1
            }
        }
    },
    getCollectorAssignedTasks: async (page: number, size: number): Promise<PaginatedResponse<AssignedTask>> => {
        try {
            const response = await authClient.get("/waste-reports/collectors/tasks/me", { params: { page, size } });

            // Map each task to a promise that performs image fetching and geocoding in parallel
            const tasksPromises = response.data.data.map(async (task: AssignedTask) => {
                try {
                    const [photoRes, address] = await Promise.all([
                        s3Service.getImage(task.photoUrl).catch(() => ({ data: "" })),
                        reverseGeocode(task.requestLongitude, task.requestLatitude).catch(() => "Unknown Address")
                    ]);

                    return {
                        ...task,
                        address: address,
                        photoUrl: photoRes.data || ""
                    };
                } catch (itemError) {
                    console.error(`Error processing task ${task.requestId}:`, itemError);
                    return {
                        ...task,
                        address: "Unknown Address",
                        photoUrl: ""
                    };
                }
            });

            // Process all task promises in parallel
            const arr = await Promise.all(tasksPromises);

            return { ...response.data, data: arr };
        } catch (error) {
            console.error("Error getting collector assigned tasks");
            throw new Error("Error getting collector assigned tasks");
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

export default wasteReportService