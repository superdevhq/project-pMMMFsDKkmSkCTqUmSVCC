
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name?: string;
}

export const authService = {
  /**
   * Get the current user session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    
    return data.session;
  },

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get the user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      full_name: profile?.full_name,
      avatar_url: profile?.avatar_url,
    };
  },

  /**
   * Login with email and password
   */
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error);
      toast({
        title: "שגיאה בהתחברות",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "התחברת בהצלחה",
      description: "ברוך הבא למערכת",
    });

    return data.user;
  },

  /**
   * Register a new user
   */
  async register({ email, password, full_name }: RegisterCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      console.error("Error registering:", error);
      toast({
        title: "שגיאה בהרשמה",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Update the profile with the full name
    if (data.user && full_name) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name })
        .eq("id", data.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
    }

    toast({
      title: "נרשמת בהצלחה",
      description: "ברוך הבא למערכת",
    });

    return data.user;
  },

  /**
   * Logout the current user
   */
  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
      toast({
        title: "שגיאה בהתנתקות",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "התנתקת בהצלחה",
      description: "להתראות!",
    });

    return true;
  },

  /**
   * Update the user profile
   */
  async updateProfile(profile: Partial<AuthUser>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: "עליך להתחבר כדי לעדכן את הפרופיל",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "הפרופיל עודכן בהצלחה",
      description: "השינויים נשמרו בהצלחה",
    });

    return {
      id: user.id,
      email: user.email || "",
      full_name: data.full_name,
      avatar_url: data.avatar_url,
    };
  },

  /**
   * Send a password reset email
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error("Error sending reset password email:", error);
      toast({
        title: "שגיאה בשליחת אימייל לאיפוס סיסמה",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "אימייל לאיפוס סיסמה נשלח",
      description: "בדוק את תיבת הדואר שלך לקבלת הוראות נוספות",
    });

    return true;
  },

  /**
   * Update the user password
   */
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Error updating password:", error);
      toast({
        title: "שגיאה בעדכון הסיסמה",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "הסיסמה עודכנה בהצלחה",
      description: "הסיסמה החדשה שלך נשמרה",
    });

    return true;
  },
};
