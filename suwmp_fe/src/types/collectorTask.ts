export type AssignedTask = {
    requestId: number;
    wasteTypeName: string;
    requestLongitude: number;
    requestLatitude: number;
    volume: number;
    priority: string;
    currentStatus: string;
    citizenName: string;
    citizenPhone: string;
    collectorId: string;
    collectTime: string;
    photoUrl: string;
    address: string;
    description: string,
    assignmentId: number
}

export type CreateCollectionLogReq = {
    wasteReportId: number,
    collectionAssignmentId: number,
    photoUrl: string,
    collectorId: string
}