
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Loader2 } from "lucide-react";
import { FunnelElement } from "@/types/funnel";
import { funnelService } from "@/services/funnelService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const FunnelView = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [elements, setElements] = useState<FunnelElement[]>([]);
  const [funnelName, setFunnelName] = useState("");
  const [funnelId, setFunnelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSettings, setPageSettings] = useState<any>({});

  useEffect(() => {
    // Redirect to editor if this is a new funnel
    if (id === "new") {
      navigate("/funnel/edit/new");
      return;
    }

    const loadFunnel = async () => {
      setIsLoading(true);
      try {
        let funnel = null;
        
        // If we have a slug parameter, try to load by slug first
        if (slug) {
          funnel = await funnelService.getFunnelBySlug(slug);
        } 
        // If we have an id parameter or slug loading failed, try by id
        else if (id) {
          // First try to load by slug (for public viewing)
          funnel = await funnelService.getFunnelBySlug(id);
          
          // If not found by slug, try by ID (for editing preview)
          if (!funnel) {
            funnel = await funnelService.getFunnelById(id);
          }
        }
        
        if (!funnel) {
          toast({
            title: "משפך לא נמצא",
            description: "המשפך המבוקש לא נמצא",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setElements(funnel.elements);
        setFunnelName(funnel.name);
        setFunnelId(funnel.id);
        setPageSettings(funnel.settings || {});
        
        // Set page title and meta description if available
        if (funnel.settings?.metaTitle) {
          document.title = funnel.settings.metaTitle;
        } else {
          document.title = funnel.name;
        }
        
        // Set meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && funnel.settings?.metaDescription) {
          metaDescription.setAttribute('content', funnel.settings.metaDescription);
        }
        
        // Add custom CSS if available
        if (funnel.settings?.customCss) {
          const style = document.createElement('style');
          style.textContent = funnel.settings.customCss;
          style.id = 'funnel-custom-css';
          document.head.appendChild(style);
        }
        
        // Add custom scripts if available
        if (funnel.settings?.customScripts) {
          const script = document.createElement('script');
          script.textContent = funnel.settings.customScripts;
          script.id = 'funnel-custom-scripts';
          document.body.appendChild(script);
        }
        
        // Add Google Analytics if available
        if (funnel.settings?.googleAnalyticsId) {
          const gaScript = document.createElement('script');
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${funnel.settings.googleAnalyticsId}`;
          document.head.appendChild(gaScript);
          
          const gaConfigScript = document.createElement('script');
          gaConfigScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${funnel.settings.googleAnalyticsId}');
          `;
          document.head.appendChild(gaConfigScript);
        }
        
        // Add Facebook Pixel if available
        if (funnel.settings?.facebookPixelId) {
          const fbScript = document.createElement('script');
          fbScript.textContent = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${funnel.settings.facebookPixelId}');
            fbq('track', 'PageView');
          `;
          document.head.appendChild(fbScript);
        }
        
      } catch (error) {
        console.error("Error loading funnel:", error);
        toast({
          title: "שגיאה בטעינת המשפך",
          description: "אירעה שגיאה בטעינת המשפך",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFunnel();
    
    // Cleanup function
    return () => {
      // Remove custom elements when component unmounts
      const customCss = document.getElementById('funnel-custom-css');
      if (customCss) customCss.remove();
      
      const customScripts = document.getElementById('funnel-custom-scripts');
      if (customScripts) customScripts.remove();
      
      // Reset document title
      document.title = 'Funnel Builder';
    };
  }, [id, slug, navigate]);

  const renderElement = (element: FunnelElement) => {
    switch (element.type) {
      case "header":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "3rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{element.content.title}</h1>
              <h2 className="text-xl md:text-2xl">{element.content.subtitle}</h2>
            </div>
          </div>
        );
      case "text":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-lg">{element.content.text}</p>
            </div>
          </div>
        );
      case "cta":
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <Button
                style={{
                  backgroundColor: element.content.buttonColor,
                  color: element.content.buttonTextColor,
                }}
                size="lg"
              >
                {element.content.buttonText}
              </Button>
            </div>
          </div>
        );
      case "image":
        const imageContent = element.content as any;
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: imageContent.backgroundColor,
              textAlign: imageContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <img 
                src={imageContent.imageUrl} 
                alt={imageContent.altText} 
                className="max-w-full h-auto rounded-md mx-auto"
              />
            </div>
          </div>
        );
      case "video":
        const videoContent = element.content as any;
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: videoContent.backgroundColor,
              textAlign: videoContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  src={videoContent.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        );
      case "form":
        const formContent = element.content as any;
        return (
          <div
            key={element.id}
            style={{
              backgroundColor: formContent.backgroundColor,
              textAlign: formContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-6xl mx-auto">
              <form className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
                {formContent.fields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder}
                        rows={4}
                      />
                    ) : field.type === 'checkbox' ? (
                      <div className="flex items-center">
                        <input type="checkbox" className="ml-2" />
                        <span>{field.placeholder}</span>
                      </div>
                    ) : (
                      <input 
                        type={field.type} 
                        placeholder={field.placeholder} 
                        className="w-full p-2 border rounded-md"
                      />
                    )}
                  </div>
                ))}
                <Button
                  style={{
                    backgroundColor: formContent.buttonColor,
                    color: formContent.buttonTextColor,
                  }}
                  className="w-full"
                >
                  {formContent.buttonText}
                </Button>
              </form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">טוען משפך...</h2>
        </div>
      </div>
    );
  }

  // For authenticated users viewing in preview mode, show the admin header
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="ml-2" asChild>
              <Link to="/">
                <ArrowRight className="ml-1 h-4 w-4" />
                חזרה לדשבורד
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">תצוגה מקדימה - {funnelName}</h1>
          </div>
          {funnelId && (
            <Button size="sm" asChild>
              <Link to={`/funnel/edit/${funnelId}`}>
                <Edit className="ml-2 h-4 w-4" />
                ערוך משפך
              </Link>
            </Button>
          )}
        </header>

        <div className="flex-1">
          {elements.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-2">אין אלמנטים במשפך</h2>
                <p className="text-muted-foreground mb-4">המשפך ריק, הוסף אלמנטים כדי לראות אותם כאן</p>
                {funnelId && (
                  <Button asChild>
                    <Link to={`/funnel/edit/${funnelId}`}>
                      <Edit className="ml-2 h-4 w-4" />
                      ערוך משפך
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            elements.map((element) => renderElement(element))
          )}
        </div>
        
        {pageSettings?.showPoweredBy !== false && (
          <footer className="bg-gray-50 p-4 text-center text-sm text-gray-500">
            נבנה עם Funnel Builder
          </footer>
        )}
      </div>
    );
  }

  // For public users, show a clean page without admin UI
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">אין תוכן זמין</h2>
              <p className="text-muted-foreground mb-4">עמוד זה ריק</p>
            </div>
          </div>
        ) : (
          elements.map((element) => renderElement(element))
        )}
      </div>
      
      {pageSettings?.showPoweredBy !== false && (
        <footer className="bg-gray-50 p-4 text-center text-sm text-gray-500">
          נבנה עם Funnel Builder
        </footer>
      )}
    </div>
  );
};

export default FunnelView;
