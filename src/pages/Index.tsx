
import React from 'react';
import { Upload, FolderOpen, Image, Video, Download, FileText, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUploadZone from '@/components/FileUploadZone';
import FileExplorer from '@/components/FileExplorer';
import { useFileStore } from '@/hooks/useFileStore';

const Index = () => {
  const { files, viewMode, setViewMode } = useFileStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">FileCloud</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Files</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploadZone />
                
                {/* Upload Stats */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Files</span>
                    </div>
                    <span className="font-semibold">{files.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Images</span>
                    </div>
                    <span className="font-semibold">
                      {files.filter(f => f.type.startsWith('image/')).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Videos</span>
                    </div>
                    <span className="font-semibold">
                      {files.filter(f => f.type.startsWith('video/')).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Explorer Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5" />
                  <span>File Explorer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileExplorer />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
