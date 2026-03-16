import authClient from "../config/axios";

export interface CreateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    password: string;
    enterpriseName: string;
    enterpriseDescription: string;
    enterprisePhoto: string;
}

export interface UserResponse {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    activityStatus: string | null;
    createdAt: string;
    image_url: string;
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
        try {
            const response = await authClient.post("/users", payload);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    getUsers: async (pageNumber: number = 0, pageSize: number = 6): Promise<PaginatedResponse<UserResponse>> => {
        try {
            const response = await authClient.get(`/users?page=${pageNumber}&size=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    updateUser: async (id: string, payload: UpdateUserRequest) => {
        try {
            const response = await authClient.put(`/users/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    deleteUser: async (id: string) => {
        try {
            const response = await authClient.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    searchUsers: async (keyword: string, pageNumber: number = 0, pageSize: number = 6): Promise<PaginatedResponse<UserResponse>> => {
        try {
            const response = await authClient.get(`/users/search?page=${pageNumber}&size=${pageSize}&keyword=${keyword}`);
            return response.data;
        } catch (error) {
            console.error("Error searching users:", error);
            throw error;
        }
    },

    // Fetch all users without pagination (for client-side filtering)
    getAllUsers: async (): Promise<PaginatedResponse<UserResponse>> => {
        try {
            const response = await authClient.get(`/users?size=10000`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }
};

export interface UpdateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    status: string;
}
