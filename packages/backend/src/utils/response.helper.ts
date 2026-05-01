/**
 * Standard API Response Structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

/**
 * Format a success response
 */
export const sendSuccess = <T>(data: T, message: string = "OK"): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

/**
 * Format an error response and set the HTTP status code
 */
export const sendError = (set: any, message: string, status: number = 500): ApiResponse<null> => {
  set.status = status;
  return {
    success: false,
    data: null,
    message,
  };
};
