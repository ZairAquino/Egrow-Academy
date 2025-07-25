"use client";

import { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Image, Download, Trash2 } from "lucide-react";

interface CourseResource {
  id: string;
  name: string;
  type: "video" | "pdf" | "image" | "document";
  url: string;
  size: number;
  courseId: string;
  createdAt: Date;
}

interface CourseResourceUploadProps {
  courseId: string;
  onResourceAdded?: (resource: CourseResource) => void;
  onResourceRemoved?: (resourceId: string) => void;
  existingResources?: CourseResource[];
}

export default function CourseResourceUpload({
  courseId,
  onResourceAdded,
  onResourceRemoved,
  existingResources = [],
}: CourseResourceUploadProps) {
  const [resources, setResources] = useState<CourseResource[]>(existingResources);
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");

  const handleVideoUpload = (url: string) => {
    const newResource: CourseResource = {
      id: `temp-${Date.now()}`,
      name: `Video ${resources.filter(r => r.type === "video").length + 1}`,
      type: "video",
      url,
      size: 0,
      courseId,
      createdAt: new Date(),
    };
    
    setResources(prev => [...prev, newResource]);
    if (onResourceAdded) onResourceAdded(newResource);
  };

  const handleResourceUpload = (url: string) => {
    const fileName = url.split("/").pop() || "Recurso";
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    
    let type: CourseResource["type"] = "document";
    if (fileExtension === "pdf") type = "pdf";
    else if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")) type = "image";
    
    const newResource: CourseResource = {
      id: `temp-${Date.now()}`,
      name: fileName,
      type,
      url,
      size: 0,
      courseId,
      createdAt: new Date(),
    };
    
    setResources(prev => [...prev, newResource]);
    if (onResourceAdded) onResourceAdded(newResource);
  };

  const handleRemoveResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
    if (onResourceRemoved) onResourceRemoved(resourceId);
  };

  const getFileIcon = (type: CourseResource["type"]) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: CourseResource["type"]) => {
    const colors = {
      video: "bg-red-100 text-red-800",
      pdf: "bg-blue-100 text-blue-800",
      image: "bg-green-100 text-green-800",
      document: "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge className={colors[type]}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recursos del Curso</span>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("upload")}
            >
              Subir
            </Button>
            <Button
              variant={activeTab === "manage" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("manage")}
            >
              Gestionar ({resources.length})
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {activeTab === "upload" ? (
          <div className="space-y-6">
            {/* Subida de Videos */}
            <div>
              <h3 className="text-lg font-medium mb-3">Videos del Curso</h3>
              <FileUpload
                endpoint="courseVideo"
                onUploadComplete={handleVideoUpload}
                className="mb-4"
              />
              <p className="text-sm text-gray-500">
                Máximo 1GB por video. Formatos: MP4, MOV, AVI
              </p>
            </div>

            {/* Subida de Recursos */}
            <div>
              <h3 className="text-lg font-medium mb-3">Recursos Adicionales</h3>
              <FileUpload
                endpoint="courseResource"
                onUploadComplete={handleResourceUpload}
                className="mb-4"
              />
              <p className="text-sm text-gray-500">
                PDFs, imágenes, documentos. Máximo 50MB por archivo
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay recursos subidos aún</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(resource.type)}
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(resource.type)}
                          <span className="text-sm text-gray-500">
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resource.url, "_blank")}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveResource(resource.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 