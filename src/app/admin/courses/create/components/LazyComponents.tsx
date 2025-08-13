"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Componentes lazy con loading fallbacks
export const LazyRichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  {
    loading: () => (
      <div className="w-full h-48 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando editor de contenido...</span>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyFileUploader = dynamic(
  () => import('@/components/admin/FileUploader'),
  {
    loading: () => (
      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando uploader...</span>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyDragDropList = dynamic(
  () => import('@/components/admin/DragDropList'),
  {
    loading: () => (
      <div className="w-full p-8 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando lista interactiva...</span>
        </div>
      </div>
    ),
    ssr: false
  }
);

export const LazyPreviewCourse = dynamic(
  () => import('./PreviewCourse'),
  {
    loading: () => (
      <div className="w-full h-96 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3 text-gray-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Generando preview del curso...</span>
          <span className="text-sm">Esto puede tomar unos segundos</span>
        </div>
      </div>
    ),
    ssr: false
  }
);

// Hook para pre-cargar componentes cuando el usuario navega
export function useLazyPreload() {
  const preloadEditor = () => {
    import('@/components/admin/RichTextEditor');
  };
  
  const preloadUploader = () => {
    import('@/components/admin/FileUploader');
  };
  
  const preloadDragDrop = () => {
    import('@/components/admin/DragDropList');
  };
  
  const preloadPreview = () => {
    import('./PreviewCourse');
  };
  
  return {
    preloadEditor,
    preloadUploader,
    preloadDragDrop,
    preloadPreview
  };
}