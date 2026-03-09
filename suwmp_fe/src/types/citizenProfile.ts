export interface CitizenProfileGetResponse {
    citizenId: string;
    fullName: string;
    phone: string;
    email: string;
    createdAt: string;
    points: number;
    reports: number;
    volume: number;
    feedbacks: number;
}

export interface CitizenProfileUpdateRequest {
    fullName: string;
    phone: string;
    email: string;
}