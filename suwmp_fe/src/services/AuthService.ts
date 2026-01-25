import authClient from "../config/axios";
import type { RegisterRequest, ResetPasswordRequest } from "../types/auth";

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

  verifyEmail: async (email: string) => {
    try {
      await authClient.post(
        "/auth/forgot-password",
        { email },
        { withCredentials: true },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    try {
      await authClient.post("/auth/reset-password", payload, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
