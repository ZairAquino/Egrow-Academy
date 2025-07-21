import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createWebinarResource() {
  try {
    console.log('🔍 Creando recurso: Webinar: asistente virtual...');

    // Crear el recurso principal
    const resource = await prisma.resource.create({
      data: {
        title: 'Webinar: asistente virtual',
        slug: 'webinar-asistente-virtual',
        description: 'Webinar completo sobre asistentes virtuales con IA. Incluye manuales detallados de GPT y GEM, casos de uso prácticos, implementación y mejores prácticas para crear asistentes virtuales inteligentes.',
        shortDescription: 'Aprende a crear asistentes virtuales con IA usando GPT y GEM',
        category: 'WEBINAR',
        type: 'PDF',
        author: 'eGrow Academy',
        fileUrl: '/resources/Manual GPT.pdf', // Archivo principal
        requiresAuth: true,
        isFree: false,
        rating: 4.8,
        downloadsCount: 0,
        status: 'PUBLISHED',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ Recurso creado:', resource.id);

    // Crear los temas del webinar
    const topics = [
      {
        title: 'Introducción a Asistentes Virtuales',
        description: 'Conceptos básicos y fundamentos de los asistentes virtuales con IA',
        order: 1
      },
      {
        title: 'Manual GPT - Guía Completa',
        description: 'Manual detallado sobre GPT (Generative Pre-trained Transformer) - Guía práctica para el uso y desarrollo con modelos de lenguaje',
        order: 2
      },
      {
        title: 'Manual GEM - Google Gemini',
        description: 'Manual completo sobre Google Gemini (GEM) - Guía práctica para el uso y desarrollo con modelos de IA de Google',
        order: 3
      },
      {
        title: 'Casos de Uso Prácticos',
        description: 'Ejemplos reales y casos de uso para implementar asistentes virtuales',
        order: 4
      },
      {
        title: 'Implementación y Desarrollo',
        description: 'Guía paso a paso para implementar asistentes virtuales en proyectos reales',
        order: 5
      },
      {
        title: 'Mejores Prácticas y Optimización',
        description: 'Recomendaciones y mejores prácticas para optimizar el rendimiento de asistentes virtuales',
        order: 6
      }
    ];

    for (const topic of topics) {
      await prisma.resourceTopic.create({
        data: {
          ...topic,
          resourceId: resource.id
        }
      });
    }

    console.log('✅ Temas creados:', topics.length);

    console.log('🎉 Recurso "Webinar: asistente virtual" creado exitosamente!');
    console.log('📊 ID del recurso:', resource.id);
    console.log('🔗 Slug:', resource.slug);

  } catch (error) {
    console.error('❌ Error creando el recurso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createWebinarResource(); 