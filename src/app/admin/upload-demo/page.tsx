"use client";

import { useState } from "react";
import CourseResourceUpload from "@/components/courses/CourseResourceUpload";
import FileUpload from "@/components/ui/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadDemoPage() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUploadComplete = (url: string) => {
    setUploadedUrls(prev => [...prev, url]);
  };

  const handleUploadError = (error: Error) => {
    console.error("Error en la subida:", error);
    alert(`Error: ${error.message}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Demo de UploadThing - eGrow Academy
          </h1>
          <p className="text-gray-600">
            Prueba la funcionalidad de subida de archivos para cursos y recursos
          </p>
        </div>

        {/* Demo de Recursos de Curso */}
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Recursos de Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseResourceUpload
              courseId="demo-course-123"
              onResourceAdded={(resource) => {
                console.log("Recurso agregado:", resource);
                setUploadedUrls(prev => [...prev, resource.url]);
              }}
              onResourceRemoved={(resourceId) => {
                console.log("Recurso removido:", resourceId);
              }}
            />
          </CardContent>
        </Card>

        {/* Demo de Subida Individual */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subida de Video</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                endpoint="courseVideo"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subida de Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                endpoint="courseResource"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>
        </div>

        {/* URLs Subidas */}
        {uploadedUrls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Archivos Subidos ({uploadedUrls.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploadedUrls.map((url, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono truncate flex-1">
                        {url}
                      </span>
                      <button
                        onClick={() => window.open(url, "_blank")}
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Endpoints Configurados:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <code>courseVideo</code> - Videos hasta 1GB</li>
                  <li>• <code>courseResource</code> - PDFs, imágenes, documentos</li>
                  <li>• <code>userAvatar</code> - Imágenes de perfil</li>
                  <li>• <code>generalResource</code> - Recursos generales</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Características:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Autenticación requerida</li>
                  <li>• Validación de tipos de archivo</li>
                  <li>• Límites de tamaño configurados</li>
                  <li>• URLs seguras con expiración</li>
                  <li>• Progreso de subida en tiempo real</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 