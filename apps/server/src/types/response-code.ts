/**
 * Custom response codes for API
 */
export enum ResponseCode {
  // Success codes (10000 - 19999)
  SUCCESS = 10000, // 通用成功
  CREATED = 10001, // 创建成功
  UPDATED = 10002, // 更新成功
  DELETED = 10003, // 删除成功

  // Client error codes (40000 - 49999)
  BAD_REQUEST = 40000, // 请求参数错误
  UNAUTHORIZED = 40001, // 未认证（未登录）
  TOKEN_EXPIRED = 40002, // Token 过期
  TOKEN_INVALID = 40003, // Token 无效
  FORBIDDEN = 40004, // 无权限
  NOT_FOUND = 40005, // 资源不存在
  CONFLICT = 40009, // 资源冲突（如：用户已存在）
  VALIDATION_ERROR = 40010, // 数据验证失败

  // Server error codes (50000 - 59999)
  INTERNAL_ERROR = 50000, // 服务器内部错误
  DATABASE_ERROR = 50001, // 数据库错误
  EXTERNAL_API_ERROR = 50002, // 外部 API 错误
}

/**
 * Get description for response code
 */
export function getCodeDescription(code: ResponseCode): string {
  const descriptions: Record<ResponseCode, string> = {
    [ResponseCode.SUCCESS]: 'Success',
    [ResponseCode.CREATED]: 'Created successfully',
    [ResponseCode.UPDATED]: 'Updated successfully',
    [ResponseCode.DELETED]: 'Deleted successfully',

    [ResponseCode.BAD_REQUEST]: 'Bad request',
    [ResponseCode.UNAUTHORIZED]: 'Unauthorized',
    [ResponseCode.TOKEN_EXPIRED]: 'Token expired',
    [ResponseCode.TOKEN_INVALID]: 'Token invalid',
    [ResponseCode.FORBIDDEN]: 'Forbidden',
    [ResponseCode.NOT_FOUND]: 'Not found',
    [ResponseCode.CONFLICT]: 'Conflict',
    [ResponseCode.VALIDATION_ERROR]: 'Validation error',

    [ResponseCode.INTERNAL_ERROR]: 'Internal server error',
    [ResponseCode.DATABASE_ERROR]: 'Database error',
    [ResponseCode.EXTERNAL_API_ERROR]: 'External API error',
  };

  return descriptions[code] || 'Unknown error';
}
