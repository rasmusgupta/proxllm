'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { ConversationSidebar } from '@/components/sidebar/ConversationSidebar';
import { ChatArea } from './ChatArea';
import { useSettingsStore } from '@/lib/stores/settings-store';

export default function ChatInterface() {
  const { sidebarCollapsed } = useSettingsStore();

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex h-screen w-full">
        <ConversationSidebar />
        <main className="flex-1 flex flex-col">
          <ChatArea />
        </main>
      </div>
    </SidebarProvider>
  );
}