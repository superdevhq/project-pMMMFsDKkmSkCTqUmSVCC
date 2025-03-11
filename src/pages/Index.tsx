
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentSales from "@/components/dashboard/RecentSales";
import FunnelsList from "@/components/dashboard/FunnelsList";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ברוכים הבאים לפאנל הניהול</h1>
          <p className="text-muted-foreground mt-2">
            כאן תוכלו לנהל את משפכי המכירות, הקורסים והלקוחות שלכם.
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <FunnelsList />
          </div>
          <div className="col-span-3">
            <RecentSales />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
