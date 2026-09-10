import { axiosInstance, ApiError, normalizeApiError } from './axios';

export { ApiError, normalizeApiError, axiosInstance };

/**
 * Legacy compatibility wrapper for apiClient calling through centralized Axios instance.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  let data: any = undefined;

  if (options.body) {
    if (typeof options.body === 'string') {
      try {
        data = JSON.parse(options.body);
      } catch {
        data = options.body;
      }
    } else {
      data = options.body;
    }
  }

  const response = await axiosInstance.request<T>({
    url: endpoint,
    method,
    data,
    headers: options.headers as any,
  });

  return response.data;
}
