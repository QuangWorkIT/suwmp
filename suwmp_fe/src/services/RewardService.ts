import authClient from "@/config/axios";
import type { RewardHistory } from "@/types/RewardHistory";

export const RewardService = {
  async getMyRewards(): Promise<RewardHistory[]> {
    const res = await authClient.get("citizen/rewards");
    return res.data;
  },
};
