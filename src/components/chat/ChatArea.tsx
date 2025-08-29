'use client';

import { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { EmptyState } from './EmptyState';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { Message } from '@/types';

export function ChatArea() {
  const { currentConversation, currentMessages, addMessage, createConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // Create conversation if none exists
      let conversation = currentConversation;
      if (!conversation) {
        await createConversation({
          userId: 'demo-user',
          title: messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : ''),
          modelProvider: selectedProvider,
          modelName: defaultModel,
        });
        // Get the newly created conversation from the store
        conversation = useConversationStore.getState().currentConversation;
      }

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        conversationId: conversation?.id || 'temp',
        role: 'user',
        content: messageContent,
        createdAt: new Date(),
      };
      
      addMessage(userMessage);

      // Save user message to demo API
      try {
        await fetch('/api/messages/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversation?.id || `temp-${Date.now()}`,
            role: 'user',
            content: messageContent,
          }),
        });
      } catch (error) {
        console.log('Failed to save user message:', error);
      }

      // Use the simplified chat API for demo mode
      const response = await fetch('/api/llm/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...currentMessages.map(msg => ({ 
              role: msg.role, 
              content: msg.content 
            })),
            { role: 'user', content: messageContent }
          ],
          model: defaultModel,
          provider: selectedProvider,
          temperature: 0.7,
          maxTokens: 2048,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        conversationId: conversation?.id || 'temp',
        role: 'assistant',
        content: data.content,
        tokensUsed: data.tokensUsed,
        createdAt: new Date(),
      };
      
      addMessage(aiMessage);

      // Save AI message to demo API
      try {
        await fetch('/api/messages/demo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversation?.id || `temp-${Date.now()}`,
            role: 'assistant',
            content: data.content,
            tokensUsed: data.tokensUsed,
          }),
        });
      } catch (error) {
        console.log('Failed to save AI message:', error);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      
      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        conversationId: currentConversation?.id || 'temp',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure you have configured your API keys in Settings.`,
        createdAt: new Date(),
      };
      
      addMessage(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader />
      
      <div className="flex-1 flex flex-col min-h-0">
        {currentConversation ? (
          <>
            <ScrollArea className="flex-1 px-4">
              <MessageList 
                messages={currentMessages} 
                isGenerating={isGenerating}
              />
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <MessageInput 
                isGenerating={isGenerating}
                onSendMessage={handleSendMessage}
                onStopGenerating={() => setIsGenerating(false)}
              />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}