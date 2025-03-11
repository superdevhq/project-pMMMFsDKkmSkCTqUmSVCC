
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Globe, Eye } from 'lucide-react';
import { funnelService } from '@/services/funnelService';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Funnel } from '@/types/funnel';

interface PublishFunnelButtonProps {
  funnel: Funnel;
  onPublished?: (updatedFunnel: Funnel) => void;
}

const PublishFunnelButton = ({ funnel, onPublished }: PublishFunnelButtonProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const deployment = await funnelService.deployFunnel(funnel.id);
      
      if (deployment) {
        // Get the updated funnel
        const updatedFunnel = await funnelService.getFunnelById(funnel.id);
        if (updatedFunnel && onPublished) {
          onPublished(updatedFunnel);
        }
        
        setShowDialog(true);
      }
    } catch (error) {
      console.error('Error publishing funnel:', error);
      toast({
        title: 'שגיאה בפרסום המשפך',
        description: 'אירעה שגיאה בפרסום המשפך, נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const getPublicUrl = () => {
    return `${window.location.origin}/funnel/view/${funnel.slug}`;
  };

  const handleViewPublished = () => {
    window.open(getPublicUrl(), '_blank');
  };

  return (
    <>
      {funnel.is_published ? (
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={handleViewPublished}
        >
          <Eye className="h-4 w-4" />
          צפה במשפך המפורסם
        </Button>
      ) : (
        <Button 
          variant="default" 
          className="gap-2" 
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              מפרסם...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              פרסם משפך
            </>
          )}
        </Button>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>המשפך פורסם בהצלחה!</DialogTitle>
            <DialogDescription>
              המשפך שלך זמין כעת בכתובת הבאה:
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <code className="text-sm">{getPublicUrl()}</code>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(getPublicUrl());
                toast({
                  title: 'הקישור הועתק',
                  description: 'הקישור למשפך הועתק ללוח',
                });
              }}
            >
              העתק
            </Button>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              סגור
            </Button>
            <Button onClick={handleViewPublished}>
              צפה במשפך
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishFunnelButton;
