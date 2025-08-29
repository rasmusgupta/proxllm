'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ProjectFile {
  id: string;
  fileName: string;
  fileType: 'kicad_pro' | 'kicad_sch' | 'kicad_pcb' | 'lib' | 'other';
  filePath: string;
  canViewInCanvas: boolean;
}

interface ProxCanvasPanelProps {
  selectedFile: ProjectFile | null;
}

// Mock layer data for demonstration
const mockLayers = [
  { id: 'F.Cu', name: 'Front Copper', visible: true, color: '#ff0000' },
  { id: 'B.Cu', name: 'Back Copper', visible: true, color: '#0000ff' },
  { id: 'F.SilkS', name: 'Front Silkscreen', visible: true, color: '#ffffff' },
  { id: 'B.SilkS', name: 'Back Silkscreen', visible: false, color: '#ffffff' },
  { id: 'Edge.Cuts', name: 'Board Outline', visible: true, color: '#ffff00' }
];

export function ProxCanvasPanel({ selectedFile }: ProxCanvasPanelProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [layers, setLayers] = useState(mockLayers);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 500));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 20));
  };

  const handleResetView = () => {
    setZoomLevel(100);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Select a schematic (.kicad_sch)</p>
          <p className="text-sm">or PCB (.kicad_pcb) file to view</p>
        </div>
      </div>
    );
  }

  const isSchematic = selectedFile.fileType === 'kicad_sch';
  const isPcb = selectedFile.fileType === 'kicad_pcb';

  return (
    <div className="h-full flex flex-col">
      {/* Header with file info and controls */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant={isSchematic ? "default" : "secondary"}>
              {isSchematic ? "Schematic" : "PCB Layout"}
            </Badge>
            <span className="text-sm font-medium">{selectedFile.fileName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2">{Math.round(zoomLevel)}%</span>
            <Button size="sm" variant="ghost" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleResetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Main Canvas Area */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gray-900">
            {/* ProxCanvas placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-lg mb-4 mx-auto flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/20 rounded"></div>
                </div>
                <p className="text-sm">ProxCanvas Integration</p>
                <p className="text-xs opacity-70">
                  {isSchematic ? "Schematic View" : "PCB Layout View"}
                </p>
                <p className="text-xs opacity-50 mt-2">
                  Zoom: {Math.round(zoomLevel)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Panel (only for PCB files) */}
        {isPcb && (
          <div className="w-48 border-l bg-background">
            <div className="p-3 border-b">
              <h3 className="text-sm font-medium">Layers</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-accent"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleLayerVisibility(layer.id)}
                    >
                      {layer.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3 opacity-50" />
                      )}
                    </Button>
                    <div
                      className="w-3 h-3 rounded-sm border"
                      style={{ backgroundColor: layer.visible ? layer.color : '#666' }}
                    />
                    <span className={`text-xs flex-1 ${layer.visible ? '' : 'opacity-50'}`}>
                      {layer.name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}