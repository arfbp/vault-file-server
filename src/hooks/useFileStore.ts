
import { create } from 'zustand';

interface FileItem extends File {
  id?: string;
  uploadPath?: string;
}

interface FileStore {
  files: FileItem[];
  viewMode: 'grid' | 'list';
  currentFolder: string | null;
  addFiles: (newFiles: FileItem[]) => void;
  removeFile: (fileId: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setCurrentFolder: (folder: string | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  files: [],
  viewMode: 'grid',
  currentFolder: null,
  
  addFiles: (newFiles: FileItem[]) => {
    const filesWithId = newFiles.map(file => ({
      ...file,
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
    }));
    
    set((state) => ({
      files: [...state.files, ...filesWithId],
    }));
  },
  
  removeFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter(file => file.id !== fileId),
    }));
  },
  
  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },
  
  setCurrentFolder: (folder: string | null) => {
    set({ currentFolder: folder });
  },
}));
