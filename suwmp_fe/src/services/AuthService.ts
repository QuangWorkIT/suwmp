import { api } from "@/config/api";
import type { LoginRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth";
import type { SendPasswordDto } from "@/types/emailSend";
import type { BaseResponse } from "@/types/baseResponse";

export const AuthService = {
  login: async (payload: LoginRequest) => {
    try {
      const response = await api.post("/auth/login", payload);

      return {
        success: true,
        data: response.data.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      console.log(error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh-token", {}, {
        withCredentials: true,
      });

      return {
        success: true,
        data: response.data.data ?? null,
        status: response.status,
      };
    } catch (error: any) {
      const message = error.response?.data?.error || "Refresh token failed";
      console.log(error);

      return {
        success: false,
        error: message,
        status: error.response?.status,
      };
    }
  },
  register: async (payload: RegisterRequest) => {
    try {
      const response = await api.post("/auth/register", payload);

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
      await api.post(
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
      await api.post("/auth/reset-password", payload, {
        withCredentials: true,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  loginByGoogle: async (idToken: string) => {
    try {
      const response = await api.post("/auth/google/login", { idToken });

      return response.data;
    } catch (error: any) {
      console.log({
        title: error.response?.data?.title,
        message: error.response?.data?.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  registerByGoogle: async (idToken: string): Promise<BaseResponse<SendPasswordDto>> => {
    try {
      const response = await api.post("/auth/google/register", { idToken });

      return response.data;
    } catch (error: any) {
      console.log({
        title: error.response?.data?.title,
        message: error.response?.data?.message,
        status: error.response?.status
      });
      throw error;
    }
  },
};
