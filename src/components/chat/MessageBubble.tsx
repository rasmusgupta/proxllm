'use client';

import { formatDistanceToNow } from 'date-fns';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className={cn(
      "flex gap-3 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          "text-xs",
          isUser ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={cn(
        "flex flex-col space-y-1 max-w-[80%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "relative group/message",
          isUser ? "order-1" : ""
        )}>
          <Card className={cn(
            "p-3 shadow-sm",
            isUser 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted border-border"
          )}>
            <div className="prose prose-sm max-w-none">
              <div className={cn(
                "whitespace-pre-wrap text-sm leading-relaxed",
                isUser ? "text-primary-foreground" : "text-foreground"
              )}>
                {message.content}
              </div>
            </div>
          </Card>

          <div className={cn(
            "opacity-0 group-hover/message:opacity-100 transition-opacity absolute top-2",
            isUser ? "left-2" : "right-2"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-6 w-6 bg-background/80 hover:bg-background"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        <div className={cn(
          "text-xs text-muted-foreground px-1",
          isUser ? "text-right" : "text-left"
        )}>
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
          {message.tokensUsed && (
            <span className="ml-2 text-xs opacity-70">
              ({message.tokensUsed} tokens)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}