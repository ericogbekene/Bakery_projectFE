import { httpClient, APIError } from '@/lib/api/http-client';
import ENDPOINTS from '@/constants/endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  user?: unknown;
  tokens?: {
    access: string;
    refresh: string;
  };
  message?: string;
  error?: string;
}

/**
 * Authentication service for M&C Cakes API
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<{access: string, refresh: string, user: unknown}>(ENDPOINTS.EXTERNAL.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });

      // Store tokens
      httpClient.setToken(response.access);
      httpClient.setRefreshToken(response.refresh);
      
      return {
        success: true,
        user: response.user,
        tokens: {
          access: response.access,
          refresh: response.refresh,
        },
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      await httpClient.post(ENDPOINTS.EXTERNAL.AUTH.REGISTER, {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });

      return {
        success: true,
        message: 'Registration successful. Please check your email for verification.',
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    httpClient.clearTokens();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return httpClient.isAuthenticated();
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: unknown): string {
    if (error instanceof APIError) {
        if (error.status === 401) {
            return 'Invalid credentials';
        } else if (error.status === 400) {
            const errorData = error.data as { detail?: string };
            return errorData?.detail || 'Invalid request data';
        } else if (error.status === 0) {
            return 'Network error. Please check your connection.';
        }
    }
    return 'Authentication failed';
  }
}

export const authService = new AuthService();
export default authService;