
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RecentSales = () => {
  return (
    <div className="space-y-8">
      <div className="text-xl font-semibold">מכירות אחרונות</div>
      <div className="space-y-6">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>רמ</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">רון מזרחי</p>
            <p className="text-sm text-muted-foreground">ron@example.com</p>
          </div>
          <div className="mr-auto font-medium">+₪429</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>מכ</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">מיכל כהן</p>
            <p className="text-sm text-muted-foreground">michal@example.com</p>
          </div>
          <div className="mr-auto font-medium">+₪829</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>יל</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">יעל לוי</p>
            <p className="text-sm text-muted-foreground">yael@example.com</p>
          </div>
          <div className="mr-auto font-medium">+₪299</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>דג</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">דוד גולן</p>
            <p className="text-sm text-muted-foreground">david@example.com</p>
          </div>
          <div className="mr-auto font-medium">+₪999</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>שא</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">שירה אברהם</p>
            <p className="text-sm text-muted-foreground">shira@example.com</p>
          </div>
          <div className="mr-auto font-medium">+₪399</div>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
