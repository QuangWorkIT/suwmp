import { api } from "@/config/api";
import type {WasteReportEnterprise, WasteReportRequest } from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";

const wasteReportService = {
    createWasteReport: async (data: WasteReportRequest) => {
        try {
            const response = await api.post("/waste-report", data);
            return response.data;
        } catch (error) {
            console.log("Error creating waste report:", error);
            throw new Error("Failed to create waste report");
        }
    },
    getWasteReportsByEnterprise: async (enterpriseId: number) => {
        try {
            const response = await api.get(`/waste-report/enterprise/${enterpriseId}`);
            const arr: WasteReportEnterprise[] = []
            for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i];
                arr.push(await standardizeWasteReportRequest(element))
            }
            return arr;
        } catch (error) {
            throw new Error("Failed to get waste reports by enterprise" + error);
        }
    }
}

export default wasteReportService