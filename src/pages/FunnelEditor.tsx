
import { useState, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  Eye, 
  Save, 
  Settings, 
  Plus,
  Undo,
  Redo,
  Copy,
  Trash2,
  Globe,
  Loader2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import EditorSidebar from "@/components/funnel-builder/EditorSidebar";
import ElementSettings from "@/components/funnel-builder/ElementSettings";
import ElementControls from "@/components/funnel-builder/ElementControls";
import InlineEditor from "@/components/funnel-builder/InlineEditor";
import EmptyFunnelState from "@/components/funnel-builder/EmptyFunnelState";
import PageSettings from "@/components/funnel-builder/PageSettings";
import DevicePreview from "@/components/funnel-builder/DevicePreview";
import PublishFunnelButton from "@/components/funnel-builder/PublishFunnelButton";
import { Funnel, FunnelElement } from "@/types/funnel";
import { cn } from "@/lib/utils";
import { funnelService } from "@/services/funnelService";
import { useAuth } from "@/contexts/AuthContext";

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type DeploymentStatus = 'not_deployed' | 'deploying' | 'deployed' | 'failed';

const FunnelEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [elements, setElements] = useState<FunnelElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FunnelElement | null>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [funnelName, setFunnelName] = useState("");
  const [funnelSlug, setFunnelSlug] = useState("");
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [history, setHistory] = useState<FunnelElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [lastDeployedAt, setLastDeployedAt] = useState<string | null>(null);
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

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toast({
        title: "עליך להתחבר",
        description: "עליך להתחבר כדי לערוך משפכים",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load funnel data
  useEffect(() => {
    const loadFunnel = async () => {
      if (!id || id === "new") {
        // Create a new funnel with default elements
        setElements([
          {
            id: "header-1",
            type: "header",
            content: {
              title: "כותרת ראשית מרשימה",
              subtitle: "כותרת משנה שמסבירה את הערך המוצע",
              alignment: "center",
              backgroundColor: "#4F46E5",
              textColor: "#FFFFFF",
            },
          },
          {
            id: "text-1",
            type: "text",
            content: {
              text: "כאן המקום לתוכן שמסביר את הערך של המוצר או השירות שלך. תוכן זה צריך להיות ברור, תמציתי ומשכנע.",
              alignment: "right",
              backgroundColor: "#FFFFFF",
              textColor: "#1F2937",
            },
          },
          {
            id: "cta-1",
            type: "cta",
            content: {
              buttonText: "הירשם עכשיו",
              buttonColor: "#4F46E5",
              buttonTextColor: "#FFFFFF",
              backgroundColor: "#FFFFFF",
              alignment: "center",
            },
          },
        ]);
        setFunnelName("משפך חדש");
        setFunnelSlug(generateSlug("משפך חדש"));
        setPageSettings({
          ...pageSettings,
          metaTitle: "משפך חדש",
          metaDescription: "תיאור המשפך שלך כאן",
        });
        setIsLoading(false);
        return;
      }

      try {
        const loadedFunnel = await funnelService.getFunnelById(id);
        
        if (!loadedFunnel) {
          toast({
            title: "משפך לא נמצא",
            description: "המשפך המבוקש לא נמצא",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setFunnel(loadedFunnel);
        setElements(loadedFunnel.elements);
        setFunnelName(loadedFunnel.name);
        setFunnelSlug(loadedFunnel.slug);
        setPageSettings(loadedFunnel.settings);
        
        // Check deployment status
        const deployment = await funnelService.getLatestDeployment(loadedFunnel.id);
        if (deployment) {
          setLastDeployedAt(deployment.deployed_at);
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

    if (isAuthenticated) {
      loadFunnel();
    }
  }, [id, isAuthenticated]);

  // Initialize history with initial elements
  useEffect(() => {
    if (elements.length > 0 && history.length === 0) {
      setHistory([elements]);
      setHistoryIndex(0);
    }
  }, [elements, history.length]);

  // Add to history when elements change (if not from undo/redo)
  useEffect(() => {
    if (isEditing && elements.length > 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...elements]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setIsEditing(false);
    }
  }, [elements, isEditing]);

  const addToHistory = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setElements(items);
    addToHistory();
  };

  const addElement = (element: FunnelElement) => {
    setElements([...elements, element]);
    addToHistory();
  };

  const updateElement = (updatedElement: FunnelElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
    addToHistory();
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
    addToHistory();
    toast({
      title: "אלמנט הוסר",
      description: "האלמנט הוסר בהצלחה מהמשפך",
    });
  };

  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(el => el.id === id);
    if (!elementToDuplicate) return;
    
    const index = elements.findIndex(el => el.id === id);
    const newElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${Date.now()}`
    };
    
    const newElements = [...elements];
    newElements.splice(index + 1, 0, newElement);
    setElements(newElements);
    addToHistory();
    
    toast({
      title: "אלמנט שוכפל",
      description: "האלמנט שוכפל בהצלחה",
    });
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === elements.length - 1) return;
    
    const newElements = [...elements];
    const element = newElements[index];
    
    if (direction === 'up') {
      newElements[index] = newElements[index - 1];
      newElements[index - 1] = element;
    } else {
      newElements[index] = newElements[index + 1];
      newElements[index + 1] = element;
    }
    
    setElements(newElements);
    addToHistory();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "עליך להתחבר",
        description: "עליך להתחבר כדי לשמור משפכים",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const funnelData = {
        name: funnelName,
        slug: funnelSlug,
        elements,
        settings: pageSettings,
      };

      let result;
      
      if (id === "new") {
        // Create a new funnel
        result = await funnelService.createFunnel(funnelData);
        if (result) {
          setFunnel(result);
          navigate(`/funnel/edit/${result.id}`);
        }
      } else {
        // Update existing funnel
        result = await funnelService.updateFunnel(id, funnelData);
        if (result) {
          setFunnel(result);
        }
      }

      if (result) {
        toast({
          title: "שינויים נשמרו",
          description: "השינויים נשמרו בהצלחה",
        });
      }
    } catch (error) {
      console.error("Error saving funnel:", error);
      toast({
        title: "שגיאה בשמירת המשפך",
        description: "אירעה שגיאה בשמירת המשפך",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (id === "new") {
      toast({
        title: "שמור תחילה",
        description: "עליך לשמור את המשפך לפני שתוכל לצפות בו",
      });
      return;
    }
    navigate(`/funnel/view/${id}`);
  };

  const handleFunnelPublished = (updatedFunnel: Funnel) => {
    setFunnel(updatedFunnel);
    setLastDeployedAt(updatedFunnel.published_at || null);
  };

  const renderElement = (element: FunnelElement, index: number) => {
    const isFirst = index === 0;
    const isLast = index === elements.length - 1;
    
    switch (element.type) {
      case "header":
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "3rem 1rem",
            }}
            className="w-full relative"
          >
            <div className="max-w-4xl mx-auto">
              <InlineEditor
                value={element.content.title}
                onChange={(value) => {
                  const updatedElement = {
                    ...element,
                    content: {
                      ...element.content,
                      title: value
                    }
                  };
                  updateElement(updatedElement);
                }}
                fontSize="4xl"
                fontWeight="bold"
                className="mb-4"
                textColor={element.content.textColor}
              />
              <InlineEditor
                value={element.content.subtitle}
                onChange={(value) => {
                  const updatedElement = {
                    ...element,
                    content: {
                      ...element.content,
                      subtitle: value
                    }
                  };
                  updateElement(updatedElement);
                }}
                fontSize="xl"
                textColor={element.content.textColor}
              />
            </div>
          </div>
        );
      case "text":
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
              <InlineEditor
                value={element.content.text}
                onChange={(value) => {
                  const updatedElement = {
                    ...element,
                    content: {
                      ...element.content,
                      text: value
                    }
                  };
                  updateElement(updatedElement);
                }}
                fontSize="lg"
                multiline
                textColor={element.content.textColor}
              />
            </div>
          </div>
        );
      case "cta":
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
              <Button
                style={{
                  backgroundColor: element.content.buttonColor,
                  color: element.content.buttonTextColor,
                }}
                size="lg"
                onClick={(e) => e.stopPropagation()}
              >
                <InlineEditor
                  value={element.content.buttonText}
                  onChange={(value) => {
                    const updatedElement = {
                      ...element,
                      content: {
                        ...element.content,
                        buttonText: value
                      }
                    };
                    updateElement(updatedElement);
                  }}
                  fontSize="base"
                  fontWeight="medium"
                  textColor={element.content.buttonTextColor}
                  className="min-w-[100px]"
                />
              </Button>
            </div>
          </div>
        );
      case "image":
        const imageContent = element.content as any;
        return (
          <div
            style={{
              backgroundColor: imageContent.backgroundColor,
              textAlign: imageContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
              <img 
                src={imageContent.imageUrl} 
                alt={imageContent.altText} 
                className="max-w-full h-auto rounded-md"
              />
            </div>
          </div>
        );
      case "video":
        const videoContent = element.content as any;
        return (
          <div
            style={{
              backgroundColor: videoContent.backgroundColor,
              textAlign: videoContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
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
            style={{
              backgroundColor: formContent.backgroundColor,
              textAlign: formContent.alignment as any,
              padding: "2rem 1rem",
            }}
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
              <form className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
                {formContent.fields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.label}</Label>
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
                      <Input 
                        type={field.type} 
                        placeholder={field.placeholder} 
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

  const getDevicePreviewClass = () => {
    switch (activeDevice) {
      case 'desktop':
        return 'max-w-full';
      case 'tablet':
        return 'max-w-[768px] mx-auto border-x border-gray-200 shadow-md';
      case 'mobile':
        return 'max-w-[375px] mx-auto border-x border-gray-200 shadow-md';
      default:
        return 'max-w-full';
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
            disabled={isSaving}
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
              <TabsTrigger value="editor">אלמנטים</TabsTrigger>
              <TabsTrigger value="settings">הגדרות</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 overflow-auto mt-0">
              <EditorSidebar onAddElement={addElement} />
            </TabsContent>

            <TabsContent value="settings" className="flex-1 overflow-auto mt-0">
              <div className="space-y-4">
                <h3 className="font-medium">הגדרות משפך</h3>
                <div className="space-y-2">
                  <Label htmlFor="funnel-name">שם המשפך</Label>
                  <Input 
                    id="funnel-name"
                    value={funnelName}
                    onChange={(e) => setFunnelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funnel-slug">כתובת URL</Label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="bg-gray-100 px-2 py-2 text-sm text-gray-500 border-l">
                      funnel.co.il/
                    </span>
                    <Input 
                      id="funnel-slug"
                      value={funnelSlug}
                      onChange={(e) => setFunnelSlug(e.target.value)}
                      className="border-0"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setShowPageSettings(true)}
                >
                  <Settings className="ml-2 h-4 w-4" />
                  הגדרות עמוד מתקדמות
                </Button>
                
                {funnel && funnel.is_published && (
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <Globe className="h-4 w-4" />
                      <h4 className="font-medium">המשפך מפורסם</h4>
                    </div>
                    <p className="text-sm text-green-600">
                      המשפך שלך זמין בכתובת:
                    </p>
                    <a 
                      href={`${window.location.origin}/funnel/view/${funnelSlug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline block mt-1"
                    >
                      {window.location.origin}/funnel/view/{funnelSlug}
                    </a>
                    {lastDeployedAt && (
                      <p className="text-xs text-green-500 mt-2">
                        פורסם לאחרונה: {new Date(lastDeployedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-l p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUndo()}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRedo()}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPageSettings(true)}
                >
                  <Settings className="ml-2 h-4 w-4" />
                  הגדרות עמוד
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <Card className={cn("mx-auto shadow-md transition-all", getDevicePreviewClass())}>
                <CardContent className="p-0">
                  {elements.length === 0 ? (
                    <EmptyFunnelState onAddElement={() => setActiveTab("editor")} />
                  ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="funnel-elements">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-[500px]"
                          >
                            {elements.map((element, index) => (
                              <Draggable
                                key={element.id}
                                draggableId={element.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={cn(
                                      "relative group",
                                      selectedElement?.id === element.id && "ring-2 ring-primary",
                                      snapshot.isDragging && "opacity-70"
                                    )}
                                    onClick={() => setSelectedElement(element)}
                                  >
                                    <div className="absolute top-0 right-0 bg-primary text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      {element.type === "header" ? "כותרת" : 
                                       element.type === "text" ? "טקסט" : 
                                       element.type === "cta" ? "כפתור" :
                                       element.type === "image" ? "תמונה" :
                                       element.type === "video" ? "וידאו" : "טופס"}
                                    </div>
                                    
                                    <ElementControls
                                      onMoveUp={() => moveElement(element.id, 'up')}
                                      onMoveDown={() => moveElement(element.id, 'down')}
                                      onDuplicate={() => duplicateElement(element.id)}
                                      onDelete={() => removeElement(element.id)}
                                      onSettings={() => setSelectedElement(element)}
                                      isFirst={index === 0}
                                      isLast={index === elements.length - 1}
                                      dragHandleProps={provided.dragHandleProps}
                                    />
                                    
                                    {renderElement(element, index)}
                                    
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary pointer-events-none"></div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            </div>

            {selectedElement && (
              <div className="w-80 border-r bg-white p-4 overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">הגדרות אלמנט</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedElement(null)}
                  >
                    סגור
                  </Button>
                </div>
                <Separator className="mb-4" />
                <ElementSettings 
                  element={selectedElement} 
                  onUpdate={updateElement} 
                  onRemove={removeElement} 
                />
                
                <div className="mt-6 space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => duplicateElement(selectedElement.id)}
                  >
                    <Copy className="ml-2 h-4 w-4" />
                    שכפל אלמנט
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => removeElement(selectedElement.id)}
                  >
                    <Trash2 className="ml-2 h-4 w-4" />
                    מחק אלמנט
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPageSettings && (
        <PageSettings 
          onClose={() => setShowPageSettings(false)}
          onSave={(settings) => {
            setPageSettings(settings);
            setShowPageSettings(false);
            toast({
              title: "הגדרות עמוד נשמרו",
              description: "הגדרות העמוד נשמרו בהצלחה",
            });
          }}
          initialSettings={pageSettings}
        />
      )}
    </div>
  );
};

export default FunnelEditor;
