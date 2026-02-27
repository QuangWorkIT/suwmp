import authClient from "@/config/axios";
import type { AssignedTask, AssignedTaskResponse } from "@/types/collectorTask";
import type { CancelWasteReportRequest, CitizenWasteReportStatus, NearbyEnterpriseRequest, WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";
import { reverseGeocode } from "@/utilities/geocoding";
import s3Service from "./S3Service";

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
    getWasteReportsByEnterprise: async (enterpriseId: number) => {
        try {
            const response = await authClient.get(`/waste-reports/enterprises/${enterpriseId}`);
            const arr: WasteReportEnterprise[] = []
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i];
                arr.push(await standardizeWasteReportRequest(element))
            }
            return arr;
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
    getCollectorAssignedTasks: async (): Promise<AssignedTaskResponse> => {
        const response = await authClient.get("/waste-reports/collectors/tasks/me");
        const arr: AssignedTask[] = []

        // reverse address and download image
        for (let i = 0; i < response.data.data.length; i++) {
            const [photoRes, address] = await Promise.all([
                s3Service.getImage(response.data.data[i].photoUrl),
                reverseGeocode(response.data.data[i].requestLongitude, response.data.data[i].requestLatitude)
            ])
            arr.push({ ...response.data.data[i], address: address, photoUrl: photoRes.data })
        }
        
        return { ...response.data, data: arr };
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
}

export default wasteReportService