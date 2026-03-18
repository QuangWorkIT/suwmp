export interface EnterpriseProfileGetResponse {
    id: number;
    name: string;
    description: string;
    rating: number;
    photoUrl: string;
    createdAt: string;
}

export interface EnterpriseProfileUpdateRequest {
    id: number;
    name: string;
    description: string;
    photoUrl: string;
}