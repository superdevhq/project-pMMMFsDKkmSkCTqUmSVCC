
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, ChevronLeft, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ElementSettings from "@/components/funnel-builder/ElementSettings";
import PageSettings from "@/components/funnel-builder/PageSettings";
import { Funnel, FunnelElement } from "@/types/funnel";
import { cn } from "@/lib/utils";
import { funnelService } from "@/services/funnelService";
import { useAuth } from "@/contexts/AuthContext";
import DevicePreview from "@/components/funnel-builder/DevicePreview";
import PublishFunnelButton from "@/components/funnel-builder/PublishFunnelButton";
import FunnelDocumentEditor from "@/components/funnel-builder/FunnelDocumentEditor";

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const FunnelEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elements, setElements] = useState<FunnelElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FunnelElement | null>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [funnelName, setFunnelName] = useState("משפך חדש");
  const [funnelSlug, setFunnelSlug] = useState("");
  const [originalSlug, setOriginalSlug] = useState(""); // To track if slug has changed
  const [isSlugValid, setIsSlugValid] = useState(true);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [history, setHistory] = useState<FunnelElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [pageSettings, setPageSettings] = useState({
    metaTitle: "",
    metaDescription: "",
    favicon: "",
    customDomain: "",
    customScripts: "",
    showPoweredBy: true,
    customCss: "",
    googleAnalyticsId: "",
    facebookPixelId: ""
  });

  // Generate a slug from a name
  const generateSlug = (name: string) => {
    if (!name || name.trim() === '') {
      return 'funnel-' + Date.now().toString().slice(-6);
    }
    
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Initialize default slug
  useEffect(() => {
    if (!funnelSlug && funnelName) {
      const newSlug = generateSlug(funnelName);
      setFunnelSlug(newSlug);
      setOriginalSlug(newSlug);
    }
  }, [funnelName, funnelSlug]);

  // Check if slug is valid
  useEffect(() => {
    const checkSlug = async () => {
      if (!funnelSlug) {
        setIsSlugValid(false);
        return;
      }

      // If slug hasn't changed from original, it's valid
      if (funnelSlug === originalSlug) {
        setIsSlugValid(true);
        return;
      }

      setIsCheckingSlug(true);
      try {
        const isValid = await funnelService.isSlugAvailable(funnelSlug);
        setIsSlugValid(isValid);
      } catch (error) {
        console.error("Error checking slug:", error);
        setIsSlugValid(false);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    // Debounce slug check
    const timer = setTimeout(() => {
      checkSlug();
    }, 500);

    return () => clearTimeout(timer);
  }, [funnelSlug, originalSlug]);

  // Load funnel data
  useEffect(() => {
    const loadFunnel = async () => {
      if (id === "new") {
        setIsLoading(false);
        return;
      }

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

        setFunnelName(funnel.name);
        setFunnelSlug(funnel.slug || "");
        setOriginalSlug(funnel.slug || "");
        setElements(funnel.elements);
        setFunnel(funnel);
        setPageSettings(funnel.settings || pageSettings);
        
        // Initialize history with current state
        setHistory([funnel.elements]);
        setHistoryIndex(0);
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

  // Save changes to history
  const saveToHistory = useCallback((newElements: FunnelElement[]) => {
    setHistory(prev => {
      // Remove any future history if we're not at the latest point
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newElements];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Handle elements change
  const handleElementsChange = (newElements: FunnelElement[]) => {
    setElements(newElements);
    saveToHistory(newElements);
  };

  // Save funnel changes
  const handleSave = async () => {
    if (!isSlugValid) {
      toast({
        title: "שגיאה בשמירה",
        description: "כתובת ה-URL אינה תקינה או כבר בשימוש",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // If slug is empty, generate a new one
      let slugToUse = funnelSlug;
      if (!slugToUse) {
        slugToUse = generateSlug(funnelName);
        setFunnelSlug(slugToUse);
      }

      const funnelData: Partial<Funnel> = {
        id: id !== "new" ? id : undefined,
        name: funnelName,
        slug: slugToUse,
        elements,
        settings: pageSettings,
        user_id: user?.id,
      };

      let savedFunnel;
      if (id === "new") {
        savedFunnel = await funnelService.createFunnel(funnelData);
        navigate(`/funnel/edit/${savedFunnel.id}`, { replace: true });
      } else {
        savedFunnel = await funnelService.updateFunnel(id as string, funnelData);
      }

      setFunnel(savedFunnel);
      setOriginalSlug(savedFunnel.slug || "");

      toast({
        title: "נשמר בהצלחה",
        description: "המשפך נשמר בהצלחה",
      });
    } catch (error) {
      console.error("Error saving funnel:", error);
      toast({
        title: "שגיאה בשמירה",
        description: "אירעה שגיאה בשמירת המשפך",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview funnel
  const handlePreview = () => {
    if (id === "new") {
      toast({
        title: "שמור תחילה",
        description: "יש לשמור את המשפך לפני תצוגה מקדימה",
      });
      return;
    }
    window.open(`/funnel/view/${id}`, "_blank");
  };

  // Handle funnel published
  const handleFunnelPublished = () => {
    toast({
      title: "המשפך פורסם",
      description: "המשפך פורסם בהצלחה",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-medium">טוען עורך...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="ml-2" asChild>
            <Link to="/">
              <ChevronLeft className="ml-1 h-4 w-4" />
              חזרה לדשבורד
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">עורך משפך - {funnelName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <DevicePreview 
            activeDevice={activeDevice} 
            onChange={setActiveDevice} 
          />
          
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <Eye className="ml-2 h-4 w-4" />
            תצוגה מקדימה
          </Button>
          
          {funnel && <PublishFunnelButton funnel={funnel} onPublished={handleFunnelPublished} />}
          
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || !isSlugValid}
          >
            {isSaving ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="ml-2 h-4 w-4" />
            )}
            {isSaving ? 'שומר...' : 'שמור שינויים'}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-l bg-white p-4 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid grid-cols-2">
              <TabsTrigger value="editor">עורך</TabsTrigger>
              <TabsTrigger value="settings">הגדרות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 flex flex-col">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="funnel-name">שם המשפך</Label>
                  <Input
                    id="funnel-name"
                    value={funnelName}
                    onChange={(e) => setFunnelName(e.target.value)}
                    placeholder="שם המשפך"
                  />
                </div>
                
                <div>
                  <Label htmlFor="funnel-slug">כתובת URL</Label>
                  <div className="relative">
                    <Input
                      id="funnel-slug"
                      value={funnelSlug}
                      onChange={(e) => setFunnelSlug(e.target.value)}
                      placeholder="כתובת-url"
                      className={cn(
                        !isSlugValid && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    {isCheckingSlug && (
                      <Loader2 className="h-4 w-4 animate-spin absolute left-3 top-3 text-muted-foreground" />
                    )}
                    {!isSlugValid && !isCheckingSlug && (
                      <AlertCircle className="h-4 w-4 absolute left-3 top-3 text-red-500" />
                    )}
                  </div>
                  {!isSlugValid && !isCheckingSlug && (
                    <p className="text-sm text-red-500 mt-1">
                      כתובת ה-URL אינה תקינה או כבר בשימוש
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    כתובת המשפך תהיה: {window.location.origin}/f/{funnelSlug}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 overflow-y-auto">
              <PageSettings
                settings={pageSettings}
                onChange={setPageSettings}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <FunnelDocumentEditor 
            elements={elements}
            onChange={handleElementsChange}
            onSelectElement={setSelectedElement}
            selectedElement={selectedElement}
            activeDevice={activeDevice}
          />
        </div>

        {selectedElement && (
          <div className="w-80 border-r bg-white p-4 overflow-y-auto">
            <ElementSettings
              element={selectedElement}
              onChange={(content) => {
                const newElements = elements.map(el => {
                  if (el.id === selectedElement.id) {
                    return { ...el, content };
                  }
                  return el;
                });
                setElements(newElements);
              }}
              onClose={() => {
                setSelectedElement(null);
                // Save to history when element is deselected
                saveToHistory(elements);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelEditor;
