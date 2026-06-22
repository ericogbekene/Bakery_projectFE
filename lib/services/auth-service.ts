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
      console.log("🔐 1. Starting login...");
      console.log("🔐 2. BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log("🔐 3. Email:", credentials.email);
      
      const response = await httpClient.post<{
        message: string;
        access: string;
        refresh: string;
        user: AuthUser;
      }>("/accounts/login/", {
        email: credentials.email,
        password: credentials.password,
      });
      
      console.log("✅ 4. Login response received");
      console.log("✅ 5. Access token present:", !!response.access);
      console.log("✅ 6. Refresh token present:", !!response.refresh);
      console.log("✅ 7. User data present:", !!response.user);

      // ✅ Explicitly store auth values in localStorage
      if (typeof window !== "undefined") {
        if (response.access) {
          localStorage.setItem("access_token", response.access);
          console.log("✅ 8. Access token stored in localStorage");
          // Verify it was stored
          const stored = localStorage.getItem("access_token");
          console.log("✅ 9. Verified stored token:", stored ? "Yes (length: " + stored.length + ")" : "No");
        } else {
          console.error("❌ No access token in response!");
        }
        
        if (response.refresh) {
          localStorage.setItem("refresh_token", response.refresh);
        }
        
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          console.log("✅ 10. User data stored:", response.user.email);
        }
      }

      // ✅ Also set token in httpClient for future requests
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
      console.error("❌ Login error:", error);
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
      console.log("🔐 Starting registration...");
      
      await httpClient.post("/accounts/register/", {
        email: userData.email,
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password,
        password_confirm: userData.password_confirm,
      });

      console.log("✅ Registration successful");
      
      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (error: unknown) {
      console.error("❌ Registration error:", error);
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
      console.log("🔐 Logged out - tokens cleared");
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const isAuth = !!token;
      console.log("🔐 isAuthenticated check:", isAuth);
      return isAuth;
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
   * Get stored token (for debugging)
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
      if (error.status === 0)
        return "Network error. Please check your connection.";
    }
    return "Authentication failed. Please try again.";
  }
}

export const authService = new AuthService();
export default authService;