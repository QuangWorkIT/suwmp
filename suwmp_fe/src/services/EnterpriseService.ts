import authClient from "@/config/axios";
import type { BaseResponse } from "@/types/baseResponse";
import type { EnterpriseProfileGetResponse, EnterpriseProfileUpdateRequest } from "@/types/enterprise";

export const EnterpriseService = {
    getEnterpriseProfile: async (enterpriseUserId: string): Promise<BaseResponse<EnterpriseProfileGetResponse>> => {
        try {
            const safeEnterpriseUserId = encodeURIComponent(enterpriseUserId);
            const res = await authClient.get(`/enterprises/${safeEnterpriseUserId}/profile`);
            return res.data;
        } catch (error) {
            console.error("Error fetching enterprise profile:", error);
            throw error;
        }
    },
    
    updateEnterpriseProfile: async (enterpriseId: number, enterpriseUserId: string, data: EnterpriseProfileUpdateRequest) => {
        try {
            const safeEnterpriseUserId = encodeURIComponent(enterpriseUserId);
            await authClient.put(`/enterprises/${enterpriseId}/${safeEnterpriseUserId}/profile`, data);
        } catch (error: any) {
            console.error("Error updating enterprise profile:", error);
            throw error;
        }
    }
}

export default EnterpriseService