"use client";

import {
  AuthResponse,
  authService,
  LoginCredentials,
  RegisterData,
} from "@/lib/services/auth-service";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  authenticated: boolean;
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean; // Add this
  is_superuser?: boolean; // Add this
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add this helper
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const storedUser = authService.getUser();
          setUser(
            storedUser
              ? { ...storedUser, authenticated: true }
              : { authenticated: true },
          );
        } catch {
          authService.logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    const result = await authService.login(credentials);
    if (result.success) {
      setUser(
        result.user
          ? { ...result.user, authenticated: true }
          : { authenticated: true },
      );
    }
    return result;
  };

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Helper to check if user is admin
  const isAdmin = user?.is_staff === true || user?.is_superuser === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin, // Add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
