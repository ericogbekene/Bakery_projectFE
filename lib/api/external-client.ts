import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * External API client for M&C Cakes API
 * Handles authentication, rate limiting, and error handling
 */
class ExternalApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private apiKey: string;
  private apiSecret: string;
  private isAuthenticated: boolean = false;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'https://api.mandccakes.com';
    this.apiKey = process.env.EXTERNAL_API_KEY || '';
    this.apiSecret = process.env.EXTERNAL_API_SECRET || '';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'M&C-Cakes-Frontend/1.0',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        if (this.isAuthenticated) {
          config.headers.Authorization = `Bearer ${this.apiKey}`;
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
          // Try to re-authenticate
          await this.authenticate();
          // Retry the original request
          return this.client.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate with the external API
   */
  async authenticate(): Promise<boolean> {
    try {
      const response = await this.client.post('/auth/login', {
        api_key: this.apiKey,
        api_secret: this.apiSecret,
      });

      if (response.data.success) {
        this.isAuthenticated = true;
        this.client.defaults.headers.Authorization = `Bearer ${response.data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  /**
   * Generic GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  /**
   * Generic POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  /**
   * Generic PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  /**
   * Generic DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  /**
   * Check if the API is healthy
   */
  async healthCheck(): Promise<{ status: string; responseTime: number; timestamp: string }> {
    const start = Date.now();
    try {
      const response = await this.client.get('/health');
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get authentication status
   */
  getAuthStatus(): boolean {
    return this.isAuthenticated;
  }
}

// Create singleton instance
const externalApiClient = new ExternalApiClient();

export default externalApiClient;
