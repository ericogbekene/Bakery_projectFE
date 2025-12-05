import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ENDPOINTS from '@/constants/endpoints';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * HTTP Client for M&C Cakes API
 * Handles authentication, error handling, and request/response interceptors
 */
class HttpClient {
  private client: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = ENDPOINTS.EXTERNAL_API;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'M&C-Cakes-Frontend/1.0',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          try {
            await this.refreshToken();
            // Retry the original request
            return this.client.request(error.config);
          } catch {
            // If refresh fails, clear tokens and redirect to login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
    }
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string | null): void {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('refresh_token', token);
      } else {
        localStorage.removeItem('refresh_token');
      }
    }
  }

  /**
   * Get refresh token
   */
  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.setToken(null);
    this.setRefreshToken(null);
  }

  /**
   * Refresh access token
   */
  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.client.post(ENDPOINTS.EXTERNAL.AUTH.REFRESH, {
        refresh: refreshToken,
      });

      if (response.data.access) {
        this.setToken(response.data.access);
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Generic request method with error handling
   */
  private async request<T = unknown>(
    endpoint: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        url: endpoint,
        ...options,
      });

      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data || {};
        throw new APIError(
          error.response.status,
          errorData,
          errorData.detail || errorData.message || error.response.statusText
        );
      } else if (error.request) {
        // Network error
        throw new APIError(0, {}, 'Network error. Please check your connection.');
      } else {
        // Other error
        throw new APIError(0, {}, error.message || 'An unexpected error occurred');
      }
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data,
      ...config,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data,
      ...config,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      data,
      ...config,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: string;
    responseTime: number;
    timestamp: string;
  }> {
    const start = Date.now();
    try {
      await this.get(ENDPOINTS.EXTERNAL.HEALTH);
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
export const httpClient = new HttpClient();
export default httpClient;