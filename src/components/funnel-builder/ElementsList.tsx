
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { FunnelElement } from '@/types/funnel';
import ElementEditor from '@/components/funnel-builder/ElementEditor';
import EmptyFunnelState from '@/components/funnel-builder/EmptyFunnelState';

interface ElementsListProps {
  elements: FunnelElement[];
  selectedElement: FunnelElement | null;
  onSelectElement: (element: FunnelElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onUpdateElement: (id: string, content: any) => void;
  onAddElement: (type: string) => void;
  activeDevice: 'desktop' | 'tablet' | 'mobile';
}

const ElementsList: React.FC<ElementsListProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onDuplicateElement,
  onDeleteElement,
  onUpdateElement,
  onAddElement,
  activeDevice,
}) => {
  return (
    <Droppable droppableId="elements-list">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-1 p-4 overflow-y-auto"
        >
          {elements.length === 0 ? (
            <EmptyFunnelState onAddElement={onAddElement} />
          ) : (
            elements.map((element, index) => (
              <ElementEditor
                key={element.id}
                element={element}
                index={index}
                isSelected={selectedElement?.id === element.id}
                onSelect={onSelectElement}
                onDuplicate={onDuplicateElement}
                onDelete={onDeleteElement}
                onUpdate={onUpdateElement}
                onAddElement={onAddElement}
                activeDevice={activeDevice}
              />
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ElementsList;
