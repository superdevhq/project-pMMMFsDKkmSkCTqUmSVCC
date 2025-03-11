
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentSales from "@/components/dashboard/RecentSales";
import FunnelsList from "@/components/dashboard/FunnelsList";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ברוכים הבאים לפאנל הניהול</h1>
          <p className="text-muted-foreground mt-2">
            כאן תוכלו לנהל את משפכי המכירות, הקורסים והלקוחות שלכם.
          </p>
        </div>
        
        <DashboardStats />
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <FunnelsList />
          </div>
          <div className="lg:col-span-3">
            <RecentSales />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
