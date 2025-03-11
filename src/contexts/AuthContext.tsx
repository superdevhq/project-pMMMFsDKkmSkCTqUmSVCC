
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth init - Session:", session ? "Found" : "None");
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Session exists" : "No session");
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        toast({
          title: "שגיאה בהתחברות",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא למערכת",
      });
      
      return { success: true };
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      toast({
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return { success: false, error: "Unexpected error" };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        console.error("Sign up error:", error.message);
        toast({
          title: "שגיאה בהרשמה",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      // If email confirmation is required
      if (data?.user && !data.session) {
        toast({
          title: "הרשמה בוצעה בהצלחה",
          description: "נשלח אליך אימייל לאימות החשבון",
        });
        return { success: true };
      }

      toast({
        title: "נרשמת בהצלחה",
        description: "ברוך הבא למערכת",
      });
      
      return { success: true };
    } catch (err) {
      console.error("Unexpected error during sign up:", err);
      toast({
        title: "שגיאה בהרשמה",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return { success: false, error: "Unexpected error" };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות!",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה בהתנתקות",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      isAuthenticated: !!session && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
