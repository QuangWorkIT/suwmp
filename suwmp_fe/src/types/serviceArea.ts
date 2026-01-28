export interface ServiceArea {
  id: number;
  enterpriseId: number;
  latitude: number;
  longitude: number;
  radius: number; // meters
}

export interface BaseResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface CreateServiceAreaRequest {
  latitude: number;
  longitude: number;
  radius: number;
}

