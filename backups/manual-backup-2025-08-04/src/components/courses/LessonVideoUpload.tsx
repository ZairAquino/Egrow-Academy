'use client';

import { useState } from 'react';
import { Upload, Video, X, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadDropzone } from '@/lib/uploadthing-config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LessonVideoUploadProps {
  lessonId: string;
  currentVideoUrl?: string;
  onVideoUploaded: (videoUrl: string) => void;
  onVideoRemoved: () => void;
  className?: string;
}

export default function LessonVideoUpload({
  lessonId,
  currentVideoUrl,
  onVideoUploaded,
  onVideoRemoved,
  className = ''
}: LessonVideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(true);
    
    if (res && res[0]?.url) {
      onVideoUploaded(res[0].url);
    }
    
    // Resetear estado de éxito después de 3 segundos
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    setUploadError(error.message);
    setUploadSuccess(false);
  };

  const handleUploadBegin = () => {
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleRemoveVideo = () => {
    onVideoRemoved();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Video actual */}
      {currentVideoUrl && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Video actual</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveVideo}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Eliminar
            </Button>
          </div>
          <video
            src={currentVideoUrl}
            className="w-full h-48 object-cover rounded-lg"
            controls
          />
        </Card>
      )}

      {/* Área de subida */}
      {!currentVideoUrl && (
        <Card className="p-6">
          <div className="text-center mb-4">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Subir video de la lección
            </h3>
            <p className="text-sm text-gray-500">
              Arrastra y suelta tu video o haz clic para seleccionar
            </p>
          </div>

          <UploadDropzone
            endpoint="courseVideo"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onUploadBegin={handleUploadBegin}
            config={{
              mode: "auto"
            }}
            appearance={{
              container: "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors",
              allowedContent: "text-sm text-gray-500 mb-2",
              button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
              label: "text-gray-700 font-medium"
            }}
          />

          {/* Estados de carga */}
          {isUploading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Subiendo video...</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">¡Video subido exitosamente!</span>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{uploadError}</span>
            </div>
          )}
        </Card>
      )}

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Información sobre videos</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Formatos soportados: MP4, MOV, AVI</li>
          <li>• Tamaño máximo: 1GB por video</li>
          <li>• Resolución recomendada: 1920x1080 (Full HD)</li>
          <li>• Duración recomendada: 5-30 minutos por lección</li>
        </ul>
      </div>
    </div>
  );
} 