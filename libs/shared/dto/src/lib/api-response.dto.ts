/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  path?: string;
}

/**
 * Helper to create successful response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  path?: string,
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    path,
  };
}

/**
 * Helper to create error response
 */
export function createErrorResponse(
  message: string,
  path?: string,
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    message,
    timestamp: new Date().toISOString(),
    path,
  };
}
