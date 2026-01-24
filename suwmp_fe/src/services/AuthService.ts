import authClient from "../config/axios";
import type { RegisterRequest } from "../types/auth";

export const AuthService = {
  register: async (payload: RegisterRequest) => {
    try {
      console.log(payload);
      const response = await authClient.post("/auth/register", payload);

      return {
        success: true,
        data: response.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      console.log(error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },
};
