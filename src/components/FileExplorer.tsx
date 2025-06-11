import React, { useState } from 'react';
import { 
  File, 
  FolderOpen, 
  Image, 
  Video, 
  Download, 
  Eye,
  FileText,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFileStore } from '@/hooks/useFileStore';
import FilePreviewModal from '@/components/FilePreviewModal';
import { formatFileSize, formatDate, getFileIcon } from '@/lib/fileUtils';

const FileExplorer = () => {
  const { files, viewMode, currentFolder, setCurrentFolder } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Organize files by folders
  const organizedFiles = React.useMemo(() => {
    const folders: { [key: string]: any[] } = {};
    const rootFiles: any[] = [];

    files.forEach(file => {
      // Add safety check for file.name
      if (!file.name) {
        console.warn('File without name detected:', file);
        return;
      }
      
      const pathParts = file.name.split('/');
      if (pathParts.length > 1) {
        const folderName = pathParts[0];
        if (!folders[folderName]) {
          folders[folderName] = [];
        }
        folders[folderName].push({
          ...file,
          displayName: pathParts.slice(1).join('/'),
          fullPath: file.name
        });
      } else {
        rootFiles.push({
          ...file,
          displayName: file.name,
          fullPath: file.name
        });
      }
    });

    return { folders, rootFiles };
  }, [files]);

  const currentFiles = currentFolder 
    ? organizedFiles.folders[currentFolder] || []
    : organizedFiles.rootFiles;

  const handlePreview = (file: any) => {
    setSelectedFile(file);
    setPreviewModalOpen(true);
  };

  const handleDownload = (file: any) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.displayName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canPreview = (file: any) => {
    return file.type && (file.type.startsWith('image/') || file.type.startsWith('video/'));
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
        <p className="text-muted-foreground">
          Upload some files to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFolder(null)}
          className={!currentFolder ? 'text-primary' : ''}
        >
          Root
        </Button>
        {currentFolder && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-medium">{currentFolder}</span>
          </>
        )}
      </div>

      {/* Folders (only show in root) */}
      {!currentFolder && Object.keys(organizedFiles.folders).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Folders</h4>
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {Object.entries(organizedFiles.folders).map(([folderName, folderFiles]) => (
              <div
                key={folderName}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setCurrentFolder(folderName)}
              >
                <FolderOpen className="h-8 w-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{folderName}</p>
                  <p className="text-sm text-muted-foreground">
                    {folderFiles.length} item{folderFiles.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Files</h4>
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {currentFiles.map((file, index) => {
              const IconComponent = getFileIcon(file.type || '');
              return (
                <div
                  key={`${file.fullPath}-${index}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate mb-1">{file.displayName}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(file.size)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(file.lastModified)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{file.type || 'Unknown'}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {canPreview(file) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreview(file)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <FilePreviewModal
        file={selectedFile}
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
      />
    </div>
  );
};

export default FileExplorer;
