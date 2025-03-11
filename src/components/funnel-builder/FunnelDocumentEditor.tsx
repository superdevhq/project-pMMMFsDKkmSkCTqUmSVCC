
import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Link as LinkIcon,
  Image,
  Video,
  FormInput,
  MousePointerClick,
  Plus,
  ChevronDown,
  Settings,
  Palette,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { FunnelElement } from '@/types/funnel';
import { v4 as uuidv4 } from 'uuid';

interface FunnelDocumentEditorProps {
  elements: FunnelElement[];
  onChange: (elements: FunnelElement[]) => void;
  onSelectElement: (element: FunnelElement | null) => void;
  selectedElement: FunnelElement | null;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
}

const FunnelDocumentEditor: React.FC<FunnelDocumentEditorProps> = ({
  elements,
  onChange,
  onSelectElement,
  selectedElement,
  activeDevice,
}) => {
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashCommandPosition, setSlashCommandPosition] = useState({ top: 0, left: 0 });
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  // Function to create a new element
  const createNewElement = (type: string, position: number = elements.length) => {
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
              { id: uuidv4(), type: "text", label: "שם מלא", placeholder: "הכנס את שמך המלא", required: true },
              { id: uuidv4(), type: "email", label: "אימייל", placeholder: "הכנס את האימייל שלך", required: true },
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
        return null;
    }

    const newElements = [
      ...elements.slice(0, position),
      newElement,
      ...elements.slice(position)
    ];
    
    onChange(newElements);
    onSelectElement(newElement);
    return newElement;
  };

  // Function to update an element
  const updateElement = (id: string, content: any) => {
    const newElements = elements.map(el => {
      if (el.id === id) {
        return { ...el, content };
      }
      return el;
    });
    
    onChange(newElements);
  };

  // Function to delete an element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    onChange(newElements);
    onSelectElement(null);
  };

  // Function to duplicate an element
  const duplicateElement = (id: string) => {
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

    onChange(newElements);
    onSelectElement(duplicatedElement);
  };

  // Function to handle slash commands
  const handleSlashCommand = (type: string) => {
    setShowSlashCommands(false);
    
    // Find the index of the currently selected element
    const currentIndex = selectedElement 
      ? elements.findIndex(el => el.id === selectedElement.id)
      : elements.length - 1;
    
    // Create a new element after the current one
    createNewElement(type, currentIndex + 1);
  };

  // Render a single element
  const renderElement = (element: FunnelElement, index: number) => {
    const isSelected = selectedElement?.id === element.id;
    
    const elementProps = {
      key: element.id,
      className: cn(
        "relative mb-6 p-4 border rounded-lg transition-all",
        isSelected && "ring-2 ring-primary",
        activeDevice === 'tablet' && "max-w-[768px] mx-auto",
        activeDevice === 'mobile' && "max-w-[375px] mx-auto",
      ),
      onClick: () => onSelectElement(element),
      style: {
        backgroundColor: (element.content as any).backgroundColor || '#ffffff',
      }
    };

    switch (element.type) {
      case 'header':
        return (
          <div {...elementProps}>
            <div 
              className="text-4xl font-bold mb-4"
              style={{ 
                color: element.content.textColor,
                textAlign: element.content.alignment as any
              }}
              dangerouslySetInnerHTML={{ __html: element.content.title }}
            />
            <div 
              className="text-xl"
              style={{ 
                color: element.content.textColor,
                textAlign: element.content.alignment as any
              }}
              dangerouslySetInnerHTML={{ __html: element.content.subtitle }}
            />
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      case 'text':
        return (
          <div {...elementProps}>
            <div 
              className="prose prose-lg max-w-none"
              style={{ 
                color: element.content.textColor,
                textAlign: element.content.alignment as any
              }}
              dangerouslySetInnerHTML={{ __html: element.content.text }}
            />
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      case 'cta':
        const ctaContent = element.content as any;
        return (
          <div {...elementProps}>
            <div className="flex justify-center">
              <button
                style={{
                  backgroundColor: ctaContent.buttonColor,
                  color: ctaContent.buttonTextColor,
                }}
                className="px-6 py-3 rounded-md font-medium text-lg"
                dangerouslySetInnerHTML={{ __html: ctaContent.buttonText }}
              />
            </div>
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      case 'image':
        const imageContent = element.content as any;
        return (
          <div {...elementProps}>
            <div className="flex justify-center">
              <img 
                src={imageContent.imageUrl} 
                alt={imageContent.altText} 
                className="max-w-full h-auto rounded-md"
              />
            </div>
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      case 'video':
        const videoContent = element.content as any;
        return (
          <div {...elementProps}>
            <div className="aspect-video rounded-md overflow-hidden">
              <iframe
                src={videoContent.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      case 'form':
        const formContent = element.content as any;
        return (
          <div {...elementProps}>
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
              <button
                style={{
                  backgroundColor: formContent.buttonColor,
                  color: formContent.buttonTextColor,
                }}
                className="w-full px-4 py-2 rounded-md font-medium"
              >
                {formContent.buttonText}
              </button>
            </form>
            {isSelected && (
              <ElementControls 
                onDelete={() => deleteElement(element.id)}
                onDuplicate={() => duplicateElement(element.id)}
              />
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="funnel-document-editor p-4 min-h-screen">
      {elements.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">המשפך ריק</h3>
          <p className="text-muted-foreground mb-4">התחל על ידי הוספת אלמנט ראשון</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={() => createNewElement('header')}>
              <Heading1 className="ml-2 h-4 w-4" />
              כותרת ראשית
            </Button>
            <Button onClick={() => createNewElement('text')}>
              <Type className="ml-2 h-4 w-4" />
              טקסט
            </Button>
            <Button onClick={() => createNewElement('cta')}>
              <MousePointerClick className="ml-2 h-4 w-4" />
              כפתור
            </Button>
            <Button onClick={() => createNewElement('image')}>
              <Image className="ml-2 h-4 w-4" />
              תמונה
            </Button>
          </div>
        </div>
      ) : (
        <>
          {elements.map((element, index) => renderElement(element, index))}
          
          <div className="flex justify-center mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף אלמנט
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid gap-2">
                  <h4 className="font-medium mb-1">הוסף אלמנט</h4>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('header')}
                  >
                    <Heading1 className="ml-2 h-4 w-4" />
                    כותרת ראשית
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('text')}
                  >
                    <Type className="ml-2 h-4 w-4" />
                    טקסט
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('cta')}
                  >
                    <MousePointerClick className="ml-2 h-4 w-4" />
                    כפתור קריאה לפעולה
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('image')}
                  >
                    <Image className="ml-2 h-4 w-4" />
                    תמונה
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('video')}
                  >
                    <Video className="ml-2 h-4 w-4" />
                    וידאו
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start" 
                    onClick={() => createNewElement('form')}
                  >
                    <FormInput className="ml-2 h-4 w-4" />
                    טופס
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
};

// Element controls component
const ElementControls: React.FC<{
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ onDelete, onDuplicate }) => {
  return (
    <div className="absolute top-2 left-2 flex gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 bg-white shadow-sm border"
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 bg-white shadow-sm border"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash className="h-4 w-4 text-red-500" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 bg-white shadow-sm border"
      >
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Import missing icon
import { Trash } from 'lucide-react';

export default FunnelDocumentEditor;
