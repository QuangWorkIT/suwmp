import authClient from "@/config/axios";
import type { Complaint, PaginatedComplaints } from "@/types/complaint";

export const ComplaintService = {
    getComplaints: async (page: number = 0, size: number = 5): Promise<{ data: PaginatedComplaints; message: string; success: boolean }> => {
        try {
            const response = await authClient.get(`/complaints?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getComplaintsByUser: async (page: number = 0, size: number = 5): Promise<{ data: PaginatedComplaints; message: string; success: boolean }> => {
        try {
            const response = await authClient.get(`/complaints/user?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getComplaintById: async (id: number): Promise<{ data: Complaint; message: string; success: boolean }> => {
        try {
            const response = await authClient.get(`/complaints/${id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateComplaintStatus: async (id: number, status: "OPEN" | "IN_PROGRESS" | "RESOLVED"): Promise<{ data: Complaint; message: string; success: boolean }> => {
        try {
            const response = await authClient.patch(`/complaints/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createComplaint: async (wasteReportId: number, description: string, photoUrl?: string | null): Promise<{ data: Complaint; message: string; success: boolean }> => {
        try {
            const response = await authClient.post(`/complaints`, {
                wasteReportId,
                description,
                photoUrl: photoUrl ?? null,
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
