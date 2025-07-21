import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWebinarContent() {
  try {
    console.log('🔍 Actualizando contenido del webinar...');

    // Buscar el webinar
    const webinar = await prisma.resource.findUnique({
      where: { slug: 'webinar-asistente-virtual' },
      include: { topics: true }
    });

    if (!webinar) {
      console.log('❌ Webinar no encontrado');
      return;
    }

    console.log('✅ Webinar encontrado:', webinar.title);

    // Eliminar temas existentes
    await prisma.resourceTopic.deleteMany({
      where: { resourceId: webinar.id }
    });

    console.log('🗑️ Temas anteriores eliminados');

    // Crear nuevos temas con los tres recursos
    const newTopics = [
      {
        title: 'ChatGPT: Contexto Empresarial',
        description: 'GPT especializado en crear contextos de negocio basados en respuestas dadas. Herramienta ideal para emprendedores y profesionales que necesitan estructurar y analizar información empresarial de manera efectiva.',
        order: 1,
        isExternalLink: true,
        externalUrl: 'https://chatgpt.com/g/g-687e84aba36c8191a44042cc330db2f1-contexto-empresarial',
        author: 'Zair Aquino',
        type: 'HERRAMIENTA'
      },
      {
        title: 'Manual GEM - Google Gemini',
        description: 'Manual completo sobre Google Gemini (GEM) - Guía práctica para el uso y desarrollo con modelos de IA de Google. Incluye ejemplos prácticos, mejores prácticas y casos de uso avanzados.',
        order: 2,
        isExternalLink: false,
        fileUrl: '/resources/Manual GEM.pdf',
        author: 'Google AI',
        type: 'MANUAL'
      },
      {
        title: 'Manual GPT - OpenAI',
        description: 'Manual completo sobre GPT (Generative Pre-trained Transformer) - Guía práctica para el uso y desarrollo con modelos de lenguaje de OpenAI. Incluye técnicas avanzadas y optimización de prompts.',
        order: 3,
        isExternalLink: false,
        fileUrl: '/resources/Manual GPT.pdf',
        author: 'OpenAI',
        type: 'MANUAL'
      },
      {
        title: 'Implementación Práctica',
        description: 'Guía paso a paso para implementar asistentes virtuales usando los conocimientos de los manuales anteriores.',
        order: 4,
        isExternalLink: false,
        fileUrl: null,
        author: 'eGrow Academy',
        type: 'TUTORIAL'
      },
      {
        title: 'Casos de Uso y Mejores Prácticas',
        description: 'Ejemplos reales y recomendaciones para optimizar el rendimiento de asistentes virtuales en diferentes contextos empresariales.',
        order: 5,
        isExternalLink: false,
        fileUrl: null,
        author: 'eGrow Academy',
        type: 'TUTORIAL'
      }
    ];

    // Crear los nuevos temas
    for (const topic of newTopics) {
      await prisma.resourceTopic.create({
        data: {
          title: topic.title,
          description: topic.description,
          order: topic.order,
          resourceId: webinar.id
        }
      });
    }

    console.log('✅ Nuevos temas creados:', newTopics.length);

    // Actualizar la descripción del webinar
    await prisma.resource.update({
      where: { id: webinar.id },
      data: {
        description: 'Webinar completo sobre asistentes virtuales con IA. Incluye acceso a ChatGPT especializado en contexto empresarial, manuales detallados de GPT y GEM, implementación práctica y mejores prácticas para crear asistentes virtuales inteligentes.',
        shortDescription: 'Aprende a crear asistentes virtuales con IA usando ChatGPT, GPT y GEM'
      }
    });

    console.log('✅ Descripción del webinar actualizada');
    console.log('🎉 Webinar actualizado exitosamente!');

  } catch (error) {
    console.error('❌ Error actualizando el webinar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWebinarContent(); 