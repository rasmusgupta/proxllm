'use client';

import { useState, useRef } from 'react';
import { X, Upload, FolderPlus, MoreHorizontal, Star, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProjectFileTree } from './ProjectFileTree';

interface WorkspaceProject {
  id: string;
  name: string;
  files: ProjectFile[];
  createdAt: Date;
  isFavorite?: boolean;
}

interface ProjectFile {
  id: string;
  fileName: string;
  fileType: 'kicad_pro' | 'kicad_sch' | 'kicad_pcb' | 'lib' | 'other';
  filePath: string;
  canViewInCanvas: boolean;
}

interface WorkspaceViewerProps {
  isOpen: boolean;
  onClose: () => void;
}


export function WorkspaceViewer({ isOpen, onClose }: WorkspaceViewerProps) {
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: ProjectFile) => {
    if (file.canViewInCanvas) {
      console.log('File selected:', file.fileName);
      // TODO: Open ProxCanvas in separate window/panel
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      
      // Group files by project (assuming files with same base name belong to same project)
      const fileGroups: { [key: string]: File[] } = {};
      
      Array.from(files).forEach(file => {
        const baseName = file.name.split('.').slice(0, -1).join('.');
        if (!fileGroups[baseName]) {
          fileGroups[baseName] = [];
        }
        fileGroups[baseName].push(file);
      });

      // Create projects from file groups
      for (const [projectName, projectFiles] of Object.entries(fileGroups)) {
        const projectId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        
        const newProject: WorkspaceProject = {
          id: projectId,
          name: projectName,
          createdAt: new Date(),
          isFavorite: false,
          files: projectFiles.map((file, index) => {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            let fileType: ProjectFile['fileType'] = 'other';
            let canViewInCanvas = false;

            if (fileExtension === 'kicad_pro' || file.name.endsWith('.pro')) {
              fileType = 'kicad_pro';
            } else if (fileExtension === 'kicad_sch' || file.name.endsWith('.sch')) {
              fileType = 'kicad_sch';
              canViewInCanvas = true;
            } else if (fileExtension === 'kicad_pcb' || file.name.endsWith('.kicad_pcb')) {
              fileType = 'kicad_pcb';
              canViewInCanvas = true;
            } else if (file.name.includes('.lib') || file.name.includes('library')) {
              fileType = 'lib';
            }

            return {
              id: `${projectId}-${index}`,
              fileName: file.name,
              fileType,
              filePath: URL.createObjectURL(file), // Create blob URL for local files
              canViewInCanvas
            };
          })
        };

        setProjects(prev => [...prev, newProject]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleToggleFavorite = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isFavorite: !project.isFavorite }
        : project
    ));
  };

  const handleDownloadProject = (project: WorkspaceProject) => {
    // Create a zip-like download for all project files
    project.files.forEach((file, index) => {
      const link = document.createElement('a');
      link.href = file.filePath;
      link.download = file.fileName;
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
      }, index * 100); // Stagger downloads
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => {
      const projectToDelete = prev.find(p => p.id === projectId);
      if (projectToDelete) {
        // Revoke blob URLs to free memory
        projectToDelete.files.forEach(file => {
          if (file.filePath.startsWith('blob:')) {
            URL.revokeObjectURL(file.filePath);
          }
        });
      }
      return prev.filter(project => project.id !== projectId);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold">Workspace</DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".kicad_pro,.kicad_sch,.kicad_pcb,.pro,.sch,.lib"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </Button>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-2">No projects yet</p>
                    <p className="text-xs text-muted-foreground">
                      Upload KiCAD files to get started
                    </p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {project.isFavorite && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                          <h3 className="font-medium text-sm">{project.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {project.createdAt.toLocaleDateString()}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleToggleFavorite(project.id)}>
                                <Star className={`w-4 h-4 mr-2 ${
                                  project.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''
                                }`} />
                                {project.isFavorite ? 'Unfavorite' : 'Favorite'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadProject(project)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <ProjectFileTree 
                        files={project.files} 
                        onFileSelect={handleFileSelect}
                      />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}