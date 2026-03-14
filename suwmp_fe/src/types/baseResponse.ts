export interface BaseResponse<T> {
  success: boolean;
  isSuccess: boolean;
  message: string;
  data: T;
}
