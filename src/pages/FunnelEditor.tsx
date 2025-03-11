
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EditorSidebar from "@/components/funnel-builder/EditorSidebar";
import ElementSettings from "@/components/funnel-builder/ElementSettings";
import PageSettings from "@/components/funnel-builder/PageSettings";
import { Funnel, FunnelElement } from "@/types/funnel";
import { cn } from "@/lib/utils";
import { funnelService } from "@/services/funnelService";
import { useAuth } from "@/contexts/AuthContext";
import EditorHeader from "@/components/funnel-builder/EditorHeader";
import ElementsList from "@/components/funnel-builder/ElementsList";
import { v4 as uuidv4 } from 'uuid';

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

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Handle element reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setElements(items);
    saveToHistory(items);
  };

  // Add a new element
  const handleAddElement = (type: string) => {
    let newElement: FunnelElement;

    switch (type) {
      case "header":
        newElement = {
          id: uuidv4(),
          type: "header",
          content: {
            title: "כותרת ראשית",
            subtitle: "כותרת משנה",
            backgroundColor: "#f8fafc",
            textColor: "#0f172a",
            alignment: "center",
          },
        };
        break;
      case "text":
        newElement = {
          id: uuidv4(),
          type: "text",
          content: {
            text: "הוסף טקסט כאן...",
            backgroundColor: "#ffffff",
            textColor: "#0f172a",
            alignment: "right",
          },
        };
        break;
      case "cta":
        newElement = {
          id: uuidv4(),
          type: "cta",
          content: {
            buttonText: "לחץ כאן",
            buttonColor: "#3b82f6",
            buttonTextColor: "#ffffff",
            backgroundColor: "#ffffff",
            alignment: "center",
            link: "#",
          },
        };
        break;
      case "image":
        newElement = {
          id: uuidv4(),
          type: "image",
          content: {
            imageUrl: "https://via.placeholder.com/800x400",
            altText: "תיאור התמונה",
            backgroundColor: "#ffffff",
            alignment: "center",
          },
        };
        break;
      case "video":
        newElement = {
          id: uuidv4(),
          type: "video",
          content: {
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            backgroundColor: "#ffffff",
            alignment: "center",
          },
        };
        break;
      case "form":
        newElement = {
          id: uuidv4(),
          type: "form",
          content: {
            fields: [
              { id: uuidv4(), type: "text", label: "שם מלא", placeholder: "הכנס את שמך המלא" },
              { id: uuidv4(), type: "email", label: "אימייל", placeholder: "הכנס את האימייל שלך" },
            ],
            buttonText: "שלח",
            buttonColor: "#3b82f6",
            buttonTextColor: "#ffffff",
            backgroundColor: "#ffffff",
            alignment: "center",
          },
        };
        break;
      default:
        return;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    saveToHistory(newElements);
  };

  // Duplicate an element
  const handleDuplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(el => el.id === id);
    if (!elementToDuplicate) return;

    const duplicatedElement = {
      ...elementToDuplicate,
      id: uuidv4(),
    };

    const elementIndex = elements.findIndex(el => el.id === id);
    const newElements = [
      ...elements.slice(0, elementIndex + 1),
      duplicatedElement,
      ...elements.slice(elementIndex + 1),
    ];

    setElements(newElements);
    setSelectedElement(duplicatedElement);
    saveToHistory(newElements);
  };

  // Delete an element
  const handleDeleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  // Update an element
  const handleUpdateElement = (id: string, content: any) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return { ...el, content };
      }
      return el;
    });

    setElements(newElements);
    
    // Update selected element if it's the one being edited
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, content });
    }
    
    // Don't save to history on every update to avoid history pollution
    // We'll save when the user deselects the element or performs another action
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
      <EditorHeader 
        funnelName={funnelName}
        isSaving={isSaving}
        isSlugValid={isSlugValid}
        activeDevice={activeDevice}
        funnel={funnel}
        onDeviceChange={setActiveDevice}
        onPreview={handlePreview}
        onSave={handleSave}
        onPublished={handleFunnelPublished}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-l bg-white p-4 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid grid-cols-2">
              <TabsTrigger value="editor">אלמנטים</TabsTrigger>
              <TabsTrigger value="settings">הגדרות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 flex flex-col">
              <EditorSidebar onAddElement={handleAddElement} />
            </TabsContent>
            
            <TabsContent value="settings" className="flex-1 overflow-y-auto">
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
                
                <PageSettings
                  settings={pageSettings}
                  onChange={setPageSettings}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <DragDropContext onDragEnd={handleDragEnd}>
            <ElementsList 
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onDuplicateElement={handleDuplicateElement}
              onDeleteElement={handleDeleteElement}
              onUpdateElement={handleUpdateElement}
              onAddElement={handleAddElement}
              activeDevice={activeDevice}
            />
          </DragDropContext>
        </div>

        {selectedElement && (
          <div className="w-80 border-r bg-white p-4 overflow-y-auto">
            <ElementSettings
              element={selectedElement}
              onChange={(content) => handleUpdateElement(selectedElement.id, content)}
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
