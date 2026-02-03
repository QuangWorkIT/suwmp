import authClient from "@/config/axios";
import type { NearbyEnterpriseRequest, WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";

const wasteReportService = {
    createWasteReport: async (data: WasteReportRequest) => {
        try {
            const response = await authClient.post("/waste-reports", data);
            return response.data;
        } catch (error) {
            console.log("Error creating waste report:", error);
            throw new Error("Failed to create waste report");
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
            console.log(error)
            throw new Error("Failed to get waste reports by enterprise" + error);
        }
    },
    getEnterprisesNearbyCitizen: async (payload: NearbyEnterpriseRequest) => {
        try {
            const response = await authClient.get("/waste-reports/enterprises/nearby/citizens",
                { params: payload }
            );
            return response.data;
        } catch (error) {
            console.log(error)
            throw new Error("Failed to get enterprises nearby citizen" + error);
        }
    }
}

export default wasteReportService