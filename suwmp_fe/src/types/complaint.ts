export interface Complaint {
    id: number;
    citizenId: string;
    wasteReportId: string;
    description: string;
    imageUrl?: string | null;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    createdAt: string;
}
