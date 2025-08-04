"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing-config";
import { Loader2, Upload, X } from "lucide-react";

interface FileUploadProps {
  endpoint: "courseVideo" | "courseResource" | "userAvatar" | "generalResource";
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({
  endpoint,
  onUploadComplete,
  onUploadError,
  className = "",
  maxFiles = 1,
  acceptedTypes = [],
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    const urls = res.map((file: any) => file.url);
    setUploadedFiles(prev => [...prev, ...urls]);
    
    if (onUploadComplete) {
      urls.forEach((url: string) => onUploadComplete(url));
    }
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    console.error("Error en la subida:", error);
    
    if (onUploadError) {
      onUploadError(error);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Archivos subidos ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 truncate">
                    {url.split("/").pop()}
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zona de subida */}
      <UploadDropzone
        endpoint={endpoint}
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        config={{
          mode: "auto",
        }}
        appearance={{
          container: "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors",
          allowedContent: "text-sm text-gray-500 mb-2",
          button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
        }}
      />

      {/* Indicador de carga */}
      {isUploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-blue-600">Subiendo archivo...</span>
        </div>
      )}
    </div>
  );
} 