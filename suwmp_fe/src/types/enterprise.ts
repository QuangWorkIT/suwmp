export interface EnterpriseProfileGetResponse {
    id: number;
    name: string;
    description: string;
    rating: number;
    photoUrl: string;
    createdAt: string;
}

export type Enterprise = {
    name: string,
    photoUrl: string,
    description: string,
}