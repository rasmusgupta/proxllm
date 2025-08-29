'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { Badge } from '@/components/ui/badge';

export function ChatHeader() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { currentConversation, updateConversation, setCurrentConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(currentConversation?.title || '');

  // Sync edit title when conversation changes
  useEffect(() => {
    setEditTitle(currentConversation?.title || '');
    setIsEditing(false); // Close editing when switching conversations
  }, [currentConversation?.id]);

  const handleEdit = () => {
    if (currentConversation) {
      setIsEditing(true);
      setEditTitle(currentConversation.title);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentConversation || !editTitle.trim()) return;

    try {
      const response = await fetch(`/api/conversations/demo/${currentConversation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (response.ok) {
        updateConversation(currentConversation.id, { title: editTitle.trim() });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
      setEditTitle(currentConversation.title);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(currentConversation?.title || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleClose = () => {
    setCurrentConversation(null);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {currentConversation ? (
          <div className="flex flex-col">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-lg font-semibold max-w-[300px]"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveEdit}
                  className="h-8 w-8 p-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-lg font-semibold truncate max-w-[300px]">
                  {currentConversation.title}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleEdit}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {currentConversation.modelProvider}
              </Badge>
              <span>{currentConversation.modelName}</span>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-lg font-semibold">ProxLLM</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {selectedProvider}
              </Badge>
              <span>{defaultModel}</span>
            </div>
          </div>
        )}
      </div>

      {currentConversation && (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </header>
  );
}