export interface Complaint {
    id: number;
    citizenName: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    createdAt?: string | null;
    photoUrl?: string | null;
}

export interface ComplaintGetResponse {
    id: number;
    citizenId: string;
    citizenName: string;
    wasteReportId: number;
    description: string;
    photoUrl?: string | null;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    createdAt: string;
}

export interface PaginatedComplaints {
    content: Complaint[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface ComplaintUpdateStatusWithReportIdRequest {
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
}