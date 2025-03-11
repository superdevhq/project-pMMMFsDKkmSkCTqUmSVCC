
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, ArrowUp, ArrowDown, Settings, Move } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ElementControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings: () => void;
  isFirst: boolean;
  isLast: boolean;
  dragHandleProps?: any;
}

const ElementControls: React.FC<ElementControlsProps> = ({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
  isFirst,
  isLast,
  dragHandleProps
}) => {
  return (
    <TooltipProvider>
      <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-primary hover:text-white"
                onClick={onSettings}
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>הגדרות</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-primary hover:text-white"
                {...dragHandleProps}
              >
                <Move className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>גרור לשינוי מיקום</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-primary hover:text-white"
                onClick={onDuplicate}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>שכפל</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-destructive hover:text-white"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>מחק</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-primary hover:text-white"
                onClick={onMoveUp}
                disabled={isFirst}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>הזז למעלה</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-white shadow-sm hover:bg-primary hover:text-white"
                onClick={onMoveDown}
                disabled={isLast}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>הזז למטה</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ElementControls;
