'use client';

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-pulse">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-gray-100 text-gray-700">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <Card className="p-3 bg-white border shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            AI is thinking...
          </span>
        </div>
      </Card>
    </div>
  );
}