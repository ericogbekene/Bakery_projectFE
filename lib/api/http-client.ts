import ENDPOINTS from "@/constants/endpoints";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * HTTP Client for MC Cakes Django API
 */
class HttpClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // FIX: was ENDPOINTS.EXTERNAL_API which no longer exists.
    // Now correctly reads ENDPOINTS.BASE_URL which maps to
    // NEXT_PUBLIC_API_URL env var (http://localhost:8000/api in dev).
    this.client = axios.create({
      baseURL: ENDPOINTS.BASE_URL,
      timeout: 10000,
      withCredentials: true, // FIX: required for Django session-based guest cart
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors(): void {
    // Request interceptor — attach Bearer token if present
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor — handle 401 with token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            return this.client.request(error.config);
          } catch {
            this.clearTokens();
            // Only redirect in browser context
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private loadTokenFromStorage(): void {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    }
  }

  setRefreshToken(token: string | null): void {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("refresh_token", token);
      } else {
        localStorage.removeItem("refresh_token");
      }
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  }

  clearTokens(): void {
    this.setToken(null);
    this.setRefreshToken(null);
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await this.client.post(ENDPOINTS.EXTERNAL.AUTH.REFRESH, {
      refresh: refreshToken,
    });

    if (response.data.access) {
      this.setToken(response.data.access);
    } else {
      this.clearTokens();
      throw new Error("No access token in refresh response");
    }
  }

  private async request<T = unknown>(
    endpoint: string,
    options: AxiosRequestConfig = {},
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
        const errorData = error.response.data || {};
        throw new APIError(
          error.response.status,
          errorData,
          errorData.detail || errorData.message || error.response.statusText,
        );
      } else if (error.request) {
        throw new APIError(
          0,
          {},
          "Network error. Please check your connection.",
        );
      } else {
        throw new APIError(
          0,
          {},
          error.message || "An unexpected error occurred",
        );
      }
    }
  }

  async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", ...config });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", data, ...config });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", data, ...config });
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", data, ...config });
  }

  async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", ...config });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async healthCheck(): Promise<{
    status: string;
    responseTime: number;
    timestamp: string;
  }> {
    const start = Date.now();
    try {
      await this.get(ENDPOINTS.EXTERNAL.HEALTH);
      return {
        status: "healthy",
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: "unhealthy",
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const httpClient = new HttpClient();
export default httpClient;
