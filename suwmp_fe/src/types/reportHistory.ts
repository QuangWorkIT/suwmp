export type ReportStatus =
    | "PENDING"
    | "ASSIGNED"
    | "ON_THE_WAY"
    | "COLLECTED"
    | "REJECTED";

export interface ReportHistory {
    id: number;
    status: ReportStatus;
    volume: number;
    latitude: number;
    longitude: number;
    photoUrl: string;
    createdAt: string;
    wasteTypeName: string;
    rewardPoints: number;
}
