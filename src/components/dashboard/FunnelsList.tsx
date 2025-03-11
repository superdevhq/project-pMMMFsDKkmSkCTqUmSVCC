
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye, PenLine, Plus, Loader2 } from "lucide-react";
import { funnelService } from "@/services/funnelService";
import { useAuth } from "@/contexts/AuthContext";
import { Funnel } from "@/types/funnel";

const FunnelsList = () => {
  const { isAuthenticated } = useAuth();
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFunnels = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const userFunnels = await funnelService.getUserFunnels();
        setFunnels(userFunnels);
      } catch (error) {
        console.error("Error loading funnels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFunnels();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-semibold">משפכי מכירות פעילים</h2>
          <Button className="w-full sm:w-auto" asChild>
            <Link to="/login">
              <Plus className="ml-2 h-4 w-4" />
              התחבר ליצירת משפך
            </Link>
          </Button>
        </div>
        
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium mb-2">התחבר כדי לראות את המשפכים שלך</h3>
          <p className="text-muted-foreground mb-4">עליך להתחבר כדי לנהל את משפכי המכירות שלך</p>
          <Button asChild>
            <Link to="/login">התחבר עכשיו</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">משפכי מכירות פעילים</h2>
        <Button className="w-full sm:w-auto" asChild>
          <Link to="/funnel/edit/new">
            <Plus className="ml-2 h-4 w-4" />
            צור משפך חדש
          </Link>
        </Button>
      </div>
      
      {funnels.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <h3 className="text-lg font-medium mb-2">אין לך משפכים עדיין</h3>
          <p className="text-muted-foreground mb-4">צור את המשפך הראשון שלך כדי להתחיל</p>
          <Button asChild>
            <Link to="/funnel/edit/new">צור משפך חדש</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full">
          {funnels.map((funnel) => (
            <Card key={funnel.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all w-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{funnel.name}</CardTitle>
                  <Badge className="px-2 py-1">
                    {funnel.is_published ? "פעיל" : "טיוטה"}
                  </Badge>
                </div>
                <CardDescription>
                  {funnel.description || `משפך מכירות: ${funnel.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">צפיות</span>
                      <span className="text-lg font-semibold">
                        {funnel.stats?.views || 0}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">המרות</span>
                      <span className="text-lg font-semibold">
                        {funnel.stats?.conversions || 0}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">אחוז המרה</span>
                      <span className="text-lg font-semibold">
                        {funnel.stats?.views 
                          ? ((funnel.stats?.conversions || 0) / funnel.stats.views * 100).toFixed(1) 
                          : "0.0"}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">הכנסות</span>
                      <span className="text-lg font-semibold">
                        ₪{funnel.stats?.revenue || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 border-t bg-muted/20 p-3">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/funnel/view/${funnel.id}`}>
                    <Eye className="ml-2 h-4 w-4" />
                    צפה
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/funnel/edit/${funnel.id}`}>
                    <PenLine className="ml-2 h-4 w-4" />
                    ערוך
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FunnelsList;
