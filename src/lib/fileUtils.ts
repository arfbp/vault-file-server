
import { File, Image, Video, Archive, FileText } from 'lucide-react';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return Image;
  } else if (mimeType.startsWith('video/')) {
    return Video;
  } else if (mimeType.includes('zip') || mimeType.includes('archive') || mimeType.includes('tar') || mimeType.includes('rar')) {
    return Archive;
  } else if (mimeType.includes('text') || mimeType.includes('document')) {
    return FileText;
  }
  
  return File;
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

export const isPreviewableFile = (mimeType: string): boolean => {
  return isImageFile(mimeType) || isVideoFile(mimeType);
};
