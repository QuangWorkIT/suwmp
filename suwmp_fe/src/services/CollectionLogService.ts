import authClient from "@/config/axios";
import type { BaseResponse } from "@/types/baseResponse";
import type { CreateCollectionLogReq } from "@/types/collectorTask";

export const collectionLogService = {
    createCollectionLog: async (payload: CreateCollectionLogReq): Promise<BaseResponse<number>> => {
        try {
            const response = await authClient.post("/collection-logs", payload)
            return {
                isSuccess: true,
                message: response.data.message,
                data: response.data.data
            }
        } catch (error) {
            console.log("Fail to create log")
            return {
                isSuccess: false,
                message: "Fail to create collection log",
                data: -1
            }
        }
    }
}
