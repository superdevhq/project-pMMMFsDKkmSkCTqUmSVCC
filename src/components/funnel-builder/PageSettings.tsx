
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface PageSettingsProps {
  onClose: () => void;
  onSave: (settings: PageSettings) => void;
  initialSettings: PageSettings;
}

export interface PageSettings {
  metaTitle: string;
  metaDescription: string;
  favicon: string;
  customDomain: string;
  customScripts: string;
  showPoweredBy: boolean;
  customCss: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
}

const PageSettings: React.FC<PageSettingsProps> = ({
  onClose,
  onSave,
  initialSettings
}) => {
  const [settings, setSettings] = useState<PageSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (field: keyof PageSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">הגדרות עמוד</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="general">כללי</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="advanced">מתקדם</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">דומיין מותאם אישית</Label>
                <Input
                  id="customDomain"
                  placeholder="your-domain.com"
                  value={settings.customDomain}
                  onChange={(e) => handleChange('customDomain', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  השתמש בדומיין משלך במקום הדומיין ברירת המחדל שלנו.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">קישור לאייקון (Favicon)</Label>
                <Input
                  id="favicon"
                  placeholder="https://example.com/favicon.ico"
                  value={settings.favicon}
                  onChange={(e) => handleChange('favicon', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="showPoweredBy"
                  checked={settings.showPoweredBy}
                  onCheckedChange={(checked) => handleChange('showPoweredBy', checked)}
                />
                <Label htmlFor="showPoweredBy">הצג "מופעל על ידי" בתחתית העמוד</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">כותרת מטא (Meta Title)</Label>
                <Input
                  id="metaTitle"
                  placeholder="כותרת העמוד"
                  value={settings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  כותרת זו תופיע בתוצאות החיפוש ובכרטיסיות הדפדפן.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">תיאור מטא (Meta Description)</Label>
                <Textarea
                  id="metaDescription"
                  placeholder="תיאור קצר של העמוד"
                  value={settings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  תיאור זה יופיע בתוצאות החיפוש מתחת לכותרת.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">מזהה Google Analytics</Label>
                <Input
                  id="googleAnalyticsId"
                  placeholder="G-XXXXXXXXXX או UA-XXXXXXXX-X"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">מזהה Facebook Pixel</Label>
                <Input
                  id="facebookPixelId"
                  placeholder="XXXXXXXXXXXXXXXXXX"
                  value={settings.facebookPixelId}
                  onChange={(e) => handleChange('facebookPixelId', e.target.value)}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="customCss">CSS מותאם אישית</Label>
                <Textarea
                  id="customCss"
                  placeholder=".my-class { color: red; }"
                  value={settings.customCss}
                  onChange={(e) => handleChange('customCss', e.target.value)}
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customScripts">סקריפטים מותאמים אישית</Label>
                <Textarea
                  id="customScripts"
                  placeholder="<script>console.log('Hello world');</script>"
                  value={settings.customScripts}
                  onChange={(e) => handleChange('customScripts', e.target.value)}
                  rows={5}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  הוסף סקריפטים מותאמים אישית שיוטענו בעמוד. היזהר עם קוד זה.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>ביטול</Button>
          <Button onClick={handleSave}>שמור הגדרות</Button>
        </div>
      </div>
    </div>
  );
};

export default PageSettings;
