import authClient from "../config/axios";
import type {
  Collector,
  CreateCollectorRequest,
  UpdateCollectorRequest,
  BaseResponse,
  PaginatedResponse,
} from "../types/collector";

export const CollectorService = {
  getCollectors: async (
    enterpriseId: number,
    page: number = 0,
    size: number = 20
  ) => {
    try {
      const response = await authClient.get<
        BaseResponse<PaginatedResponse<Collector>>
      >(`/v1/enterprises/${enterpriseId}/collectors`, {
        params: { page, size, sort: "id" },
      });

      return {
        success: true,
        data: response.data?.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch collectors";
      console.error("Error fetching collectors:", error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },

  createCollector: async (
    enterpriseId: number,
    data: CreateCollectorRequest
  ) => {
    try {
      const response = await authClient.post<
        BaseResponse<Collector>
      >(`/v1/enterprises/${enterpriseId}/collectors`, data);

      return {
        success: true,
        data: response.data?.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create collector";
      console.error("Error creating collector:", error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },

  updateCollector: async (
    enterpriseId: number,
    collectorId: string,
    data: UpdateCollectorRequest
  ) => {
    try {
      const response = await authClient.put<
        BaseResponse<Collector>
      >(`/v1/enterprises/${enterpriseId}/collectors/${collectorId}`, data);

      return {
        success: true,
        data: response.data?.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update collector";
      console.error("Error updating collector:", error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },

  deleteCollector: async (enterpriseId: number, collectorId: string) => {
    try {
      const response = await authClient.delete(
        `/v1/enterprises/${enterpriseId}/collectors/${collectorId}`
      );

      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to delete collector";
      console.error("Error deleting collector:", error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },
};
