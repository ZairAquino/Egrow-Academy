import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createChatGPTGuide() {
  try {
    console.log('🔍 [CREATE-RESOURCE] Iniciando creación del recurso...');

    // Crear el nuevo recurso
    const newResource = await prisma.resource.create({
      data: {
        title: 'Guía de Prompts para ChatGPT',
        slug: 'guia-prompts-chatgpt',
        description: 'Una guía completa y práctica para crear prompts efectivos en ChatGPT. Aprende técnicas avanzadas, mejores prácticas y ejemplos reales para maximizar el potencial de la IA conversacional.',
        shortDescription: 'Guía completa para crear prompts efectivos en ChatGPT con técnicas avanzadas y ejemplos prácticos.',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center',
        category: 'MANUAL',
        type: 'PDF',
        author: 'eGrow Academy',
        fileUrl: 'https://utfs.io/f/guia-prompts-chatgpt.pdf',
        requiresAuth: true,
        isFree: false,
        status: 'PUBLISHED'
      }
    });

    console.log('✅ [CREATE-RESOURCE] Recurso creado exitosamente:', newResource.id);

    // Crear temas/tópicos del recurso
    const topics = [
      {
        title: 'Fundamentos de Prompts',
        description: 'Conceptos básicos y estructura de un prompt efectivo',
        order: 1
      },
      {
        title: 'Técnicas Avanzadas',
        description: 'Estrategias para obtener respuestas más precisas y útiles',
        order: 2
      },
      {
        title: 'Casos de Uso Prácticos',
        description: 'Ejemplos reales aplicados a diferentes industrias',
        order: 3
      },
      {
        title: 'Mejores Prácticas',
        description: 'Consejos y trucos para optimizar tus interacciones',
        order: 4
      },
      {
        title: 'Templates y Ejemplos',
        description: 'Plantillas reutilizables para diferentes tipos de tareas',
        order: 5
      }
    ];

    for (const topic of topics) {
      await prisma.resourceTopic.create({
        data: {
          ...topic,
          resourceId: newResource.id
        }
      });
    }

    console.log('✅ [CREATE-RESOURCE] Temas del recurso creados exitosamente');

    console.log('🎉 [CREATE-RESOURCE] Recurso "Guía de Prompts para ChatGPT" creado completamente');
    console.log('📊 [CREATE-RESOURCE] Detalles del recurso:');
    console.log(`   - ID: ${newResource.id}`);
    console.log(`   - Título: ${newResource.title}`);
    console.log(`   - Slug: ${newResource.slug}`);
    console.log(`   - Categoría: ${newResource.category}`);
    console.log(`   - Tipo: ${newResource.type}`);
    console.log(`   - Requiere autenticación: ${newResource.requiresAuth}`);
    console.log(`   - Es gratuito: ${newResource.isFree}`);

  } catch (error) {
    console.error('❌ [CREATE-RESOURCE] Error al crear el recurso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createChatGPTGuide(); 