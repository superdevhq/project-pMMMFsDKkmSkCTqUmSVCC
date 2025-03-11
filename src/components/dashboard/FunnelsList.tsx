
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FunnelsList = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold">משפכי מכירות פעילים</h2>
        <Button size="sm" className="w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
          צור משפך חדש
        </Button>
      </div>
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>קורס דיגיטלי</CardTitle>
              <Badge>פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לקורס דיגיטלי</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">צפיות:</span>
                <span>1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">המרות:</span>
                <span>87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">אחוז המרה:</span>
                <span>7.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">הכנסות:</span>
                <span>₪8,700</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              צפה
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
              ערוך
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>וובינר</CardTitle>
              <Badge>פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לוובינר</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">צפיות:</span>
                <span>2,876</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">המרות:</span>
                <span>156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">אחוז המרה:</span>
                <span>5.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">הכנסות:</span>
                <span>₪4,680</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              צפה
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
              ערוך
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>חברות VIP</CardTitle>
              <Badge>פעיל</Badge>
            </div>
            <CardDescription>משפך מכירות לחברות VIP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">צפיות:</span>
                <span>987</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">המרות:</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">אחוז המרה:</span>
                <span>4.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">הכנסות:</span>
                <span>₪12,600</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              צפה
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
              ערוך
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default FunnelsList;
