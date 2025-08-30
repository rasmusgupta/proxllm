'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PanelRightClose, PanelRightOpen, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProxCanvas } from './ProxCanvas';

export function ResizableCanvasPanel() {
  const [isCollapsed, setIsCollapsed] = useState(true); // Always start collapsed
  const [panelWidth, setPanelWidth] = useState(1200); // Default 1200px (double the original 600px)
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      
      const containerWidth = window.innerWidth;
      const sidebarWidth = 320; // Approximate sidebar width
      const maxWidth = Math.floor((containerWidth - sidebarWidth) * 0.6); // Max 60% of remaining space
      const minWidth = 400; // Min 400px
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, containerWidth - e.clientX));
      setPanelWidth(newWidth);
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
    <div 
      ref={panelRef}
      className={`relative h-full border-l flex flex-col ${isCollapsed ? 'w-16' : ''}`}
      style={{
        backgroundColor: '#181818', // Darker than main background
        width: isCollapsed ? '64px' : `${panelWidth}px`,
        transition: isResizing ? 'none' : 'width 300ms ease-in-out'
      }}
    >
      {/* Header with PCB View title and Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: '#181818' }}>
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 shrink-0"
        >
          {isCollapsed ? (
            <PanelRightOpen className="w-4 h-4" />
          ) : (
            <PanelRightClose className="w-4 h-4" />
          )}
        </Button>
        
        <h2 className={`font-semibold text-foreground ${isCollapsed ? 'hidden' : ''}`}>
          PCB View
        </h2>
        
        <Button
          className={`bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 h-10 ${isCollapsed ? 'hidden' : ''}`}
          size="default"
        >
          Order
        </Button>
      </div>

      {/* Canvas Content */}
      <div className={`flex-1 ${isCollapsed ? 'hidden' : 'flex flex-col'}`}>
        <ProxCanvas />
      </div>

      {/* Collapsed state content */}
      {isCollapsed && (
        <div className="flex-1 flex items-center justify-center p-3">
          <div className="transform -rotate-90 whitespace-nowrap">
            <Button
              onClick={() => setIsCollapsed(false)}
              variant="ghost"
              className="flex items-center justify-center px-3 py-2 h-auto"
            >
              <Cpu className="w-4 h-4 mr-2" />
              <span className="font-semibold">PCB View</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Resize Handle - positioned on the left edge */}
      {!isCollapsed && (
        <div
          className="absolute top-0 left-0 w-2 h-full cursor-col-resize hover:bg-primary/20 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-0 w-1 h-8 bg-border group-hover:bg-primary/40 rounded-r transform -translate-y-1/2 transition-colors" />
        </div>
      )}
    </div>
  );
}