
import { supabase } from "@/integrations/supabase/client";
import { Funnel, FunnelElement } from "@/types/funnel";
import { toast } from "@/components/ui/use-toast";

export interface FunnelData {
  name: string;
  slug: string;
  elements: FunnelElement[];
  settings: {
    metaTitle: string;
    metaDescription: string;
    favicon: string;
    customDomain: string;
    customScripts: string;
    showPoweredBy?: boolean;
    customCss?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

export const funnelService = {
  /**
   * Get all funnels for the current user
   */
  async getUserFunnels() {
    const { data: funnels, error } = await supabase
      .from("funnels")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching funnels:", error);
      toast({
        title: "שגיאה בטעינת המשפכים",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return funnels;
  },

  /**
   * Get a funnel by ID
   */
  async getFunnelById(id: string) {
    const { data: funnel, error } = await supabase
      .from("funnels")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching funnel:", error);
      toast({
        title: "שגיאה בטעינת המשפך",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return funnel;
  },

  /**
   * Get a funnel by slug
   */
  async getFunnelBySlug(slug: string) {
    const { data: funnel, error } = await supabase
      .from("funnels")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching funnel by slug:", error);
      return null;
    }

    return funnel;
  },

  /**
   * Create a new funnel
   */
  async createFunnel(funnelData: FunnelData) {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast({
        title: "שגיאה ביצירת משפך",
        description: "עליך להתחבר כדי ליצור משפך",
        variant: "destructive",
      });
      return null;
    }

    const { data: funnel, error } = await supabase
      .from("funnels")
      .insert({
        user_id: user.user.id,
        name: funnelData.name,
        slug: funnelData.slug,
        elements: funnelData.elements,
        settings: funnelData.settings,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating funnel:", error);
      toast({
        title: "שגיאה ביצירת משפך",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "משפך נוצר בהצלחה",
      description: `המשפך "${funnelData.name}" נוצר בהצלחה`,
    });

    return funnel;
  },

  /**
   * Update an existing funnel
   */
  async updateFunnel(id: string, funnelData: Partial<FunnelData>) {
    const { data: funnel, error } = await supabase
      .from("funnels")
      .update(funnelData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating funnel:", error);
      toast({
        title: "שגיאה בעדכון המשפך",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "משפך עודכן בהצלחה",
      description: "השינויים נשמרו בהצלחה",
    });

    return funnel;
  },

  /**
   * Delete a funnel
   */
  async deleteFunnel(id: string) {
    const { error } = await supabase
      .from("funnels")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting funnel:", error);
      toast({
        title: "שגיאה במחיקת המשפך",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "משפך נמחק בהצלחה",
      description: "המשפך נמחק בהצלחה",
    });

    return true;
  },

  /**
   * Get funnel versions
   */
  async getFunnelVersions(funnelId: string) {
    const { data: versions, error } = await supabase
      .from("funnel_versions")
      .select("*")
      .eq("funnel_id", funnelId)
      .order("version_number", { ascending: false });

    if (error) {
      console.error("Error fetching funnel versions:", error);
      return [];
    }

    return versions;
  },

  /**
   * Deploy a funnel
   */
  async deployFunnel(funnelId: string) {
    // First, get the latest version
    const { data: latestVersion, error: versionError } = await supabase
      .from("funnel_versions")
      .select("*")
      .eq("funnel_id", funnelId)
      .order("version_number", { ascending: false })
      .limit(1)
      .single();

    if (versionError) {
      console.error("Error fetching latest version:", versionError);
      toast({
        title: "שגיאה בפרסום המשפך",
        description: "לא ניתן למצוא את הגרסה האחרונה של המשפך",
        variant: "destructive",
      });
      return null;
    }

    // Create a deployment record
    const { data: deployment, error: deploymentError } = await supabase
      .from("funnel_deployments")
      .insert({
        funnel_id: funnelId,
        version_id: latestVersion.id,
        status: "deploying",
      })
      .select()
      .single();

    if (deploymentError) {
      console.error("Error creating deployment:", deploymentError);
      toast({
        title: "שגיאה בפרסום המשפך",
        description: deploymentError.message,
        variant: "destructive",
      });
      return null;
    }

    // Update the funnel to mark it as published
    const { data: funnel, error: funnelError } = await supabase
      .from("funnels")
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq("id", funnelId)
      .select()
      .single();

    if (funnelError) {
      console.error("Error updating funnel:", funnelError);
      // Update deployment status to failed
      await supabase
        .from("funnel_deployments")
        .update({
          status: "failed",
          error_message: funnelError.message,
        })
        .eq("id", deployment.id);

      toast({
        title: "שגיאה בפרסום המשפך",
        description: funnelError.message,
        variant: "destructive",
      });
      return null;
    }

    // Update deployment status to deployed
    const { data: updatedDeployment, error: updateError } = await supabase
      .from("funnel_deployments")
      .update({
        status: "deployed",
        deployment_url: `https://funnel.co.il/${funnel.slug}`,
      })
      .eq("id", deployment.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating deployment:", updateError);
    }

    toast({
      title: "המשפך פורסם בהצלחה",
      description: `המשפך זמין כעת בכתובת: funnel.co.il/${funnel.slug}`,
    });

    return updatedDeployment;
  },

  /**
   * Get the latest deployment for a funnel
   */
  async getLatestDeployment(funnelId: string) {
    const { data: deployment, error } = await supabase
      .from("funnel_deployments")
      .select("*")
      .eq("funnel_id", funnelId)
      .order("deployed_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No deployments found
        return null;
      }
      console.error("Error fetching latest deployment:", error);
      return null;
    }

    return deployment;
  },
};
