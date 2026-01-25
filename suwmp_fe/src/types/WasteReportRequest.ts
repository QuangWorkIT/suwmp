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