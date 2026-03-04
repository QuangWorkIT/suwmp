import authClient from "@/config/axios";
import type { AssignedTask } from "@/types/collectorTask";
import type { AttachmentResponse, CancelWasteReportRequest, CitizenWasteReportStatus, NearbyEnterpriseRequest, WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";
import { reverseGeocode } from "@/utilities/geocoding";
import s3Service from "./S3Service";
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
    getAttachments: async (reportId: number): Promise<AttachmentResponse[]> => {
        try {
            const response = await authClient.get(`/waste-reports/${reportId}/attachments`);
            return response.data.data;
        } catch (error) {
            console.error("Error getting attachments:", error);
            throw error;
        }
    },
    uploadAttachments: async (reportId: number, files: File[], description?: string) => {
        try {
            const formData = new FormData();
            for (const file of files) {
                formData.append("files", file);
            }
            if (description) formData.append("description", description);

            const response = await authClient.post(`/waste-reports/${reportId}/attachments`, formData);
            return response.data;
        } catch (error) {
            console.error("Error uploading attachments:", error);
            throw error;
        }
    },
}

export default wasteReportService