export interface Collector {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "IDLE" | "OFFLINE";
  imageUrl?: string | null;
  createdAt: string;
}

export interface CreateCollectorRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateCollectorRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CollectorStats {
  totalCollectors: number;
  activeNow: number;
  tasksToday: number;
  avgRating: number;
}

export interface BaseResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
