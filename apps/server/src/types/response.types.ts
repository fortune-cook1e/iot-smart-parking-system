export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message: string;
}

export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 'success',
    data,
    message,
  };
}

export function errorResponse(message: string): ApiResponse {
  return {
    status: 'error',
    message,
  };
}

// Extend Express Response type
declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, message?: string): Response;
    }
  }
}
