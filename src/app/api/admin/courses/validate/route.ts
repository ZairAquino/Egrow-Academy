import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';

interface ValidationRequest {
  field: 'slug' | 'title' | 'videoUrl' | 'imageUrl';
  value: string;
  courseId?: string; // Para excluir el curso actual al editar
}

// Función para generar slug desde título
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
}

// Función para validar URLs de video (YouTube, Vimeo, etc.)
function validateVideoUrl(url: string): { valid: boolean; suggestions?: string[] } {
  if (!url) return { valid: true }; // URL opcional
  
  try {
    const urlObj = new URL(url);
    const suggestions: string[] = [];
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      if (urlObj.hostname === 'youtube.com' && !urlObj.pathname.includes('/watch')) {
        suggestions.push('Para YouTube, usar formato: https://www.youtube.com/watch?v=VIDEO_ID');
      }
      if (urlObj.hostname === 'youtu.be') {
        // youtu.be es válido
      }
      return { valid: true, suggestions };
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      return { valid: true, suggestions };
    }
    
    // URLs directas de video
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
    if (videoExtensions.some(ext => urlObj.pathname.toLowerCase().includes(ext))) {
      return { valid: true, suggestions };
    }
    
    // Otros dominios de video conocidos
    const validVideoDomains = ['wistia.com', 'vidyard.com', 'loom.com', 'streamable.com'];
    if (validVideoDomains.some(domain => urlObj.hostname.includes(domain))) {
      return { valid: true, suggestions };
    }
    
    return { 
      valid: false, 
      suggestions: [
        'Use YouTube (youtube.com/youtu.be), Vimeo (vimeo.com) o URLs directas de video',
        'Formatos soportados: YouTube, Vimeo, Wistia, Loom, archivos .mp4/.webm/.ogg'
      ]
    };
    
  } catch {
    return { 
      valid: false, 
      suggestions: ['La URL no tiene un formato válido'] 
    };
  }
}

// Función para validar URLs de imagen
function validateImageUrl(url: string): { valid: boolean; suggestions?: string[] } {
  if (!url) return { valid: true }; // URL opcional
  
  try {
    const urlObj = new URL(url);
    const suggestions: string[] = [];
    
    // Verificar extensión de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      urlObj.pathname.toLowerCase().includes(ext)
    );
    
    if (!hasImageExtension) {
      // Verificar si es un servicio de imágenes conocido
      const imageDomains = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'images.unsplash.com'];
      const isImageService = imageDomains.some(domain => urlObj.hostname.includes(domain));
      
      if (!isImageService) {
        suggestions.push('La URL debería apuntar a una imagen (.jpg, .png, .webp, etc.)');
        suggestions.push('O usar un servicio de imágenes como Cloudinary, Imgur, Unsplash');
      }
    }
    
    return { valid: true, suggestions };
    
  } catch {
    return { 
      valid: false, 
      suggestions: ['La URL no tiene un formato válido'] 
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // ✅ Verificar autenticación ADMIN
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return authResult.response!;
    }

    const { field, value, courseId }: ValidationRequest = await request.json();
    
    console.log(`🔍 Validando ${field}:`, value);
    
    const response: {
      valid: boolean;
      errors?: string[];
      suggestions?: string[];
      generatedSlug?: string;
    } = { valid: true };
    
    switch (field) {
      case 'slug':
        if (!value || value.trim().length < 3) {
          response.valid = false;
          response.errors = ['El slug debe tener al menos 3 caracteres'];
          break;
        }
        
        // Verificar formato del slug
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(value)) {
          response.valid = false;
          response.errors = ['El slug solo puede contener letras minúsculas, números y guiones'];
          response.suggestions = ['Ejemplo: monetiza-voz-ia-elevenlabs'];
          break;
        }
        
        // Verificar unicidad (simulado por ahora)
        // const existingCourse = await prisma.course.findFirst({
        //   where: {
        //     slug: value,
        //     ...(courseId && { id: { not: courseId } })
        //   }
        // });
        
        // Simulación temporal - asumir que todos los slugs están disponibles
        const existingCourse = null;
        
        if (existingCourse) {
          response.valid = false;
          response.errors = [`El slug "${value}" ya está en uso`];
          response.suggestions = [`${value}-2`, `${value}-nuevo`, `${value}-v2`];
        }
        break;
        
      case 'title':
        if (!value || value.trim().length < 5) {
          response.valid = false;
          response.errors = ['El título debe tener al menos 5 caracteres'];
          break;
        }
        
        if (value.length > 100) {
          response.valid = false;
          response.errors = ['El título no puede exceder 100 caracteres'];
          break;
        }
        
        // Generar slug sugerido
        response.generatedSlug = generateSlugFromTitle(value);
        
        // Verificar si el título ya existe (simulado por ahora)
        // const existingTitle = await prisma.course.findFirst({
        //   where: {
        //     title: { equals: value.trim(), mode: 'insensitive' },
        //     ...(courseId && { id: { not: courseId } })
        //   }
        // });
        
        // Simulación temporal - asumir que todos los títulos están disponibles
        const existingTitle = null;
        
        if (existingTitle) {
          response.valid = false;
          response.errors = [`Ya existe un curso con el título "${value}"`];
          response.suggestions = [
            `${value} - Nueva Versión`,
            `${value} 2024`,
            `${value} Avanzado`
          ];
        }
        break;
        
      case 'videoUrl':
        const videoValidation = validateVideoUrl(value);
        response.valid = videoValidation.valid;
        if (!videoValidation.valid) {
          response.errors = ['URL de video no válida'];
        }
        response.suggestions = videoValidation.suggestions;
        break;
        
      case 'imageUrl':
        const imageValidation = validateImageUrl(value);
        response.valid = imageValidation.valid;
        if (!imageValidation.valid) {
          response.errors = ['URL de imagen no válida'];
        }
        response.suggestions = imageValidation.suggestions;
        break;
        
      default:
        response.valid = false;
        response.errors = [`Campo de validación no soportado: ${field}`];
    }
    
    console.log(`✅ Validación ${field} completada:`, { valid: response.valid });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ Error en validación:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        errors: ['Error interno del servidor'],
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// También permitir GET para validaciones simples via query params
export async function GET(request: NextRequest) {
  try {
    // ✅ Verificar autenticación ADMIN
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return authResult.response!;
    }

    const { searchParams } = new URL(request.url);
    const field = searchParams.get('field') as 'slug' | 'title';
    const value = searchParams.get('value');
    const courseId = searchParams.get('courseId') || undefined;
    
    if (!field || !value) {
      return NextResponse.json(
        { error: 'Parámetros field y value son requeridos' },
        { status: 400 }
      );
    }
    
    // Reutilizar la lógica del POST
    const mockRequest = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ field, value, courseId })
    });
    
    return POST(mockRequest as NextRequest);
    
  } catch (error) {
    console.error('❌ Error en validación GET:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        errors: ['Error interno del servidor']
      },
      { status: 500 }
    );
  }
}