import authClient from "@/config/axios";
import type { BaseResponse } from "@/types/baseResponse";
import type { CollectionLogHistory } from "@/types/collectionLog";
import type { CreateCollectionLogReq } from "@/types/collectorTask";
import type { PaginatedResponse } from "@/types/response";
import s3Service from "@/services/waste-reports/S3Service";
import { reverseGeocode } from "@/utilities/geocoding";

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
    },
    getCollectionLogHistory: async (page: number, size: number): Promise<PaginatedResponse<CollectionLogHistory>> => {
        try {
            const response = await authClient.get("/collection-logs/history", {
                params: { page, size }
            })

            const historyLogPromise = response.data.data.map(async (e: CollectionLogHistory) => {
                try {
                    const [photoRes, address] = await Promise.all([
                        s3Service.getImage(e.proofPhotoUrl).catch(() => ({ data: "" })),
                        reverseGeocode(e.wasteReportLongitude, e.wasteReportLatitude).catch(() => "Unknown Address")
                    ]);

                    return {
                        ...e,
                        address: address,
                        photo: photoRes.data || ""
                    };
                } catch (itemError) {
                    console.error(`Error processing e ${e.id}:`, itemError);
                    return {
                        ...e,
                        address: "Unknown Address",
                        photo: ""
                    };
                }
            })

            const content = await Promise.all(historyLogPromise)

            return { ...response.data, data: content }
        } catch (error) {
            console.log("Fail to get collection log history")
            throw new Error("Fail to get collection log history")
        }
    }
}
