export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ApiError {
  message?: string;
  [key: string]: any;
}
