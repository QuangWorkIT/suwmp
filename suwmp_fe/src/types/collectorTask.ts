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
    photoUrl?: string | null;
    address?: string;
}