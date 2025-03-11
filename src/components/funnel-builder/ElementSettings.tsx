
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { FunnelElement } from "@/types/funnel";

interface ElementSettingsProps {
  element: FunnelElement;
  onUpdate: (element: FunnelElement) => void;
  onRemove: (id: string) => void;
}

const ElementSettings = ({ element, onUpdate, onRemove }: ElementSettingsProps) => {
  const [localElement, setLocalElement] = useState<FunnelElement>(element);

  useEffect(() => {
    setLocalElement(element);
  }, [element]);

  const handleChange = (
    field: string,
    value: string,
    contentField = true
  ) => {
    if (contentField) {
      setLocalElement({
        ...localElement,
        content: {
          ...localElement.content,
          [field]: value,
        },
      });
    } else {
      setLocalElement({
        ...localElement,
        [field]: value,
      });
    }
  };

  const handleUpdate = () => {
    onUpdate(localElement);
  };

  const renderHeaderSettings = () => {
    const content = localElement.content as any;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">כותרת ראשית</Label>
          <Input
            id="title"
            value={content.title}
            onChange={(e) => handleChange("title", e.target.value)}
            onBlur={handleUpdate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">כותרת משנה</Label>
          <Input
            id="subtitle"
            value={content.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            onBlur={handleUpdate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alignment">יישור</Label>
          <Select
            value={content.alignment}
            onValueChange={(value) => {
              handleChange("alignment", value);
              handleUpdate();
            }}
          >
            <SelectTrigger id="alignment">
              <SelectValue placeholder="בחר יישור" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">ימין</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="left">שמאל</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">צבע רקע</Label>
          <div className="flex gap-2">
            <Input
              id="backgroundColor"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="textColor">צבע טקסט</Label>
          <div className="flex gap-2">
            <Input
              id="textColor"
              value={content.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTextSettings = () => {
    const content = localElement.content as any;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="text">טקסט</Label>
          <Textarea
            id="text"
            value={content.text}
            onChange={(e) => handleChange("text", e.target.value)}
            onBlur={handleUpdate}
            rows={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alignment">יישור</Label>
          <Select
            value={content.alignment}
            onValueChange={(value) => {
              handleChange("alignment", value);
              handleUpdate();
            }}
          >
            <SelectTrigger id="alignment">
              <SelectValue placeholder="בחר יישור" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">ימין</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="left">שמאל</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">צבע רקע</Label>
          <div className="flex gap-2">
            <Input
              id="backgroundColor"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="textColor">צבע טקסט</Label>
          <div className="flex gap-2">
            <Input
              id="textColor"
              value={content.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.textColor}
              onChange={(e) => handleChange("textColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCTASettings = () => {
    const content = localElement.content as any;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="buttonText">טקסט כפתור</Label>
          <Input
            id="buttonText"
            value={content.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            onBlur={handleUpdate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alignment">יישור</Label>
          <Select
            value={content.alignment}
            onValueChange={(value) => {
              handleChange("alignment", value);
              handleUpdate();
            }}
          >
            <SelectTrigger id="alignment">
              <SelectValue placeholder="בחר יישור" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="right">ימין</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="left">שמאל</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonColor">צבע כפתור</Label>
          <div className="flex gap-2">
            <Input
              id="buttonColor"
              value={content.buttonColor}
              onChange={(e) => handleChange("buttonColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.buttonColor}
              onChange={(e) => handleChange("buttonColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonTextColor">צבע טקסט כפתור</Label>
          <div className="flex gap-2">
            <Input
              id="buttonTextColor"
              value={content.buttonTextColor}
              onChange={(e) => handleChange("buttonTextColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.buttonTextColor}
              onChange={(e) => handleChange("buttonTextColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="backgroundColor">צבע רקע</Label>
          <div className="flex gap-2">
            <Input
              id="backgroundColor"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
            />
            <input
              type="color"
              value={content.backgroundColor}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              onBlur={handleUpdate}
              className="w-10 h-10 p-1 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    switch (localElement.type) {
      case "header":
        return renderHeaderSettings();
      case "text":
        return renderTextSettings();
      case "cta":
        return renderCTASettings();
      default:
        return <p>הגדרות לא זמינות לאלמנט זה</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">
          {localElement.type === "header"
            ? "הגדרות כותרת"
            : localElement.type === "text"
            ? "הגדרות טקסט"
            : "הגדרות כפתור"}
        </h4>
        {renderSettings()}
      </div>

      <Separator />

      <div className="pt-2">
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onRemove(localElement.id)}
        >
          <Trash2 className="ml-2 h-4 w-4" />
          מחק אלמנט
        </Button>
      </div>
    </div>
  );
};

export default ElementSettings;
