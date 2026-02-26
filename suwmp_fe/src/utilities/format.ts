import type { WasteReportEnterprise } from "@/types/WasteReportRequest";
import { reverseGeocode } from "./geocoding";

export const standardizeWasteReportRequest = async (req: WasteReportEnterprise) => {
    try {
        const address = await reverseGeocode(req.requestLongitude, req.requestLatitude);
        return {
            ...req,
            priority: "normal",
            zone: "Zone A",
            address: address,
        }
    } catch (error) {
        console.log("Reverse geocoding failed: ", error);
        return {
            ...req,
            priority: "normal",
            zone: "Zone A",
            address: "",
        }
    }
}