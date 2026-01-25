import { api } from "@/config/api";
import type { WasteReportRequest } from "@/types/WasteReportRequest";

const wasteReportService = {
    createWasteReport: async (data: WasteReportRequest) => {
        try {
            const response = await api.post("/waste-report", data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.log("Error creating waste report:", error);
            throw new Error("Failed to create waste report");
        }
    }
}

export default wasteReportService