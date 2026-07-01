import { APIError, httpClient } from "@/lib/api/http-client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  tokens?: {
    access: string;
    refresh: string;
  };
  message?: string;
  error?: string;
}

class AuthService {
  /**
   * Login — POST /api/accounts/login/
   * Django returns: { message, access, refresh, user }
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<{
        message: string;
        access: string;
        refresh: string;
        user: AuthUser;
      }>("/accounts/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      if (typeof window !== "undefined") {
        if (response.access) localStorage.setItem("access_token", response.access);
        if (response.refresh) localStorage.setItem("refresh_token", response.refresh);
        if (response.user) localStorage.setItem("user", JSON.stringify(response.user));
      }

      if (response.access) {
        httpClient.setToken(response.access);
      }

      return {
        success: true,
        user: response.user,
        tokens: {
          access: response.access,
          refresh: response.refresh,
        },
        message: response.message,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  /**
   * Register — POST /api/accounts/register/
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      await httpClient.post("/accounts/register/", {
        email: userData.email,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password,
        password_confirm: userData.password_confirm,
      });

      return {
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: this.handleAuthError(error),
      };
    }
  }

  /**
   * Logout — clear tokens and user data
   */
  logout(): void {
    httpClient.clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("access_token");
    }
    return httpClient.isAuthenticated();
  }

  /**
   * Get stored user info
   */
  getUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  private handleAuthError(error: unknown): string {
    if (error instanceof APIError) {
      if (error.status === 401) return "Invalid email or password.";
      if (error.status === 400) {
        const data = error.data as Record<string, string[] | string>;
        const firstKey = Object.keys(data)[0];
        if (firstKey && data[firstKey]) {
          const msg = data[firstKey];
          return Array.isArray(msg) ? msg[0] : String(msg);
        }
      }
      if (error.status === 0) return "Network error. Please check your connection.";
    }
    return "Authentication failed. Please try again.";
  }
}

export const authService = new AuthService();
export default authService;