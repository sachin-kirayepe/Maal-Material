"use client";

import React, { useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUploadStore } from "@/stores/uploadStore";

interface FileUploadProps {
  bucketName?: string;
  onUploadSuccess?: (url: string) => void;
  label?: string;
}

export function FileUpload({ bucketName = "constructos-public", onUploadSuccess, label = "Upload Document" }: FileUploadProps) {
  const { isUploading, progress, error, uploadedUrl, uploadFile, reset } = useUploadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous state
    reset();

    const url = await uploadFile(bucketName, file, "uploads");
    if (url && onUploadSuccess) {
      onUploadSuccess(url);
    }
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isUploading ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-700 hover:border-purple-500 hover:bg-zinc-900/50'}
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
          ${uploadedUrl ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,application/pdf"
        />

        {isUploading ? (
          <div className="flex flex-col items-center text-zinc-400">
            <Loader2 className="animate-spin mb-3 text-purple-500" size={32} />
            <p className="text-sm font-medium">Uploading... {progress}%</p>
          </div>
        ) : uploadedUrl ? (
          <div className="flex flex-col items-center text-emerald-500">
            <CheckCircle2 size={32} className="mb-3" />
            <p className="text-sm font-medium">Upload Complete</p>
            <p className="text-xs text-zinc-500 mt-2 truncate max-w-xs">{uploadedUrl}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-red-400">
            <AlertCircle size={32} className="mb-3" />
            <p className="text-sm font-medium">Upload Failed</p>
            <p className="text-xs text-red-500/70 mt-1">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
            <UploadCloud size={32} className="mb-3 text-zinc-500" />
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-zinc-500 mt-1">Click to browse or drag and drop</p>
            <p className="text-[10px] text-zinc-600 mt-2">Max file size: 5MB (Images, PDF)</p>
          </div>
        )}
      </div>
    </div>
  );
}
