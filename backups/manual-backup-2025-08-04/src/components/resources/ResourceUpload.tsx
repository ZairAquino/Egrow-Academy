'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ResourceUploadProps {
  onUploadComplete?: (url: string) => void;
  category?: string;
}

export default function ResourceUpload({ onUploadComplete, category = 'WEBINAR' }: ResourceUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { startUpload, isUploading: uploadThingUploading } = useUploadThing('resourceUpload', {
    onClientUploadComplete: (res) => {
      console.log('✅ Archivo subido exitosamente:', res);
      if (res && res[0]) {
        const url = res[0].url;
        setUploadedUrl(url);
        onUploadComplete?.(url);
        setIsUploading(false);
        setUploadProgress(100);
      }
    },
    onUploadError: (error) => {
      console.error('❌ Error al subir archivo:', error);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedUrl(null);

    try {
      await startUpload(Array.from(files));
    } catch (error) {
      console.error('❌ Error al iniciar subida:', error);
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Subir Recurso a UploadThing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Seleccionar archivo
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi"
            onChange={handleFileUpload}
            disabled={isUploading || uploadThingUploading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Subiendo archivo...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <LoadingSpinner size="sm" />
          </div>
        )}

        {uploadedUrl && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800 font-medium">
              ✅ Archivo subido exitosamente
            </p>
            <p className="text-xs text-green-600 mt-1 break-all">
              {uploadedUrl}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>📁 Formatos soportados: PDF, DOC, PPT, MP4, MOV, AVI</p>
          <p>💾 Tamaño máximo: 1GB por archivo</p>
          <p>🏷️ Categoría: {category}</p>
        </div>
      </CardContent>
    </Card>
  );
} 