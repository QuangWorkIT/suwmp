import authClient from "@/config/axios";
import type { Complaint, ComplaintGetResponse, ComplaintUpdateStatusWithReportIdRequest, PaginatedComplaints } from "@/types/complaint";

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

    getComplaintWithWasteReportById: async (id: number): Promise<ComplaintGetResponse> => {
        try {
            const response = await authClient.get(`/complaints/${id}/with-waste-report`);
            return response.data?.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateComplaintStatusWithWasteReportId: async (newWasteTypeId: number, payload:ComplaintUpdateStatusWithReportIdRequest) => {
        try {
            await authClient.put(`/complaints/${newWasteTypeId}/update-status`, payload);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
