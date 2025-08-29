'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from '@/types';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
}

export function MessageList({ messages, isGenerating }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div className="flex flex-col space-y-4 py-4 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isGenerating && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}