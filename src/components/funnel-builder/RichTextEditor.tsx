
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
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
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  className,
  placeholder = 'הקלד כאן...',
  onBlur,
  autoFocus = false,
}) => {
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showLinkPopover, setShowLinkPopover] = React.useState(false);

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

  return (
    <div className={cn('rich-text-editor-container', className)} dir="rtl">
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
      </div>
      
      <EditorContent 
        editor={editor} 
        className={cn(
          'border rounded-md p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary min-h-[100px]',
          className
        )}
      />
    </div>
  );
};

const Separator = ({ className }: { className?: string }) => (
  <div className={cn('bg-border w-px', className)} />
);

export default RichTextEditor;
