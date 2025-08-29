'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  isGenerating: boolean;
  onSendMessage: (message: string) => void;
  onStopGenerating?: () => void;
}

export function MessageInput({ 
  isGenerating, 
  onSendMessage, 
  onStopGenerating 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage || isGenerating) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-3 border rounded-lg bg-background shadow-sm">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isGenerating ? "AI is responding..." : "Type your message..."}
          disabled={isGenerating}
          className={cn(
            "min-h-[44px] max-h-[200px] resize-none border-0 shadow-none focus-visible:ring-0 pr-12",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          )}
          rows={1}
        />
        
        <div className="flex items-center gap-1 shrink-0">
          {isGenerating ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onStopGenerating}
              className="h-9 w-9 text-gray-500 hover:text-gray-700"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isGenerating}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <div className="flex items-center gap-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
        <div className="text-right">
          {message.length}/4000
        </div>
      </div>
    </form>
  );
}