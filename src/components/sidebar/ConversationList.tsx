'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Cpu, MoreHorizontal, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useConversationStore } from '@/lib/stores/conversation-store';
import type { Conversation } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
}

function ConversationItem({ conversation, isActive, onClick, isCollapsed = false }: ConversationItemProps) {
  const { deleteConversation, updateConversation } = useConversationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`/api/conversations/demo/${conversation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });

      if (response.ok) {
        // Update the conversation in the store
        updateConversation(conversation.id, { title: editTitle });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
      setEditTitle(conversation.title);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(conversation.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/conversations/demo/${conversation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        deleteConversation(conversation.id);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-accent transition-colors mx-1 w-full max-w-full overflow-hidden",
        isActive && "bg-accent",
        isCollapsed && "justify-center"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1 shrink-0">
        <Cpu className={cn("w-4 h-4 text-muted-foreground", isCollapsed && "w-5 h-5")} />
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0 overflow-hidden flex items-center">
          {isEditing ? (
            <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-6 text-sm px-1 flex-1 min-w-0"
                autoFocus
              />
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={handleSaveEdit}
                >
                  <Check className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={handleCancelEdit}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis" title={conversation.title}>
                {conversation.title}
              </p>
              <p className="text-xs text-muted-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
              </p>
            </div>
          )}
        </div>
      )}

      {!isEditing && !isCollapsed && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

interface ConversationListProps {
  isCollapsed?: boolean;
}

export function ConversationList({ isCollapsed = false }: ConversationListProps) {
  const { conversations, currentConversation, setCurrentConversation, loadConversations } = useConversationStore();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  if (conversations.length === 0) {
    if (isCollapsed) {
      return null; // Hide empty state when collapsed
    }
    
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <Cpu className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No projects yet</p>
        <p className="text-xs mt-1">Start a new project to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 py-2 w-full overflow-hidden">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={currentConversation?.id === conversation.id}
          onClick={() => setCurrentConversation(conversation)}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
}