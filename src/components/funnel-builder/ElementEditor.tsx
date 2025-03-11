
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ElementControls from '@/components/funnel-builder/ElementControls';
import { FunnelElement } from '@/types/funnel';
import RichTextEditor from '@/components/funnel-builder/RichTextEditor';

interface ElementEditorProps {
  element: FunnelElement;
  index: number;
  isSelected: boolean;
  onSelect: (element: FunnelElement) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: any) => void;
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
                  <RichTextEditor
                    value={element.content.title}
                    onChange={(value) => handleContentChange('title', value)}
                    className="text-4xl font-bold"
                    placeholder="כותרת ראשית"
                    autoFocus
                  />
                  <RichTextEditor
                    value={element.content.subtitle}
                    onChange={(value) => handleContentChange('subtitle', value)}
                    className="text-xl"
                    placeholder="כותרת משנה"
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
                <RichTextEditor
                  value={element.content.text}
                  onChange={(value) => handleContentChange('text', value)}
                  className="text-lg"
                  placeholder="הקלד טקסט כאן..."
                  autoFocus
                />
              ) : (
                <p 
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: element.content.text }}
                />
              )}
            </div>
          </div>
        );
      // Add other element types here
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
