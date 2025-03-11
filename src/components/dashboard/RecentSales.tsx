
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RecentSales = () => {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">מכירות אחרונות</div>
      <div className="space-y-5">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>רמ</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">רון מזרחי</p>
            <p className="text-sm text-muted-foreground truncate">ron@example.com</p>
          </div>
          <div className="mr-auto font-medium shrink-0">+₪429</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>מכ</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">מיכל כהן</p>
            <p className="text-sm text-muted-foreground truncate">michal@example.com</p>
          </div>
          <div className="mr-auto font-medium shrink-0">+₪829</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>יל</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">יעל לוי</p>
            <p className="text-sm text-muted-foreground truncate">yael@example.com</p>
          </div>
          <div className="mr-auto font-medium shrink-0">+₪299</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>דג</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">דוד גולן</p>
            <p className="text-sm text-muted-foreground truncate">david@example.com</p>
          </div>
          <div className="mr-auto font-medium shrink-0">+₪999</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9 ml-3">
            <AvatarFallback>שא</AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-sm font-medium leading-none truncate">שירה אברהם</p>
            <p className="text-sm text-muted-foreground truncate">shira@example.com</p>
          </div>
          <div className="mr-auto font-medium shrink-0">+₪399</div>
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
