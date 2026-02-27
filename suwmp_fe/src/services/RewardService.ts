import authClient from "@/config/axios";
import type { RewardTransaction } from "@/types/rewardTransaction";

export const RewardService = {
  async getMyRewards(): Promise<RewardTransaction[]> {
    const res = await authClient.get("citizen/rewards");
    return res.data;
  },
};
