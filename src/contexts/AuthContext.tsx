
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, AuthUser } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (profile: Partial<AuthUser>) => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      setIsLoading(true);
      const session = await authService.getSession();
      
      if (session) {
        const user = await authService.getCurrentUser();
        setUser(user);
      }
      
      setIsLoading(false);
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const user = await authService.getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const user = await authService.login({ email, password });
    setIsLoading(false);
    return !!user;
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    const user = await authService.register({ email, password, full_name: fullName });
    setIsLoading(false);
    return !!user;
  };

  const logout = async () => {
    setIsLoading(true);
    const success = await authService.logout();
    setIsLoading(false);
    return success;
  };

  const updateProfile = async (profile: Partial<AuthUser>) => {
    setIsLoading(true);
    const updatedUser = await authService.updateProfile(profile);
    if (updatedUser) {
      setUser(updatedUser);
    }
    setIsLoading(false);
    return updatedUser;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
