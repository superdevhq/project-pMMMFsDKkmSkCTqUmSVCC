
import DashboardLayout from "@/components/layout/DashboardLayout";
import FunnelsList from "@/components/dashboard/FunnelsList";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ברוכים הבאים לפאנל הניהול</h1>
          <p className="text-muted-foreground mt-2">
            כאן תוכלו לנהל את משפכי המכירות שלכם
          </p>
        </div>
        
        <FunnelsList />
      </div>
    </DashboardLayout>
  );
};

export default Index;
