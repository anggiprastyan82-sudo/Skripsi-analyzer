import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function FileUploader({ onFileSelect, isLoading }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "bg-white border-2 border-dashed rounded-[32px] p-12 text-center",
        isDragActive ? "border-teal-500 bg-teal-50/50" : "border-slate-200 hover:border-teal-400 hover:bg-slate-50/50",
        isLoading && "opacity-60 cursor-not-allowed pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
          isDragActive ? "bg-teal-500 text-white scale-110 shadow-teal-200" : "bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500"
        )}>
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : (
            <Upload className="w-10 h-10" />
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {isDragActive ? "Lepaskan file di sini" : "Tarik & Lepas Draft Skripsi"}
          </h3>
          <p className="text-sm text-slate-400 font-medium">
            Format yang didukung: <span className="text-slate-600 font-bold uppercase">PDF</span> atau <span className="text-slate-600 font-bold uppercase">DOCX</span>
          </p>
        </div>

        <div className="pt-2">
          <span className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 group-hover:bg-white group-hover:border-teal-200 group-hover:text-teal-600 transition-all flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Pilih File dari Komputer
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 opacity-10 group-hover:rotate-12 transition-transform">
        <Sparkles className="w-12 h-12 text-slate-900" />
      </div>
    </div>
  );
}
