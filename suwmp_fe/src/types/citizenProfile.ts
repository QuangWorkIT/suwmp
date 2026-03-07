export interface CitizenProfileGetResponse {
    citizenId: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    points: number;
    reports: number;
    volume: number;
    feedbacks: number;
}