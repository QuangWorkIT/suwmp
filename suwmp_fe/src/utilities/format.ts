import type { WasteReportEnterprise } from "@/types/WasteReportRequest";
import { reverseGeocode } from "./geocoding";

export const standardizeWasteReportRequest = async (req: WasteReportEnterprise) => {
    try {
        const address = await reverseGeocode(req.requestLongitude, req.requestLatitude);
        return {
            ...req,
            zone: "Zone A",
            address: address,
        }
    } catch (error) {
        console.log("Reverse geocoding failed: ", error);
        return {
            ...req,
            zone: "Zone A",
            address: "",
        }
    }
}

// example date: 2026-02-04T07:47:42.456Z
// output: 4 thg 2, 2026
export const dateFormat = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}