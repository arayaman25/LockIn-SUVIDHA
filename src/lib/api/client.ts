export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}/${endpoint.replace(/^\//, '')}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  console.log(`[API Request] ${options.method || 'GET'} ${url}`, options.body ? options.body : '');

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    console.log(`[API Response] ${response.status} ${url}:`, responseData);

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      if (responseData && typeof responseData === 'object') {
        const anyData = responseData as Record<string, unknown>;
        if (typeof anyData.error === 'string') {
          errorMessage = anyData.error;
        } else if (typeof anyData.message === 'string') {
          errorMessage = anyData.message;
        } else if (anyData.error && typeof anyData.error === 'object') {
          const errObj = anyData.error as Record<string, unknown>;
          if (typeof errObj.message === 'string') {
            errorMessage = errObj.message;
          }
        }
      }

      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error: unknown) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error);
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(
        error.message || 'Unable to connect to the server. Please ensure the backend is running.',
        0,
        error
      );
    }
    throw new ApiError('An unknown network error occurred.', 0, error);
  }
}
