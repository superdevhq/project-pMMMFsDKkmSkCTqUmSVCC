
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ChevronLeft, Eye, Save, Settings } from "lucide-react";
import EditorSidebar from "@/components/funnel-builder/EditorSidebar";
import ElementSettings from "@/components/funnel-builder/ElementSettings";
import { FunnelElement } from "@/types/funnel";

const FunnelEditor = () => {
  const { id } = useParams();
  const [elements, setElements] = useState<FunnelElement[]>([
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
  
  const [selectedElement, setSelectedElement] = useState<FunnelElement | null>(null);
  const [activeTab, setActiveTab] = useState("editor");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setElements(items);
  };

  const addElement = (element: FunnelElement) => {
    setElements([...elements, element]);
  };

  const updateElement = (updatedElement: FunnelElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const renderElement = (element: FunnelElement) => {
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
            className="w-full"
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{element.content.title}</h1>
              <h2 className="text-xl">{element.content.subtitle}</h2>
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
              <p className="text-lg">{element.content.text}</p>
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
              >
                {element.content.buttonText}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getFunnelName = () => {
    if (id === "new") return "משפך חדש";
    return id === "1" ? "קורס דיגיטלי" : id === "2" ? "וובינר" : "חברות VIP";
  };

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
          <h1 className="text-xl font-semibold">עורך משפך - {getFunnelName()}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/funnel/view/${id}`}>
              <Eye className="ml-2 h-4 w-4" />
              תצוגה מקדימה
            </Link>
          </Button>
          <Button size="sm">
            <Save className="ml-2 h-4 w-4" />
            שמור
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
                  <label className="text-sm font-medium">שם המשפך</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md" 
                    defaultValue={getFunnelName()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">כתובת URL</label>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <span className="bg-gray-100 px-2 py-2 text-sm text-gray-500 border-l">
                      funnel.co.il/
                    </span>
                    <input 
                      type="text" 
                      className="w-full p-2 border-0" 
                      defaultValue={id === "1" ? "digital-course" : id === "2" ? "webinar" : id === "3" ? "vip" : "new-funnel"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-l p-4">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm">
                <Settings className="ml-2 h-4 w-4" />
                הגדרות עמוד
              </Button>
              <Button size="sm">
                שמור שינויים
              </Button>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto bg-gray-100 p-4">
              <Card className="max-w-4xl mx-auto shadow-md">
                <CardContent className="p-0">
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
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative group"
                                  onClick={() => setSelectedElement(element)}
                                >
                                  <div className="absolute top-0 right-0 bg-primary text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    {element.type === "header" ? "כותרת" : element.type === "text" ? "טקסט" : "כפתור"}
                                  </div>
                                  {renderElement(element)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelEditor;
