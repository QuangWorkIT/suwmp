import authClient from "@/config/axios";
import type {
  BaseResponse,
  CreateServiceAreaRequest,
  ServiceArea,
} from "@/types/serviceArea";

export const ServiceAreaService = {
  list: async (enterpriseId: number) => {
    try {
      const res = await authClient.get<BaseResponse<ServiceArea[]>>(
        `/v1/enterprises/${enterpriseId}/service-areas`,
      );
      return { success: true, data: res.data?.data ?? [], status: res.status };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch service areas";
      return { success: false, error: message, status: error.response?.status };
    }
  },

  create: async (enterpriseId: number, payload: CreateServiceAreaRequest) => {
    try {
      const res = await authClient.post<BaseResponse<ServiceArea>>(
        `/v1/enterprises/${enterpriseId}/service-areas`,
        payload,
      );
      return { success: true, data: res.data?.data ?? null, status: res.status };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create service area";
      return { success: false, error: message, status: error.response?.status };
    }
  },
};

