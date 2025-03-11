
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textColor?: string;
  onBlur?: () => void;
  autoFocus?: boolean;
}

const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onChange,
  className,
  placeholder = 'הקלד כאן...',
  multiline = false,
  fontSize = 'base',
  fontWeight = 'normal',
  textColor,
  onBlur,
  autoFocus = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const editorRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      
      // Place cursor at the end
      if ('selectionStart' in editorRef.current) {
        editorRef.current.selectionStart = editorRef.current.value.length;
        editorRef.current.selectionEnd = editorRef.current.value.length;
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (autoFocus) {
      setIsEditing(true);
    }
  }, [autoFocus]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(localValue);
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange(localValue);
      onBlur?.();
    }
    
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(value); // Reset to original value
      onBlur?.();
    }
  };

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  };

  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const displayStyles = {
    color: textColor,
  };

  if (isEditing) {
    const EditorComponent = multiline ? 'textarea' : 'input';
    
    return (
      <EditorComponent
        ref={editorRef as any}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full bg-transparent outline-none border-0 focus:ring-2 focus:ring-primary/20 rounded p-1 -m-1',
          fontSizeClasses[fontSize],
          fontWeightClasses[fontWeight],
          multiline ? 'resize-none min-h-[100px]' : 'h-auto',
          className
        )}
        style={displayStyles}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'cursor-text min-h-[1em] inline-block w-full',
        fontSizeClasses[fontSize],
        fontWeightClasses[fontWeight],
        'hover:bg-primary/5 rounded p-1 -m-1 transition-colors',
        className
      )}
      style={displayStyles}
    >
      {localValue || <span className="opacity-50">{placeholder}</span>}
    </div>
  );
};

export default InlineEditor;
