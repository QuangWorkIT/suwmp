export interface BaseResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}
