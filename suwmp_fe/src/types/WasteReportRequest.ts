export type WasteReportRequest = {
    photoUrl: string | null;
    longitude: number;
    latitude: number;
    description: string;
    enterprisesId: number;
    citizenId: string;
    wasteTypeId: number;
    aiSuggestedTypeId: number;
    status: string;
};

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
    enterpriseId: number;
}

export type NearbyEnterpriseRequest = {
    longitude: number;
    latitude: number;
    wasteTypeId: number;
}

export type NearbyEnterpriseResponse = {
    id: number;
    name: string;
    description: string;
    rating: number;
    photoUrl: string;
    createdAt: string;
    distance: number;
    rewardPoints: number;
}


export type CancelWasteReportRequest = {
    wasteReportId: number;
    note: string;
}

export type CitizenWasteReportStatus = {
    id: number;
    referenceCode: string;
    status: "PENDING" | "ACCEPTED" | "ASSIGNED" | "COLLECTED";
    createdAt: string;
    wasteTypeName: string | null;
    enterpriseName: string | null;
    collectorName: string | null;
    latitude: number;
    longitude: number;
    volume?: number | null;
    photoUrl: string | null;
    description?: string | null;
    rewardPoints?: number | null;
    classificationConfidence?: number | null;
};
export type AttachmentResponse = {
    id: number;
    url: string;
    fileName: string;
    uploadedAt: string;
};
