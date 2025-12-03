import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

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
