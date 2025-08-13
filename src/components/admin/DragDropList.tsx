"use client";

import { useState, useRef, ReactNode } from "react";
import { GripVertical, Move } from "lucide-react";

interface DragDropItem {
  id: string;
  content: ReactNode;
  data?: any;
}

interface DragDropListProps {
  items: DragDropItem[];
  onReorder: (reorderedItems: DragDropItem[]) => void;
  className?: string;
  itemClassName?: string;
  showHandle?: boolean;
  direction?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export default function DragDropList({
  items,
  onReorder,
  className = "",
  itemClassName = "",
  showHandle = true,
  direction = 'vertical',
  disabled = false
}: DragDropListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (disabled || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (index !== dragOverIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Solo clear si realmente salimos del contenedor
    if (!dragRef.current?.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (disabled || draggedIndex === null || draggedIndex === dropIndex) {
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    // Remover el item de su posición original
    newItems.splice(draggedIndex, 1);
    
    // Insertar en la nueva posición
    newItems.splice(dropIndex, 0, draggedItem);
    
    onReorder(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getItemStyle = (index: number) => {
    const baseStyle = "transition-all duration-200";
    
    if (draggedIndex === index) {
      return `${baseStyle} opacity-50 scale-95`;
    }
    
    if (dragOverIndex === index && draggedIndex !== null) {
      return `${baseStyle} transform scale-105 bg-blue-50 border-blue-300`;
    }
    
    return baseStyle;
  };

  const containerClasses = `
    ${direction === 'vertical' ? 'space-y-2' : 'flex space-x-2'}
    ${className}
  `;

  return (
    <div 
      ref={dragRef}
      className={containerClasses}
      onDragLeave={handleDragLeave}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable={!disabled}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className={`
            ${getItemStyle(index)}
            ${disabled ? 'cursor-default' : 'cursor-move'}
            ${itemClassName}
          `}
        >
          <div className="flex items-center">
            {/* Drag Handle */}
            {showHandle && !disabled && (
              <div className="mr-2 p-1 text-gray-400 hover:text-gray-600">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1">
              {item.content}
            </div>
          </div>
        </div>
      ))}
      
      {/* Drop zone indicator cuando la lista está vacía */}
      {items.length === 0 && !disabled && (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            // Manejar drop en lista vacía si es necesario
          }}
        >
          <Move className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>Arrastra elementos aquí para comenzar</p>
        </div>
      )}
    </div>
  );
}

// Hook para facilitar el uso con arrays de datos
export function useDragDropList<T>(
  initialItems: T[],
  getId: (item: T) => string,
  renderItem: (item: T, index: number) => ReactNode
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const dragDropItems: DragDropItem[] = items.map((item, index) => ({
    id: getId(item),
    content: renderItem(item, index),
    data: item
  }));

  const handleReorder = (reorderedItems: DragDropItem[]) => {
    const newItems = reorderedItems.map(item => item.data as T);
    setItems(newItems);
  };

  return {
    items,
    setItems,
    dragDropItems,
    handleReorder
  };
}

// Componente especializado para módulos y lecciones
interface ModuleLessonDragDropProps {
  modules: any[];
  onReorderModules: (modules: any[]) => void;
  onReorderLessons?: (moduleIndex: number, lessons: any[]) => void;
  renderModule: (module: any, index: number) => ReactNode;
  renderLesson?: (lesson: any, moduleIndex: number, lessonIndex: number) => ReactNode;
  disabled?: boolean;
}

export function ModuleLessonDragDrop({
  modules,
  onReorderModules,
  onReorderLessons,
  renderModule,
  renderLesson,
  disabled = false
}: ModuleLessonDragDropProps) {
  const moduleItems: DragDropItem[] = modules.map((module, index) => ({
    id: `module-${index}`,
    content: (
      <div>
        {renderModule(module, index)}
        
        {/* Lecciones del módulo si se proporciona renderLesson */}
        {renderLesson && module.lessons && (
          <div className="ml-6 mt-2">
            <DragDropList
              items={module.lessons.map((lesson: any, lessonIndex: number) => ({
                id: `lesson-${index}-${lessonIndex}`,
                content: renderLesson(lesson, index, lessonIndex),
                data: lesson
              }))}
              onReorder={(reorderedLessons) => {
                if (onReorderLessons) {
                  const lessons = reorderedLessons.map(item => item.data);
                  onReorderLessons(index, lessons);
                }
              }}
              className="space-y-1"
              itemClassName="p-2 bg-gray-50 border border-gray-200 rounded"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    ),
    data: module
  }));

  return (
    <DragDropList
      items={moduleItems}
      onReorder={(reorderedItems) => {
        const modules = reorderedItems.map(item => item.data);
        onReorderModules(modules);
      }}
      className="space-y-4"
      itemClassName="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
      disabled={disabled}
    />
  );
}