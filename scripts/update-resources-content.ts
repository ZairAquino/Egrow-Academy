import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateResourcesContent() {
  try {
    console.log('🔄 Actualizando contenido y imágenes de recursos...');

    const resourceUpdates = [
      {
        slug: 'guia-prompts-chatgpt',
        description: 'Una guía completa y práctica para dominar el arte de crear prompts efectivos en ChatGPT. Descubre técnicas avanzadas como Chain of Thought, Few-Shot Learning, y Role Playing. Incluye más de 100 ejemplos reales aplicados a marketing, educación, programación y creatividad. Aprende a estructurar prompts que generen respuestas precisas, creativas y útiles para cualquier industria.',
        shortDescription: 'Domina ChatGPT con técnicas avanzadas de prompting y más de 100 ejemplos prácticos',
        imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=250&fit=crop&crop=center'
      },
      {
        slug: 'webinar-asistente-virtual',
        description: 'Webinar completo que te enseña a crear asistentes virtuales inteligentes desde cero. Incluye acceso exclusivo a nuestro ChatGPT especializado en contexto empresarial, manuales detallados de implementación GPT y GEM, y casos de uso reales en diferentes industrias. Aprende a automatizar tareas, mejorar la atención al cliente y optimizar procesos empresariales con IA conversacional.',
        shortDescription: 'Crea asistentes virtuales empresariales con ChatGPT, GPT y GEM - Incluye casos prácticos',
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center'
      },
      {
        slug: 'carrusel-de-imagenes',
        description: 'Herramienta GPT especializada en crear carruseles visuales impactantes para redes sociales, presentaciones y marketing digital. Genera layouts responsivos, sugiere combinaciones de colores armoniosas, optimiza imágenes para diferentes plataformas y crea transiciones fluidas. Perfecta para diseñadores, marketers y creadores de contenido que buscan destacar visualmente.',
        shortDescription: 'GPT especializado para crear carruseles visuales impactantes y responsivos',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center'
      },
      {
        slug: 'gpt-evaluar-mejorar-disenos',
        description: 'Asistente de IA especializado en crítica constructiva de diseño visual. Analiza composición, tipografía, paletas de colores, jerarquía visual y usabilidad. Proporciona retroalimentación detallada basada en principios de diseño modernos, tendencias actuales y mejores prácticas de UX/UI. Ideal para diseñadores que buscan una segunda opinión profesional y objetiva.',
        shortDescription: 'Asistente IA para análisis y mejora profesional de diseños visuales y UX/UI',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop&crop=center'
      },
      {
        slug: 'ebook-disenadores-vs-ia',
        description: 'Ebook estratégico que redefine el futuro del diseño en la era de la inteligencia artificial. Explora cómo los diseñadores pueden evolucionar de competidores a colaboradores de la IA, maximizando la creatividad humana con herramientas automatizadas. Incluye casos de estudio, flujos de trabajo híbridos, herramientas recomendadas y estrategias para mantenerse relevante en un mercado en transformación.',
        shortDescription: 'Estrategias para que diseñadores colaboren exitosamente con IA y mantengan relevancia',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center'
      },
      {
        slug: 'prompts-disenos-anuncios-basicos',
        description: 'Colección curada de más de 200 prompts profesionales para generar diseños creativos y anuncios efectivos usando herramientas de IA como Midjourney, DALL-E y Stable Diffusion. Incluye prompts específicos para diferentes industrias, estilos visuales, formatos publicitarios y objetivos de marketing. Cada prompt viene con ejemplos de resultados y variaciones para maximizar la creatividad.',
        shortDescription: 'Más de 200 prompts profesionales para crear diseños y anuncios con IA generativa',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop&crop=center'
      }
    ];

    for (const update of resourceUpdates) {
      await prisma.resource.update({
        where: { slug: update.slug },
        data: {
          description: update.description,
          shortDescription: update.shortDescription,
          imageUrl: update.imageUrl
        }
      });
      console.log(`✅ Actualizado: ${update.slug}`);
    }

    console.log('🎉 ¡Contenido de recursos actualizado exitosamente!');

  } catch (error) {
    console.error('❌ Error al actualizar recursos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  updateResourcesContent()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export default updateResourcesContent;