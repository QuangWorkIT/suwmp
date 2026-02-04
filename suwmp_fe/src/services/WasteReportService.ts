import authClient from "@/config/axios";
import type {
  WasteReportEnterprise,
  WasteReportRequest,
  CitizenWasteReportStatus,
} from "@/types/WasteReportRequest";
import { standardizeWasteReportRequest } from "@/utilities/format";

const wasteReportService = {
  createWasteReport: async (data: WasteReportRequest) => {
    try {
      const response = await authClient.post("/waste-report", data);
      return response.data;
    } catch (error) {
      console.log("Error creating waste report:", error);
      throw new Error("Failed to create waste report");
    }
  },

  getWasteReportsByEnterprise: async (enterpriseId: number) => {
    try {
      const response = await authClient.get(
        `/waste-report/enterprise/${enterpriseId}`,
      );
      const arr: WasteReportEnterprise[] = [];
      for (let i = 0; i < response.data.data.length; i++) {
        const element = response.data.data[i];
        arr.push(await standardizeWasteReportRequest(element));
      }
      return arr;
    } catch (error) {
      throw new Error("Failed to get waste reports by enterprise" + error);
    }
  },

  getReportStatus: async (
    reportId: number,
  ): Promise<CitizenWasteReportStatus> => {
    const response = await authClient.get(`/waste-report/${reportId}/status`);
    return response.data.data as CitizenWasteReportStatus;
  },

  getMyReports: async (): Promise<CitizenWasteReportStatus[]> => {
    const response = await authClient.get("/waste-report/citizen/me");
    return response.data.data as CitizenWasteReportStatus[];
  },
};

export default wasteReportService;
