
import React from 'react';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreviewProps {
  activeDevice: DeviceType;
  onChange: (device: DeviceType) => void;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ activeDevice, onChange }) => {
  return (
    <div className="flex items-center gap-1 bg-white rounded-md border p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2',
          activeDevice === 'desktop' && 'bg-muted'
        )}
        onClick={() => onChange('desktop')}
      >
        <Laptop className="h-4 w-4 ml-1" />
        <span className="hidden sm:inline">מחשב</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2',
          activeDevice === 'tablet' && 'bg-muted'
        )}
        onClick={() => onChange('tablet')}
      >
        <Tablet className="h-4 w-4 ml-1" />
        <span className="hidden sm:inline">טאבלט</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 px-2',
          activeDevice === 'mobile' && 'bg-muted'
        )}
        onClick={() => onChange('mobile')}
      >
        <Smartphone className="h-4 w-4 ml-1" />
        <span className="hidden sm:inline">נייד</span>
      </Button>
    </div>
  );
};

export default DevicePreview;
