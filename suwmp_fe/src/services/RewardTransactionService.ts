import authClient from "@/config/axios";
import type { BaseResponse } from "@/types/baseResponse";
import type { CreateRewardTransactionRequest } from "@/types/RewardTransaction";

export const RewardTransactionService = {
    createRewardTransaction: async (request: CreateRewardTransactionRequest): Promise<BaseResponse<number>> => {
        try {
            const res = await authClient.post("/reward-transactions", request);
            return {
                isSuccess: true,
                message: res.data.message,
                data: res.data.data
            };
        } catch (error) {
            return {
                isSuccess: false,
                message: "Failed to create reward transaction",
                data: -1
            };
        }
    }
}