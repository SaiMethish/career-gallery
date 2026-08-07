/** Normalized API error shape used throughout the app */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp?: string;
}
