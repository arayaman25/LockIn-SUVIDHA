import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;
  code?: string;

  constructor(message: string, statusCode = 0, data?: unknown, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Normalizes unknown or Axios errors into a consistent, citizen-friendly ApiError.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    let userMessage = 'Unable to connect to the service. Please check your internet connection or try again later.';

    // Extract message from server response if available
    if (data && typeof data === 'object') {
      const errObj = data as Record<string, unknown>;
      if (typeof errObj.message === 'string' && errObj.message.trim()) {
        userMessage = errObj.message;
      } else if (typeof errObj.error === 'string' && errObj.error.trim()) {
        userMessage = errObj.error;
      } else if (errObj.error && typeof errObj.error === 'object') {
        const nestedErr = errObj.error as Record<string, unknown>;
        if (typeof nestedErr.message === 'string' && nestedErr.message.trim()) {
          userMessage = nestedErr.message;
        }
      }
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'The request timed out. Please try again.';
    } else if (error.message && !error.message.includes('Network Error')) {
      userMessage = error.message;
    }

    return new ApiError(userMessage, status, data, error.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, undefined, error.name);
  }

  return new ApiError('An unexpected error occurred. Please try again.', 0, error);
}

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3001';
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: Support future Auth tokens seamlessly
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token =
        localStorage.getItem('suvidha_auth_token') ||
        sessionStorage.getItem('suvidha_auth_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

// Response interceptor: Normalize all errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeApiError(error))
);
