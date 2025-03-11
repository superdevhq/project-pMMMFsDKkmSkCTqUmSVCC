
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FunnelElement } from "@/types/funnel";
import { Type, AlignCenter, MousePointer, Image, Video, FormInput } from "lucide-react";

interface EditorSidebarProps {
  onAddElement: (element: FunnelElement) => void;
}

const EditorSidebar = ({ onAddElement }: EditorSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const generateId = (type: string) => {
    return `${type}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const addHeader = () => {
    onAddElement({
      id: generateId("header"),
      type: "header",
      content: {
        title: "כותרת ראשית חדשה",
        subtitle: "כותרת משנה שמסבירה את הערך המוצע",
        alignment: "center",
        backgroundColor: "#4F46E5",
        textColor: "#FFFFFF",
      },
    });
  };

  const addText = () => {
    onAddElement({
      id: generateId("text"),
      type: "text",
      content: {
        text: "הוסף כאן את הטקסט שלך. זהו המקום להסביר את הערך של המוצר או השירות שלך.",
        alignment: "right",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
      },
    });
  };

  const addCTA = () => {
    onAddElement({
      id: generateId("cta"),
      type: "cta",
      content: {
        buttonText: "לחץ כאן",
        buttonColor: "#4F46E5",
        buttonTextColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        alignment: "center",
      },
    });
  };

  const addImage = () => {
    onAddElement({
      id: generateId("image"),
      type: "image",
      content: {
        imageUrl: "https://via.placeholder.com/600x400",
        altText: "תיאור התמונה",
        alignment: "center",
        backgroundColor: "#FFFFFF",
      },
    });
  };

  const addVideo = () => {
    onAddElement({
      id: generateId("video"),
      type: "video",
      content: {
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://via.placeholder.com/600x400",
        alignment: "center",
        backgroundColor: "#FFFFFF",
      },
    });
  };

  const addForm = () => {
    onAddElement({
      id: generateId("form"),
      type: "form",
      content: {
        fields: [
          {
            id: generateId("field"),
            type: "text",
            label: "שם מלא",
            placeholder: "הכנס את שמך המלא",
            required: true,
          },
          {
            id: generateId("field"),
            type: "email",
            label: "אימייל",
            placeholder: "הכנס את כתובת האימייל שלך",
            required: true,
          },
        ],
        buttonText: "שלח",
        buttonColor: "#4F46E5",
        buttonTextColor: "#FFFFFF",
        backgroundColor: "#FFFFFF",
        alignment: "center",
      },
    });
  };

  const elements = [
    {
      name: "כותרת",
      icon: <Type className="h-5 w-5" />,
      action: addHeader,
      description: "כותרת ראשית וכותרת משנה",
    },
    {
      name: "טקסט",
      icon: <AlignCenter className="h-5 w-5" />,
      action: addText,
      description: "פסקת טקסט",
    },
    {
      name: "כפתור",
      icon: <MousePointer className="h-5 w-5" />,
      action: addCTA,
      description: "כפתור קריאה לפעולה",
    },
    {
      name: "תמונה",
      icon: <Image className="h-5 w-5" />,
      action: addImage,
      description: "הוספת תמונה",
    },
    {
      name: "וידאו",
      icon: <Video className="h-5 w-5" />,
      action: addVideo,
      description: "הוספת סרטון וידאו",
    },
    {
      name: "טופס",
      icon: <FormInput className="h-5 w-5" />,
      action: addForm,
      description: "טופס איסוף פרטים",
    },
  ];

  const filteredElements = elements.filter((element) =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search-elements">חיפוש אלמנטים</Label>
        <Input
          id="search-elements"
          placeholder="חפש אלמנטים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">בסיסי</TabsTrigger>
          <TabsTrigger value="advanced">מתקדם</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-4 space-y-3">
          {filteredElements.slice(0, 3).map((element, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-muted transition-colors flex items-center gap-3"
              onClick={element.action}
            >
              <div className="bg-primary/10 p-2 rounded-md text-primary">
                {element.icon}
              </div>
              <div>
                <h3 className="font-medium">{element.name}</h3>
                <p className="text-sm text-muted-foreground">{element.description}</p>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="advanced" className="mt-4 space-y-3">
          {filteredElements.slice(3).map((element, index) => (
            <Card
              key={index}
              className="p-3 cursor-pointer hover:bg-muted transition-colors flex items-center gap-3"
              onClick={element.action}
            >
              <div className="bg-primary/10 p-2 rounded-md text-primary">
                {element.icon}
              </div>
              <div>
                <h3 className="font-medium">{element.name}</h3>
                <p className="text-sm text-muted-foreground">{element.description}</p>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <div className="pt-4">
        <h3 className="font-medium mb-3">תבניות מוכנות</h3>
        <div className="space-y-3">
          <Card className="p-3 cursor-pointer hover:bg-muted transition-colors">
            <h4 className="font-medium">עמוד נחיתה בסיסי</h4>
            <p className="text-sm text-muted-foreground">כותרת, טקסט וכפתור</p>
          </Card>
          <Card className="p-3 cursor-pointer hover:bg-muted transition-colors">
            <h4 className="font-medium">דף מכירות</h4>
            <p className="text-sm text-muted-foreground">עמוד מכירות מלא עם טופס</p>
          </Card>
          <Card className="p-3 cursor-pointer hover:bg-muted transition-colors">
            <h4 className="font-medium">דף הרשמה לוובינר</h4>
            <p className="text-sm text-muted-foreground">עמוד הרשמה לוובינר עם וידאו</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
