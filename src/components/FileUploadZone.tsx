import React, { useCallback, useState } from 'react';
import { Upload, File, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileStore } from '@/hooks/useFileStore';
import { toast } from '@/hooks/use-toast';

const FileUploadZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { addFiles } = useFileStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    const processItems = async () => {
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            await processEntry(entry, files, 'uploads');
          }
        }
      }
      
      if (files.length > 0) {
        addFiles(files);
        toast({
          title: "Files uploaded successfully",
          description: `${files.length} file(s) have been uploaded to uploads folder.`,
        });
      }
    };

    processItems();
  }, [addFiles]);

  const processEntry = async (entry: any, files: File[], basePath: string): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          // Create a new file object with the uploads path
          const fileWithPath = new File([file], `${basePath}/${entry.fullPath.slice(1) || file.name}`, {
            type: file.type,
            lastModified: file.lastModified,
          });
          files.push(fileWithPath);
          resolve();
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        dirReader.readEntries(async (entries: any[]) => {
          for (const childEntry of entries) {
            await processEntry(childEntry, files, basePath);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add uploads/ prefix to individual files
      const filesWithPath = files.map(file => 
        new File([file], `uploads/${file.name}`, {
          type: file.type,
          lastModified: file.lastModified,
        })
      );
      addFiles(filesWithPath);
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} file(s) have been uploaded to uploads folder.`,
      });
    }
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Keep the webkitRelativePath for folder uploads, but add uploads prefix
      const filesWithPath = files.map(file => {
        const relativePath = (file as any).webkitRelativePath || file.name;
        return new File([file], `uploads/${relativePath}`, {
          type: file.type,
          lastModified: file.lastModified,
        });
      });
      addFiles(filesWithPath);
      toast({
        title: "Folder uploaded successfully",
        description: `${files.length} file(s) from folder have been uploaded to uploads folder.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Drop files here</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop files or folders to upload them to the uploads folder
        </p>
        <p className="text-sm text-muted-foreground">
          Supports all file types • No size restrictions
        </p>
      </div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="file"
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <File className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>
        
        <div>
          <input
            type="file"
            id="folder-upload"
            {...({ webkitdirectory: "" } as any)}
            multiple
            className="hidden"
            onChange={handleFolderSelect}
          />
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => document.getElementById('folder-upload')?.click()}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Select Folder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadZone;
