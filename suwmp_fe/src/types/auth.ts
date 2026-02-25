export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message?: string;
  [key: string]: any;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}
