import authClient from "@/config/axios";
import type { ReportHistory } from "@/types/reportHistory";

export const ReportHistoryService = {
    async getMyReportHistory(): Promise<ReportHistory[]> {
        const res = await authClient.get("/citizen/reports/history");
        return res.data;
    },
};
