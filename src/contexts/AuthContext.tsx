
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, AuthUser } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateProfile: (profile: Partial<AuthUser>) => Promise<AuthUser | null>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get the initial session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session) {
          const user = await authService.getCurrentUser();
          setUser(user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session) {
          try {
            const user = await authService.getCurrentUser();
            setUser(user);
          } catch (error) {
            console.error("Error getting user after auth change:", error);
            setUser(null);
          }
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
    try {
      const user = await authService.login({ email, password });
      return !!user;
    } catch (error) {
      console.error("Error in login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const user = await authService.register({ email, password, full_name: fullName });
      return !!user;
    } catch (error) {
      console.error("Error in register:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const success = await authService.logout();
      if (success) {
        setUser(null);
        setSession(null);
      }
      return success;
    } catch (error) {
      console.error("Error in logout:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<AuthUser>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(profile);
      if (updatedUser) {
        setUser(updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
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
