export interface ApiResponse<T> {
  code: number;
  status: 'success' | 'error';
  data?: T;
  message: string;
}
