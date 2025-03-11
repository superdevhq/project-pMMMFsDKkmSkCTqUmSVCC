
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ElementControls from '@/components/funnel-builder/ElementControls';
import { FunnelElement } from '@/types/funnel';
import NotionLikeEditor from '@/components/funnel-builder/NotionLikeEditor';

interface ElementEditorProps {
  element: FunnelElement;
  index: number;
  isSelected: boolean;
  onSelect: (element: FunnelElement) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: any) => void;
  onAddElement: (type: string) => void;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
}

const ElementEditor: React.FC<ElementEditorProps> = ({
  element,
  index,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  onUpdate,
  onAddElement,
  activeDevice,
}) => {
  const handleContentChange = (key: string, value: any) => {
    onUpdate(element.id, { ...element.content, [key]: value });
  };

  const renderElementContent = () => {
    switch (element.type) {
      case 'header':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "1.5rem 1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto">
              {isSelected ? (
                <div className="space-y-4">
                  <NotionLikeEditor
                    value={element.content.title}
                    onChange={(value) => handleContentChange('title', value)}
                    className="text-4xl font-bold"
                    placeholder="כותרת ראשית / הקלד להוספת תוכן..."
                    autoFocus
                    onAddElement={onAddElement}
                  />
                  <NotionLikeEditor
                    value={element.content.subtitle}
                    onChange={(value) => handleContentChange('subtitle', value)}
                    className="text-xl"
                    placeholder="כותרת משנה / הקלד להוספת תוכן..."
                    onAddElement={onAddElement}
                  />
                </div>
              ) : (
                <>
                  <h1 
                    className="text-4xl font-bold mb-4"
                    dangerouslySetInnerHTML={{ __html: element.content.title }}
                  />
                  <h2 
                    className="text-xl"
                    dangerouslySetInnerHTML={{ __html: element.content.subtitle }}
                  />
                </>
              )}
            </div>
          </div>
        );
      case 'text':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              color: element.content.textColor,
              textAlign: element.content.alignment as any,
              padding: "1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto">
              {isSelected ? (
                <NotionLikeEditor
                  value={element.content.text}
                  onChange={(value) => handleContentChange('text', value)}
                  className="text-lg"
                  placeholder="הקלד / להוספת תוכן..."
                  autoFocus
                  onAddElement={onAddElement}
                />
              ) : (
                <div 
                  className="text-lg prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: element.content.text }}
                />
              )}
            </div>
          </div>
        );
      case 'cta':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "1.5rem 1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto flex justify-center">
              <button
                style={{
                  backgroundColor: element.content.buttonColor,
                  color: element.content.buttonTextColor,
                }}
                className="px-6 py-3 rounded-md font-medium text-lg"
              >
                {isSelected ? (
                  <NotionLikeEditor
                    value={element.content.buttonText}
                    onChange={(value) => handleContentChange('buttonText', value)}
                    className="min-w-[100px] text-center"
                    placeholder="טקסט כפתור..."
                    autoFocus
                    onAddElement={onAddElement}
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: element.content.buttonText }} />
                )}
              </button>
            </div>
          </div>
        );
      case 'image':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "1.5rem 1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto">
              <img 
                src={element.content.imageUrl} 
                alt={element.content.altText} 
                className="max-w-full h-auto rounded-md mx-auto"
              />
              {isSelected && (
                <div className="mt-2">
                  <NotionLikeEditor
                    value={element.content.caption || ''}
                    onChange={(value) => handleContentChange('caption', value)}
                    className="text-sm text-center text-gray-500"
                    placeholder="הוסף כיתוב לתמונה..."
                    onAddElement={onAddElement}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'video':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "1.5rem 1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto">
              <div className="aspect-video rounded-md overflow-hidden">
                <iframe
                  src={element.content.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {isSelected && (
                <div className="mt-2">
                  <NotionLikeEditor
                    value={element.content.caption || ''}
                    onChange={(value) => handleContentChange('caption', value)}
                    className="text-sm text-center text-gray-500"
                    placeholder="הוסף כיתוב לוידאו..."
                    onAddElement={onAddElement}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 'form':
        return (
          <div
            style={{
              backgroundColor: element.content.backgroundColor,
              textAlign: element.content.alignment as any,
              padding: "1.5rem 1rem",
            }}
            className="w-full"
            onClick={() => onSelect(element)}
          >
            <div className="max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                {isSelected && (
                  <div className="mb-4">
                    <NotionLikeEditor
                      value={element.content.formTitle || ''}
                      onChange={(value) => handleContentChange('formTitle', value)}
                      className="text-xl font-medium"
                      placeholder="כותרת הטופס..."
                      onAddElement={onAddElement}
                    />
                  </div>
                )}
                
                {element.content.fields?.map((field: any) => (
                  <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
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
                    backgroundColor: element.content.buttonColor,
                    color: element.content.buttonTextColor,
                  }}
                  className="w-full px-4 py-2 rounded-md font-medium"
                >
                  {isSelected ? (
                    <NotionLikeEditor
                      value={element.content.buttonText}
                      onChange={(value) => handleContentChange('buttonText', value)}
                      className="text-center"
                      placeholder="טקסט כפתור..."
                      onAddElement={onAddElement}
                    />
                  ) : (
                    <span>{element.content.buttonText}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            אלמנט לא מוכר
          </div>
        );
    }
  };

  return (
    <Draggable draggableId={element.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "relative mb-4 group",
            activeDevice === 'tablet' && "max-w-[768px] mx-auto",
            activeDevice === 'mobile' && "max-w-[375px] mx-auto",
          )}
        >
          <Card
            className={cn(
              "border overflow-hidden transition-all",
              isSelected && "ring-2 ring-primary",
              snapshot.isDragging && "shadow-lg"
            )}
          >
            <CardContent className="p-0">
              {renderElementContent()}
            </CardContent>
          </Card>
          
          <ElementControls
            dragHandleProps={provided.dragHandleProps}
            onDuplicate={() => onDuplicate(element.id)}
            onDelete={() => onDelete(element.id)}
            isSelected={isSelected}
          />
        </div>
      )}
    </Draggable>
  );
};

export default ElementEditor;
