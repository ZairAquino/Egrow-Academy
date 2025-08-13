"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Video, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

interface FileUploaderProps {
  type: 'image' | 'video' | 'document';
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
  currentUrl?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // en MB
  preview?: boolean;
}

export default function FileUploader({
  type,
  onUpload,
  onError,
  currentUrl,
  className = "",
  accept,
  maxSize = 5,
  preview = true
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Configuración por tipo de archivo
  const config = {
    image: {
      accept: accept || "image/jpeg,image/png,image/webp,image/gif",
      icon: ImageIcon,
      placeholder: "Arrastra una imagen aquí o haz clic para seleccionar",
      supportedFormats: "JPG, PNG, WebP, GIF"
    },
    video: {
      accept: accept || "video/mp4,video/webm,video/ogg",
      icon: Video,
      placeholder: "Arrastra un video aquí o haz clic para seleccionar",
      supportedFormats: "MP4, WebM, OGG"
    },
    document: {
      accept: accept || "application/pdf,.doc,.docx,.txt",
      icon: FileText,
      placeholder: "Arrastra un documento aquí o haz clic para seleccionar",
      supportedFormats: "PDF, DOC, DOCX, TXT"
    }
  };

  const currentConfig = config[type];

  // Simular subida de archivo (en producción usar UploadThing o similar)
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Simular tiempo de subida
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // En producción, aquí iría la lógica real de subida
      // Por ahora, generar URL temporal para desarrollo
      const mockUrl = URL.createObjectURL(file);
      
      // Simular un poco más de tiempo para mostrar el progreso completo
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUpload(mockUrl);
      }, 200);

      return mockUrl;
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      const errorMessage = err instanceof Error ? err.message : 'Error al subir archivo';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    }
  }, [onUpload, onError]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      const error = `El archivo excede el tamaño máximo de ${maxSize}MB`;
      setError(error);
      onError?.(error);
      return;
    }

    try {
      await uploadFile(file);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  }, [uploadFile, maxSize, onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { [currentConfig.accept]: [] },
    maxFiles: 1,
    disabled: isUploading
  });

  const removeFile = () => {
    onUpload('');
    setError(null);
  };

  const IconComponent = currentConfig.icon;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Archivo actual/preview */}
      {currentUrl && !isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Archivo actual:</span>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-red-100 rounded text-red-600 hover:text-red-700"
              title="Eliminar archivo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Preview para imágenes */}
          {type === 'image' && preview && (
            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={currentUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {/* Preview para videos */}
          {type === 'video' && preview && (
            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
              <video
                src={currentUrl}
                className="w-full h-full object-cover"
                controls
              />
            </div>
          )}
          
          {/* Info para documentos */}
          {type === 'document' && (
            <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm text-gray-700 truncate">
                {currentUrl.split('/').pop()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Zona de subida */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-400 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-400 bg-red-50' : ''}
          ${!isDragActive && !isDragReject ? 'border-gray-300 hover:border-gray-400' : ''}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <div className="space-y-2">
              <p className="text-sm text-blue-600">Subiendo archivo...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <IconComponent className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {isDragActive ? 'Suelta el archivo aquí...' : currentConfig.placeholder}
              </p>
              <p className="text-xs text-gray-500">
                Formatos soportados: {currentConfig.supportedFormats}
              </p>
              <p className="text-xs text-gray-500">
                Tamaño máximo: {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Estado de error */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Estado de éxito */}
      {currentUrl && !isUploading && !error && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm text-green-700">Archivo subido correctamente</span>
        </div>
      )}
    </div>
  );
}