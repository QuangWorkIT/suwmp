import type { CreateRewardRuleRequest, UpdateRewardRuleRequest } from "@/types/rewardRule";
import authClient from "@/config/axios";

export const RewardRuleService = {
  getByEnterpriseAndWasteType: async (enterpriseId: number, wasteTypeId: number) => {
    try {
        const response = await authClient.get(`/reward-rules/enterprise/${enterpriseId}/waste-type/${wasteTypeId}`);
        return response.data;   
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  create: async (data: CreateRewardRuleRequest) => {
    try {
        await authClient.post("/reward-rules", data);
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  update: async (id: number, data: UpdateRewardRuleRequest) => {
    try {
        await authClient.put(`/reward-rules/${id}`, data);
    } catch (error) {
        console.error(error);
        throw error;
    }
  },

  delete: async (id: number) => {
    try {
        await authClient.delete(`/reward-rules/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
};
