
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Layout, MousePointer } from 'lucide-react';

interface EmptyFunnelStateProps {
  onAddElement: () => void;
}

const EmptyFunnelState: React.FC<EmptyFunnelStateProps> = ({ onAddElement }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Layout className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">המשפך שלך ריק</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        התחל להוסיף אלמנטים למשפך שלך. גרור ושחרר אלמנטים מהתפריט הצדדי או השתמש בכפתור למטה.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onAddElement} className="flex items-center">
          <Plus className="ml-2 h-4 w-4" />
          הוסף אלמנט ראשון
        </Button>
        <Button variant="outline" className="flex items-center">
          <MousePointer className="ml-2 h-4 w-4" />
          בחר תבנית מוכנה
        </Button>
      </div>
    </div>
  );
};

export default EmptyFunnelState;
