
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/fileUtils';

interface FilePreviewModalProps {
  file: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FilePreviewModal = ({ file, open, onOpenChange }: FilePreviewModalProps) => {
  if (!file) return null;

  const handleDownload = () => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.displayName || file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileUrl = React.useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  React.useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const renderPreview = () => {
    if (!fileUrl) return null;

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={fileUrl}
          alt={file.displayName || file.name}
          className="max-w-full max-h-[60vh] object-contain mx-auto"
        />
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <video
          src={fileUrl}
          controls
          className="max-w-full max-h-[60vh] mx-auto"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Preview not available for this file type</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{file.displayName || file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Modified: {formatDate(file.lastModified)}</span>
            <span>Type: {file.type || 'Unknown'}</span>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            {renderPreview()}
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewModal;
