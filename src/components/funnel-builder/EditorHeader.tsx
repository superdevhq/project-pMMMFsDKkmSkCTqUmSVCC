
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  Eye, 
  Save, 
  Loader2 
} from 'lucide-react';
import DevicePreview from '@/components/funnel-builder/DevicePreview';
import PublishFunnelButton from '@/components/funnel-builder/PublishFunnelButton';
import { Funnel } from '@/types/funnel';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface EditorHeaderProps {
  funnelName: string;
  isSaving: boolean;
  isSlugValid: boolean;
  activeDevice: DeviceType;
  funnel: Funnel | null;
  onDeviceChange: (device: DeviceType) => void;
  onPreview: () => void;
  onSave: () => void;
  onPublished: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  funnelName,
  isSaving,
  isSlugValid,
  activeDevice,
  funnel,
  onDeviceChange,
  onPreview,
  onSave,
  onPublished,
}) => {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="ml-2" asChild>
          <Link to="/">
            <ChevronLeft className="ml-1 h-4 w-4" />
            חזרה לדשבורד
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">עורך משפך - {funnelName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <DevicePreview 
          activeDevice={activeDevice} 
          onChange={onDeviceChange} 
        />
        
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="ml-2 h-4 w-4" />
          תצוגה מקדימה
        </Button>
        
        {funnel && <PublishFunnelButton funnel={funnel} onPublished={onPublished} />}
        
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isSaving || !isSlugValid}
        >
          {isSaving ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="ml-2 h-4 w-4" />
          )}
          {isSaving ? 'שומר...' : 'שמור שינויים'}
        </Button>
      </div>
    </header>
  );
};

export default EditorHeader;
