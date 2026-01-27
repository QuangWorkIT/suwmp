export type WasteReportRequest = {
    photoUrl: string;
    longitude: number;
    latitude: number;
    description: string;
    enterprisesId: number;
    citizenId: string;
    wasteTypeId: number;
    aiSuggestedTypeId: number;
    status: string
}


export type WasteReportEnterprise = {
    requestId: number;
    wasteTypeName: string;
    volume: string;
    zone: string;
    requestLongitude: number;
    requestLatitude: number;
    address: string;
    citizenName: string;
    citizenPhone: string;
    currentStatus: string;
    priority: string;
    collectorName: string;
    createdAt: string;
    enterprisesId: number;
}