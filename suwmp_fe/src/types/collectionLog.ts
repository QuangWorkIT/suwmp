import type { WasteReportStatus } from "./WasteReportRequest";

export type CollectionLogHistory = {
    id: number;
    wasteReportId: number;
    collectorId: string;
    proofPhotoUrl: string;
    photo: string;
    collectedTime: Date;
    wasteReportLongitude: number;
    wasteReportLatitude: number;
    address: string;
    wasteReportWeight: number;
    wasteReportStatus: WasteReportStatus;
    points: number;
    wasteTypeName: string;
}