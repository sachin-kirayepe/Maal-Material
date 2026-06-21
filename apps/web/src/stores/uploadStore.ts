import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedUrl: string | null;
  uploadFile: (bucket: string, file: File, path?: string) => Promise<string | null>;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  isUploading: false,
  progress: 0,
  error: null,
  uploadedUrl: null,
  reset: () => set({ isUploading: false, progress: 0, error: null, uploadedUrl: null }),
  uploadFile: async (bucket: string, file: File, path?: string) => {
    set({ isUploading: true, error: null, progress: 0, uploadedUrl: null });
    
    try {
      // Create a unique file path if not provided
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      set({ 
        isUploading: false, 
        progress: 100, 
        uploadedUrl: publicUrl 
      });

      return publicUrl;
    } catch (err: any) {
      set({ 
        isUploading: false, 
        error: err.message || 'Failed to upload file', 
        progress: 0 
      });
      console.error('Upload Error:', err);
      return null;
    }
  },
}));
