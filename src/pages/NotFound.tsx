
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Set RTL direction for the entire document
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
      document.head.removeChild(link);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">אופס! הדף לא נמצא</p>
        <Button asChild>
          <a href="/">חזרה לדף הבית</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
