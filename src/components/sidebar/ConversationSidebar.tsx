'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Settings, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationList } from './ConversationList';
import { UserProfile } from './UserProfile';
import { ModelSelector } from './ModelSelector';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';

export function ConversationSidebar() {
  const router = useRouter();
  const { createConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewProject = () => {
    createConversation({
      userId: 'demo-user',
      title: 'New Project',
      modelProvider: selectedProvider,
      modelName: defaultModel,
    });
  };

  return (
    <>
      <div className={`relative h-full bg-background border-r transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Header with Logo and Collapse Toggle */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => router.push('/')}
                className="hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/logo.png" 
                  alt="ProxGrid Logo" 
                  width={isCollapsed ? 80 : 160} 
                  height={isCollapsed ? 80 : 160}
                  className="rounded"
                />
              </button>
            </div>
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* New Project Button */}
        <div className="p-3">
          <Button
            onClick={handleNewProject}
            className="w-full justify-start h-10"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">New Project</span>}
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full px-2">
            <ConversationList isCollapsed={isCollapsed} />
          </ScrollArea>
        </div>

        {/* Footer with User Profile and Settings - Always at bottom */}
        <div className="mt-auto p-3 border-t space-y-1 bg-background">
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="w-full justify-start h-10"
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Settings</span>}
          </Button>

          <Button
            onClick={() => setShowUserProfile(true)}
            variant="ghost" 
            className="w-full justify-start h-10"
          >
            <User className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Demo User</span>}
          </Button>
          
          <Button
            onClick={() => console.log('Sign out clicked')}
            variant="ghost"
            className="w-full justify-start h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </div>

      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
}