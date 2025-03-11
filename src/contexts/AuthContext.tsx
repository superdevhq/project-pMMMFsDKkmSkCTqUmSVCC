
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, AuthUser } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      
      if (session) {
        // Get user data
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            // Create a simplified user object
            const authUser: AuthUser = {
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url,
            };
            setUser(authUser);
            console.log("User loaded from session:", authUser);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Create a simplified user object
            const authUser: AuthUser = {
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name || "",
              avatar_url: user.user_metadata?.avatar_url,
            };
            setUser(authUser);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error logging in:", error);
        return false;
      }

      return !!data.user;
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("Error in register:", error);
        return false;
      }

      return !!data.user;
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error in logout:", error);
        return false;
      }
      
      setUser(null);
      setSession(null);
      return true;
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
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        return null;
      }

      // Update user metadata if full_name is provided
      if (profile.full_name) {
        await supabase.auth.updateUser({
          data: { full_name: profile.full_name }
        });
      }

      // Update profiles table if it exists
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          })
          .eq("id", supabaseUser.id);
      } catch (err) {
        console.warn("Error updating profile table, might not exist:", err);
      }

      const updatedUser: AuthUser = {
        ...user!,
        ...profile,
      };
      
      setUser(updatedUser);
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
