'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Resource } from '@/hooks/useResources';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewResource = () => {
    if (!isAuthenticated) {
      // Siempre redirigir al login para ver el contenido
      router.push('/login?redirect=' + encodeURIComponent(`/resources/${resource.slug}`));
    } else {
      // Ir directamente al recurso
      router.push(`/resources/${resource.slug}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      // Nuevas categorías con colores especiales
      ULTIMO_WEBINAR: 'bg-blue-500 text-white shadow-lg',
      EN_VIVO: 'bg-red-500 text-white shadow-lg animate-pulse'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      PDF: '📄',
      VIDEO: '🎥',
      AUDIO: '🎵',
      LINK: '🔗',
      TOOL: '🛠️',
      DATASET: '📊'
    };
    return icons[type] || '📄';
  };

  return (
    <div 
      className="course-card-new cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewResource}
    >
      <div className="course-image-new">
        <img 
          src={resource.imageUrl || 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&crop=center'} 
          alt={resource.title}
        />
        <div className={`course-type-badge ${getCategoryColor(resource.category)}`}>
          {resource.category.replace('_', ' ')}
        </div>
      </div>
      
      <div className="course-content-new">
        <div className="course-meta">
          <span className="course-instructor">{resource.author || 'eGrow Academy'}</span>
        </div>
        
        <h3 className="course-title-new">
          {resource.title}
        </h3>
        
        <p className="course-description-new">
          {resource.shortDescription || resource.description}
        </p>
        
        <div className="course-link">
          {!isAuthenticated ? 'Iniciar Sesión' : 'Ver Recurso'} →
        </div>
      </div>
    </div>
  );
} 