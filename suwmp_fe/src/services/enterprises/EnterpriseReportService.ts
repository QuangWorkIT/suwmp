import authClient from "@/config/axios";
import type { 
  ReportWidgetData, 
  CollectionTrend, 
  WasteDistribution,
  CollectorPerformance,
  SpringPaginatedResponse
} from "@/types/enterprise-report";
import type { BaseResponse } from "@/types/baseResponse";

export const EnterpriseReportService = {
  getReportWidget: async (): Promise<BaseResponse<ReportWidgetData>> => {
    try {
      const response = await authClient.get("/enterprise-reports/report-widget");
      return response.data;
    } catch (error) {
      console.error("Error fetching report widget:", error);
      throw error;
    }
  },

  getCollectionTrends: async (): Promise<BaseResponse<CollectionTrend[]>> => {
    try {
      const response = await authClient.get("/enterprise-reports/collection-trends");
      return response.data;
    } catch (error) {
      console.error("Error fetching collection trends:", error);
      throw error;
    }
  },

  getWasteDistribution: async (): Promise<BaseResponse<WasteDistribution[]>> => {
    try {
      const response = await authClient.get("/enterprise-reports/waste-distribution");
      return response.data;
    } catch (error) {
      console.error("Error fetching waste distribution:", error);
      throw error;
    }
  },

  getCollectorPerformance: async (page: number = 0, size: number = 5): Promise<BaseResponse<SpringPaginatedResponse<CollectorPerformance>>> => {
    try {
      const response = await authClient.get("/enterprise-reports/collector-performance", {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching collector performance:", error);
      throw error;
    }
  }
};
