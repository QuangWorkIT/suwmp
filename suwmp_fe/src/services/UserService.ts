import authClient from "../config/axios";

export interface CreateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
}

export interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    activityStatus: string | null;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: {
        content: T[];
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
        first: boolean;
        last: boolean;
    };
    message: string;
    success: boolean;
}

export const UserService = {
    createUser: async (payload: CreateUserRequest) => {
        const response = await authClient.post("/users", payload);
        return response.data;
    },

    getUsers: async (pageNumber: number = 0, pageSize: number = 10): Promise<PaginatedResponse<UserResponse>> => {
        const response = await authClient.get(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        return response.data;
    },

    updateUser: async (id: string, payload: UpdateUserRequest) => {
        const response = await authClient.put(`/users/${id}`, payload);
        return response.data;
    }
};

export interface UpdateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    status: string;
}
