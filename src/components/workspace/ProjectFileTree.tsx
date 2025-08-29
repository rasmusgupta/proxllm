'use client';

import { FileText, Cpu, Settings, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectFile {
  id: string;
  fileName: string;
  fileType: 'kicad_pro' | 'kicad_sch' | 'kicad_pcb' | 'lib' | 'other';
  filePath: string;
  canViewInCanvas: boolean;
}

interface ProjectFileTreeProps {
  files: ProjectFile[];
  onFileSelect: (file: ProjectFile) => void;
}

const getFileIcon = (fileType: ProjectFile['fileType']) => {
  switch (fileType) {
    case 'kicad_sch':
      return Cpu;
    case 'kicad_pcb':
      return Cpu;
    case 'kicad_pro':
      return Settings;
    case 'lib':
      return Book;
    default:
      return FileText;
  }
};

const getFileTypeLabel = (fileType: ProjectFile['fileType']) => {
  switch (fileType) {
    case 'kicad_sch':
      return 'Schematic';
    case 'kicad_pcb':
      return 'PCB Layout';
    case 'kicad_pro':
      return 'Project';
    case 'lib':
      return 'Library';
    default:
      return 'File';
  }
};

export function ProjectFileTree({ files, onFileSelect }: ProjectFileTreeProps) {
  return (
    <div className="space-y-1">
      {files.map((file) => {
        const Icon = getFileIcon(file.fileType);
        const typeLabel = getFileTypeLabel(file.fileType);
        
        return (
          <Button
            key={file.id}
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto p-2 text-left",
              file.canViewInCanvas && "hover:bg-primary/10"
            )}
            onClick={() => onFileSelect(file)}
            disabled={!file.canViewInCanvas}
          >
            <div className="flex items-center gap-2 w-full">
              <Icon className={cn(
                "w-4 h-4 flex-shrink-0",
                file.canViewInCanvas ? "text-primary" : "text-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-xs font-medium truncate",
                  file.canViewInCanvas ? "text-foreground" : "text-muted-foreground"
                )}>
                  {file.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {typeLabel}
                </p>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}