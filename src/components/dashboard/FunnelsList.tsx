
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye, PenLine, Plus } from "lucide-react";

const FunnelsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">משפכי מכירות פעילים</h2>
        <Button className="w-full sm:w-auto" asChild>
          <Link to="/funnel/edit/new">
            <Plus className="ml-2 h-4 w-4" />
            צור משפך חדש
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">קורס דיגיטלי</CardTitle>
              <Badge className="px-2 py-1">פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לקורס דיגיטלי</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">צפיות</span>
                  <span className="text-lg font-semibold">1,245</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">המרות</span>
                  <span className="text-lg font-semibold">87</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">אחוז המרה</span>
                  <span className="text-lg font-semibold">7.0%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">הכנסות</span>
                  <span className="text-lg font-semibold">₪8,700</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 border-t bg-muted/20 p-3">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/view/1">
                <Eye className="ml-2 h-4 w-4" />
                צפה
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/edit/1">
                <PenLine className="ml-2 h-4 w-4" />
                ערוך
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">וובינר</CardTitle>
              <Badge className="px-2 py-1">פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לוובינר</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">צפיות</span>
                  <span className="text-lg font-semibold">2,876</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">המרות</span>
                  <span className="text-lg font-semibold">156</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">אחוז המרה</span>
                  <span className="text-lg font-semibold">5.4%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">הכנסות</span>
                  <span className="text-lg font-semibold">₪4,680</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 border-t bg-muted/20 p-3">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/view/2">
                <Eye className="ml-2 h-4 w-4" />
                צפה
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/edit/2">
                <PenLine className="ml-2 h-4 w-4" />
                ערוך
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">חברות VIP</CardTitle>
              <Badge className="px-2 py-1">פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לחברות VIP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">צפיות</span>
                  <span className="text-lg font-semibold">987</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">המרות</span>
                  <span className="text-lg font-semibold">42</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">אחוז המרה</span>
                  <span className="text-lg font-semibold">4.3%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">הכנסות</span>
                  <span className="text-lg font-semibold">₪12,600</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 border-t bg-muted/20 p-3">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/view/3">
                <Eye className="ml-2 h-4 w-4" />
                צפה
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/funnel/edit/3">
                <PenLine className="ml-2 h-4 w-4" />
                ערוך
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FunnelsList;
