
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
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        return null;
      }
      
      return data.session;
    } catch (err) {
      console.error("Unexpected error getting session:", err);
      return null;
    }
  },

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      // Get the user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError);
      }

      return {
        id: user.id,
        email: user.email || "",
        full_name: profile?.full_name || user.user_metadata?.full_name,
        avatar_url: profile?.avatar_url,
      };
    } catch (err) {
      console.error("Error getting current user:", err);
      return null;
    }
  },

  /**
   * Login with email and password
   */
  async login({ email, password }: LoginCredentials) {
    try {
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

      // Verify the session was created
      const session = await this.getSession();
      if (!session) {
        console.error("No session after login");
        toast({
          title: "שגיאה בהתחברות",
          description: "לא ניתן ליצור חיבור, נסה שוב",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא למערכת",
      });

      return data.user;
    } catch (err) {
      console.error("Unexpected error during login:", err);
      toast({
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return null;
    }
  },

  /**
   * Register a new user
   */
  async register({ email, password, full_name }: RegisterCredentials) {
    try {
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
    } catch (err) {
      console.error("Unexpected error during registration:", err);
      toast({
        title: "שגיאה בהרשמה",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return null;
    }
  },

  /**
   * Logout the current user
   */
  async logout() {
    try {
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
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      toast({
        title: "שגיאה בהתנתקות",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return false;
    }
  },

  /**
   * Update the user profile
   */
  async updateProfile(profile: Partial<AuthUser>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "שגיאה בעדכון הפרופיל",
          description: "עליך להתחבר כדי לעדכן את הפרופיל",
          variant: "destructive",
        });
        return null;
      }

      // Update user metadata if full_name is provided
      if (profile.full_name) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { full_name: profile.full_name }
        });

        if (metadataError) {
          console.error("Error updating user metadata:", metadataError);
        }
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
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return null;
    }
  },

  /**
   * Send a password reset email
   */
  async resetPassword(email: string) {
    try {
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
    } catch (err) {
      console.error("Unexpected error sending reset password email:", err);
      toast({
        title: "שגיאה בשליחת אימייל לאיפוס סיסמה",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return false;
    }
  },

  /**
   * Update the user password
   */
  async updatePassword(password: string) {
    try {
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
    } catch (err) {
      console.error("Unexpected error updating password:", err);
      toast({
        title: "שגיאה בעדכון הסיסמה",
        description: "אירעה שגיאה לא צפויה, נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return false;
    }
  },
};
