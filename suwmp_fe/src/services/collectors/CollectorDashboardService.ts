import authClient from "@/config/axios";
import type {
  DashboardSummary,
  DashboardTask,
  DashboardFeedback,
  DashboardResponse,
} from "@/types/collector-dashboard";

export const CollectorDashboardService = {
  getSummary: async () => {
    try {
      const response = await authClient.get<DashboardResponse<DashboardSummary>>(
        "/collector-dashboard/summary"
      );
      return {
        success: true,
        data: response.data?.data ?? null,
      };
    } catch (error: any) {
      console.error("Error fetching dashboard summary:", error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || "Failed to fetch summary",
      };
    }
  },

  getTasks: async (lat?: number, lng?: number) => {
    try {
      const params: Record<string, number> = {};
      if (lat !== undefined && lng !== undefined) {
        params.lat = lat;
        params.lng = lng;
      }
      const response = await authClient.get<DashboardResponse<DashboardTask[]>>(
        "/collector-dashboard/tasks",
        { params }
      );
      return {
        success: true,
        data: response.data?.data ?? [],
      };
    } catch (error: any) {
      console.error("Error fetching dashboard tasks:", error);
      return {
        success: false,
        data: [] as DashboardTask[],
        error: error.response?.data?.message || "Failed to fetch tasks",
      };
    }
  },

  getFeedbacks: async () => {
    try {
      const response = await authClient.get<DashboardResponse<DashboardFeedback[]>>(
        "/collector-dashboard/feedbacks"
      );
      return {
        success: true,
        data: response.data?.data ?? [],
      };
    } catch (error: any) {
      console.error("Error fetching dashboard feedbacks:", error);
      return {
        success: false,
        data: [] as DashboardFeedback[],
        error: error.response?.data?.message || "Failed to fetch feedbacks",
      };
    }
  },
};
