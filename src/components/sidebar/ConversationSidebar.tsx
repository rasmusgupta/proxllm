'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Folder, Settings, User, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConversationList } from './ConversationList';
import { UserProfile } from './UserProfile';
import { ModelSelector } from './ModelSelector';
import { WorkspaceViewer } from '../workspace/WorkspaceViewer';
import { useConversationStore } from '@/lib/stores/conversation-store';
import { useSettingsStore } from '@/lib/stores/settings-store';

export function ConversationSidebar() {
  const router = useRouter();
  const { createConversation } = useConversationStore();
  const { selectedProvider, defaultModel } = useSettingsStore();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px (w-80)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleNewProject = () => {
    createConversation({
      userId: 'demo-user',
      title: 'New Project',
      modelProvider: selectedProvider,
      modelName: defaultModel,
    });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = Math.max(280, Math.min(600, e.clientX)); // Min 280px, Max 600px
      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div 
        ref={sidebarRef}
        className={`relative h-full bg-background border-r flex flex-col ${isCollapsed ? 'w-16' : ''}`}
        style={{
          width: isCollapsed ? '64px' : `${sidebarWidth}px`,
          transition: isResizing ? 'none' : 'width 300ms ease-in-out'
        }}
      >
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

        {/* New Project and Workspace Buttons */}
        <div className="p-3 space-y-2">
          <Button
            onClick={handleNewProject}
            className="w-full justify-start h-10"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">New Project</span>}
          </Button>
          
          <Button
            onClick={() => setShowWorkspace(true)}
            className="w-full justify-start h-10"
            variant="outline"
          >
            <Folder className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Workspace</span>}
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
        
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 right-0 w-1 h-8 bg-border group-hover:bg-primary/40 rounded-l transform -translate-y-1/2 transition-colors" />
          </div>
        )}
      </div>

      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
      
      <WorkspaceViewer
        isOpen={showWorkspace}
        onClose={() => setShowWorkspace(false)}
      />
    </>
  );
}