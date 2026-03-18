import authClient from "@/config/axios";
import type { BaseResponse } from "@/types/baseResponse";
import type { EnterpriseProfileGetResponse } from "@/types/enterprise";

export const EnterpriseService = {
    getEnterpriseProfile: async (enterpriseUserId: string): Promise<BaseResponse<EnterpriseProfileGetResponse>> => {
        try {
            const res = await authClient.get(`/enterprises/${enterpriseUserId}/profile`);
            return res.data;
        } catch (error) {
            console.error("Error fetching enterprise profile:", error);
            throw error;
        }
    }    
}

export default EnterpriseService