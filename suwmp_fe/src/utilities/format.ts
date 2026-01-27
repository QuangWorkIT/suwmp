import type { WasteReportEnterprise } from "@/types/WasteReportRequest";
import { reverseGeocode } from "./geocoding";

export const standardizeWasteReportRequest = async (req: WasteReportEnterprise) => {
    const address  = await reverseGeocode(req.requestLongitude, req.requestLatitude);
    console.log(address);
    return {
        requestId: req.requestId,
        wasteTypeName: req.wasteTypeName,
        volume: req.volume,
        zone: "Zone A",
        address: address,
        citizenName: req.citizenName,
        citizenPhone: req.citizenPhone,
        currentStatus: req.currentStatus,
        priority: "normal",
        collectorName: req.collectorName,
        createdAt: req.createdAt,
        enterprisesId: req.enterprisesId
    }
}