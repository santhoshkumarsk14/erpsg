import axios, { AxiosError, AxiosResponse } from 'axios';
import { useToastHelpers } from '../contexts/ToastContext';

/**
 * Interface for API error response
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

/**
 * Interface for API success response
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * Extract error message from API error response
 * @param error - The axios error object
 * @returns The error message
 */
export const extractErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  // Default error message
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    
    if (data.message) {
      errorMessage = data.message;
    } else if (data.errors) {
      // Combine all error messages
      const messages = Object.values(data.errors).flat();
      if (messages.length > 0) {
        errorMessage = messages.join('. ');
      }
    }
    
    // Add status code for specific errors
    if (status === 401) {
      errorMessage = 'Unauthorized: ' + errorMessage;
    } else if (status === 403) {
      errorMessage = 'Forbidden: ' + errorMessage;
    } else if (status === 404) {
      errorMessage = 'Not Found: ' + errorMessage;
    } else if (status === 500) {
      errorMessage = 'Server Error: ' + errorMessage;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || errorMessage;
  }
  
  return errorMessage;
};

/**
 * Handle API error and show toast notification
 * @param error - The axios error object
 * @param customMessage - Optional custom error message
 */
export const handleApiError = (error: AxiosError<ApiErrorResponse>, customMessage?: string): string => {
  const errorMessage = customMessage || extractErrorMessage(error);
  
  // Log error for debugging
  console.error('API Error:', error);
  
  return errorMessage;
};

/**
 * Custom hook for handling API errors with toast notifications
 */
export const useApiErrorHandler = () => {
  const { error: showErrorToast } = useToastHelpers();
  
  return (err: AxiosError<ApiErrorResponse>, customMessage?: string) => {
    const errorMessage = handleApiError(err, customMessage);
    showErrorToast(errorMessage);
    return errorMessage;
  };
};

/**
 * Process API response data
 * @param response - The axios response object
 * @returns The processed data
 */
export const processApiResponse = <T extends object>(
  response: AxiosResponse<ApiSuccessResponse<T> | T>
): T => {
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as ApiSuccessResponse<T>).data;
  }
  return response.data as T;
};

/**
 * Create a query string from parameters
 * @param params - The parameters object
 * @returns The query string
 */
export const createQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(`${key}[]`, String(item)));
      } else {
        queryParams.append(key, String(value));
      }
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Parse query string to object
 * @param queryString - The query string to parse
 * @returns The parsed object
 */
export const parseQueryString = (queryString: string): Record<string, string | string[]> => {
  const params: Record<string, string | string[]> = {};
  const searchParams = new URLSearchParams(queryString.startsWith('?') ? queryString.substring(1) : queryString);
  
  searchParams.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const arrayKey = key.slice(0, -2);
      if (!params[arrayKey]) {
        params[arrayKey] = [];
      }
      (params[arrayKey] as string[]).push(value);
    } else {
      params[key] = value;
    }
  });
  
  return params;
};

/**
 * Retry a failed API request
 * @param apiCall - The API call function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns The API response
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry for certain error types
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          throw error;
        }
      }
      
      // Wait before next retry
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Download a file from API response
 * @param response - The axios response object
 * @param filename - The filename to save as
 */
export const downloadFile = (response: AxiosResponse, filename?: string): void => {
  const contentDisposition = response.headers['content-disposition'];
  let downloadFilename = filename;
  
  // Extract filename from Content-Disposition header if not provided
  if (!downloadFilename && contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch && filenameMatch[1]) {
      downloadFilename = filenameMatch[1];
    }
  }
  
  // Fallback filename
  if (!downloadFilename) {
    downloadFilename = 'download';
    
    // Try to add appropriate extension based on content type
    const contentType = response.headers['content-type'];
    if (contentType) {
      if (contentType.includes('pdf')) {
        downloadFilename += '.pdf';
      } else if (contentType.includes('excel') || contentType.includes('spreadsheetml')) {
        downloadFilename += '.xlsx';
      } else if (contentType.includes('csv')) {
        downloadFilename += '.csv';
      }
    }
  }
  
  // Create a blob from the response data
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  
  // Create a link element and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', downloadFilename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};