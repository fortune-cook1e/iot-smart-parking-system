import { ResponseCode } from './response-code';

export interface ApiResponse<T = unknown> {
  code: ResponseCode;
  status: 'success' | 'error';
  data?: T;
  message: string;
}

export function successResponse<T>(
  data: T,
  message = 'Success',
  code: ResponseCode = ResponseCode.SUCCESS
): ApiResponse<T> {
  return {
    code,
    status: 'success',
    data,
    message,
  };
}

export function errorResponse(
  message: string,
  code: ResponseCode = ResponseCode.INTERNAL_ERROR
): ApiResponse {
  return {
    code,
    status: 'error',
    message,
  };
}

// Extend Express Response type
// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, message?: string, code?: ResponseCode): Response;
    }
  }
}
