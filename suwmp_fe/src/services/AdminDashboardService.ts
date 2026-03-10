import authClient from "../config/axios";

export interface DashboardStats {
  totalUsers: number;
  userGrowth: number | null;
  activeToday: number;
  activeTodayGrowth: number | null;
  openComplaints: number;
  openComplaintsDelta: number | null;
  systemHealthPercent: number | null;
  systemHealthStatus: string;
}

export interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface DashboardComplaint {
  id: number;
  description: string;
  status: string;
  citizenName: string;
  createdAt: string;
}



const getStats = async (): Promise<{ success: boolean; data: DashboardStats; message: string }> => {
  const response = await authClient.get("/admin/dashboard/stats");
  return response.data;
};

const getUsers = async (page = 0, size = 4): Promise<{ success: boolean; data: { content: DashboardUser[], totalElements: number }; message: string }> => {
  const response = await authClient.get("/admin/dashboard/users", {
    params: { page, size },
  });
  return response.data;
};

const getOpenComplaints = async (limit = 3): Promise<{ success: boolean; data: DashboardComplaint[]; message: string }> => {
  const response = await authClient.get("/admin/dashboard/complaints/open", {
    params: { limit },
  });
  return response.data;
};




export const AdminDashboardService = {
  getStats,
  getUsers,
  getOpenComplaints,

};
