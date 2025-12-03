import { z } from 'zod';

/**
 * Response code enum
 */
export enum ResponseCode {
  // Success codes (10000 - 19999)
  SUCCESS = 10000,
  CREATED = 10001,
  UPDATED = 10002,
  DELETED = 10003,

  // Client error codes (40000 - 49999)
  BAD_REQUEST = 40000,
  UNAUTHORIZED = 40001,
  TOKEN_EXPIRED = 40002,
  TOKEN_INVALID = 40003,
  FORBIDDEN = 40004,
  NOT_FOUND = 40005,
  CONFLICT = 40009,
  VALIDATION_ERROR = 40010,

  // Server error codes (50000 - 59999)
  INTERNAL_ERROR = 50000,
  DATABASE_ERROR = 50001,
  EXTERNAL_API_ERROR = 50002,
}

/**
 * API Response schemas
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.nativeEnum(ResponseCode),
    status: z.enum(['success', 'error']),
    data: dataSchema.optional(),
    message: z.string(),
  });

// Success response
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    code: z.nativeEnum(ResponseCode),
    status: z.literal('success'),
    data: dataSchema,
    message: z.string(),
  });

// Error response
export const ErrorResponseSchema = z.object({
  code: z.nativeEnum(ResponseCode),
  status: z.literal('error'),
  message: z.string(),
});

/**
 * TypeScript types
 */
export type ApiResponse<T = unknown> = {
  code: ResponseCode;
  status: 'success' | 'error';
  data?: T;
  message: string;
};

export type SuccessResponse<T> = {
  code: ResponseCode;
  status: 'success';
  data: T;
  message: string;
};

export type ErrorResponse = {
  code: ResponseCode;
  status: 'error';
  message: string;
};
