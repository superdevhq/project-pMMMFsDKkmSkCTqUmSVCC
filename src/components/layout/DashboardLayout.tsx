
import { ReactNode } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, User } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  // Set RTL direction for the entire document
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "he";
    
    // Add Hebrew font
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    
    // Apply Hebrew font to body
    document.body.style.fontFamily = "'Heebo', sans-serif";
    
    return () => {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
      document.head.removeChild(link);
      document.body.style.fontFamily = "";
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "א";
    
    const fullName = user.user_metadata?.full_name as string || "";
    if (!fullName) return user.email?.charAt(0).toUpperCase() || "א";
    
    const nameParts = fullName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0);
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "";
    return (user.user_metadata?.full_name as string) || user.email || "";
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-gray-50 text-right w-full">
        <Sidebar className="border-l" side="right">
          <SidebarHeader className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">פאנל ניהול</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} tooltip="לוח בקרה" asChild>
                  <Link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                    <span>לוח בקרה</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="משפכי מכירות" asChild>
                  <Link to="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M8 18v-1"></path><path d="M16 18v-3"></path></svg>
                    <span>משפכי מכירות</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="קורסים">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path><path d="M12 3v6"></path></svg>
                  <span>קורסים</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="לקוחות">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <span>לקוחות</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="אנליטיקה">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                  <span>אנליטיקה</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="הגדרות">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>הגדרות</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 p-4 md:p-6 w-full">
          <header className="flex justify-between items-center mb-6 md:mb-8 w-full">
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden">
                <Menu />
              </SidebarTrigger>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="outline" size="sm" className="md:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 md:ml-2 h-4 w-4"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
                התראות
              </Button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{getUserDisplayName()}</p>
                        {user?.email && (
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="ml-2 h-4 w-4" />
                        <span>פרופיל</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="ml-2 h-4 w-4" />
                      <span>התנתק</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/login">התחבר</Link>
                </Button>
              )}
            </div>
          </header>
          
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
