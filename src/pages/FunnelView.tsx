
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Edit, Loader2 } from "lucide-react";
import { FunnelElement } from "@/types/funnel";
import { funnelService } from "@/services/funnelService";
import { toast } from "@/components/ui/use-toast";

const FunnelView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [elements, setElements] = useState<FunnelElement[]>([]);
  const [funnelName, setFunnelName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to editor if this is a new funnel
    if (id === "new") {
      navigate("/funnel/edit/new");
      return;
    }

    const loadFunnel = async () => {
      setIsLoading(true);
      try {
        const funnel = await funnelService.getFunnelById(id as string);
        
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
  }, [id, navigate]);

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
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="ml-2" asChild>
              <Link to="/">
                <ArrowRight className="ml-1 h-4 w-4" />
                חזרה לדשבורד
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">טוען תצוגה מקדימה...</h1>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-medium">טוען משפך...</h2>
          </div>
        </div>
      </div>
    );
  }

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
        <Button size="sm" asChild>
          <Link to={`/funnel/edit/${id}`}>
            <Edit className="ml-2 h-4 w-4" />
            ערוך משפך
          </Link>
        </Button>
      </header>

      <div className="flex-1">
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">אין אלמנטים במשפך</h2>
              <p className="text-muted-foreground mb-4">המשפך ריק, הוסף אלמנטים כדי לראות אותם כאן</p>
              <Button asChild>
                <Link to={`/funnel/edit/${id}`}>
                  <Edit className="ml-2 h-4 w-4" />
                  ערוך משפך
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          elements.map((element) => renderElement(element))
        )}
      </div>
    </div>
  );
};

export default FunnelView;
