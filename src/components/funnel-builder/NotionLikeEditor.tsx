
import React, { useEffect, useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';

interface NotionLikeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
  onAddElement?: (type: string) => void;
}

const NotionLikeEditor: React.FC<NotionLikeEditorProps> = ({
  value,
  onChange,
  className,
  placeholder = 'הקלד / להוספת תוכן...',
  onBlur,
  autoFocus = false,
  onAddElement,
}) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [showSlashCommands, setShowSlashCommands] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'right',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    autofocus: autoFocus,
    onBlur: ({ editor }) => {
      onBlur?.();
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      
      // Check for slash command
      const { state } = editor;
      const { selection } = state;
      const { empty, anchor } = selection;
      
      if (empty) {
        const { nodeBefore } = selection.$anchor;
        
        if (nodeBefore && nodeBefore.text === '/') {
          setShowSlashCommands(true);
        } else {
          setShowSlashCommands(false);
        }
      }
    },
    onKeyDown: ({ event }) => {
      if (event.key === 'Escape' && showSlashCommands) {
        setShowSlashCommands(false);
        return true;
      }
      return false;
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkPopover(false);
    }
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  const handleSlashCommand = (type: string) => {
    // Remove the slash character
    editor.commands.deleteRange({
      from: editor.state.selection.from - 1,
      to: editor.state.selection.from,
    });
    
    setShowSlashCommands(false);
    
    // Handle different command types
    switch (type) {
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'numbered':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'header':
      case 'text':
      case 'cta':
      case 'image':
      case 'video':
      case 'form':
        // Add a new element to the funnel
        if (onAddElement) {
          onAddElement(type);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className={cn('notion-like-editor-container relative', className)} dir="rtl">
      <div className="rich-text-toolbar flex items-center gap-1 mb-2 p-1 bg-muted rounded-md flex-wrap">
        <ToggleGroup type="multiple" className="flex-wrap">
          <ToggleGroupItem 
            value="bold" 
            aria-label="Bold" 
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
            className={editor.isActive('bold') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="italic" 
            aria-label="Italic" 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
            className={editor.isActive('italic') ? 'bg-primary text-primary-foreground' : ''}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="underline" 
            aria-label="Underline" 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-active={editor.isActive('underline')}
            className={editor.isActive('underline') ? 'bg-primary text-primary-foreground' : ''}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator className="mx-1 h-6" />
        
        <ToggleGroup type="single" value={
          editor.isActive({ textAlign: 'left' }) 
            ? 'left' 
            : editor.isActive({ textAlign: 'center' }) 
              ? 'center' 
              : 'right'
        }>
          <ToggleGroupItem 
            value="right" 
            aria-label="Align Right" 
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            data-active={editor.isActive({ textAlign: 'right' })}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="center" 
            aria-label="Align Center" 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            data-active={editor.isActive({ textAlign: 'center' })}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="left" 
            aria-label="Align Left" 
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            data-active={editor.isActive({ textAlign: 'left' })}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator className="mx-1 h-6" />
        
        <ToggleGroup type="single" value={
          editor.isActive('heading', { level: 1 }) 
            ? 'h1' 
            : editor.isActive('heading', { level: 2 }) 
              ? 'h2' 
              : ''
        }>
          <ToggleGroupItem 
            value="h1" 
            aria-label="Heading 1" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            data-active={editor.isActive('heading', { level: 1 })}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <Heading1 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="h2" 
            aria-label="Heading 2" 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            data-active={editor.isActive('heading', { level: 2 })}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : ''}
          >
            <Heading2 className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator className="mx-1 h-6" />
        
        <ToggleGroup type="single" value={
          editor.isActive('bulletList') 
            ? 'ul' 
            : editor.isActive('orderedList') 
              ? 'ol' 
              : ''
        }>
          <ToggleGroupItem 
            value="ul" 
            aria-label="Bullet List" 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive('bulletList')}
            className={editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : ''}
          >
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="ol" 
            aria-label="Numbered List" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-active={editor.isActive('orderedList')}
            className={editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        
        <Separator className="mx-1 h-6" />
        
        <Popover open={showLinkPopover} onOpenChange={setShowLinkPopover}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8",
                editor.isActive('link') ? 'bg-primary text-primary-foreground' : ''
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <label htmlFor="link-url" className="text-sm font-medium">
                URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <Button onClick={setLink}>הוסף</Button>
              </div>
              {editor.isActive('link') && (
                <Button variant="outline" onClick={removeLink} className="mt-2">
                  הסר קישור
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid gap-2">
              <h4 className="font-medium mb-1">הוסף אלמנט</h4>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('header')}
              >
                <Heading1 className="ml-2 h-4 w-4" />
                כותרת ראשית
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('text')}
              >
                <Italic className="ml-2 h-4 w-4" />
                טקסט
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('cta')}
              >
                <MousePointerClick className="ml-2 h-4 w-4" />
                כפתור קריאה לפעולה
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('image')}
              >
                <Image className="ml-2 h-4 w-4" />
                תמונה
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('video')}
              >
                <Video className="ml-2 h-4 w-4" />
                וידאו
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => onAddElement?.('form')}
              >
                <FormInput className="ml-2 h-4 w-4" />
                טופס
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <EditorContent 
        editor={editor} 
        className={cn(
          'border rounded-md p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary min-h-[100px] prose prose-sm max-w-none',
          className
        )}
      />
      
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }}
          className="bg-white shadow-md border rounded-md p-1 flex gap-1"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-active={editor.isActive('underline')}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Separator className="mx-1 h-6" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <Heading1 className="h-4 w-4 ml-1" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start w-full"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                  <Heading1 className="ml-2 h-4 w-4" />
                  כותרת 1
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start w-full"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                  <Heading2 className="ml-2 h-4 w-4" />
                  כותרת 2
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </BubbleMenu>
      )}
      
      {showSlashCommands && (
        <div className="absolute z-10 bg-white shadow-md border rounded-md w-64 mt-1">
          <Command>
            <CommandInput placeholder="חפש פקודה..." />
            <CommandList>
              <CommandGroup heading="עיצוב טקסט">
                <CommandItem onSelect={() => handleSlashCommand('h1')}>
                  <Heading1 className="ml-2 h-4 w-4" />
                  <span>כותרת 1</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('h2')}>
                  <Heading2 className="ml-2 h-4 w-4" />
                  <span>כותרת 2</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('bullet')}>
                  <List className="ml-2 h-4 w-4" />
                  <span>רשימה עם תבליטים</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('numbered')}>
                  <ListOrdered className="ml-2 h-4 w-4" />
                  <span>רשימה ממוספרת</span>
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="הוסף אלמנט">
                <CommandItem onSelect={() => handleSlashCommand('header')}>
                  <Heading1 className="ml-2 h-4 w-4" />
                  <span>כותרת ראשית</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('text')}>
                  <Italic className="ml-2 h-4 w-4" />
                  <span>טקסט</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('cta')}>
                  <MousePointerClick className="ml-2 h-4 w-4" />
                  <span>כפתור קריאה לפעולה</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('image')}>
                  <Image className="ml-2 h-4 w-4" />
                  <span>תמונה</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('video')}>
                  <Video className="ml-2 h-4 w-4" />
                  <span>וידאו</span>
                </CommandItem>
                <CommandItem onSelect={() => handleSlashCommand('form')}>
                  <FormInput className="ml-2 h-4 w-4" />
                  <span>טופס</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={cn('bg-border w-px', className)} />
);

export default NotionLikeEditor;
