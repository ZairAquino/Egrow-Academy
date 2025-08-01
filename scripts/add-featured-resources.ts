import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addFeaturedResources() {
  try {
    console.log('🔄 Agregando recursos destacados a la biblioteca...');

    const resources = [
      {
        title: 'Carrusel de imágenes',
        slug: 'carrusel-de-imagenes',
        description: 'Herramienta interactiva para crear carruseles visuales atractivos con transiciones suaves y controles intuitivos',
        shortDescription: 'Crea carruseles visuales interactivos',
        category: 'HERRAMIENTA',
        type: 'LINK',
        author: 'Equipo Egrow',
        fileUrl: '#',
        requiresAuth: true,
        isFree: true,
        rating: 4.8,
        status: 'PUBLISHED'
      },
      {
        title: 'Prompts para diseños y anuncios básicos',
        slug: 'prompts-disenos-anuncios-basicos',
        description: 'Colección de prompts optimizados para generar diseños creativos y anuncios efectivos usando IA',
        shortDescription: 'Prompts para crear diseños y anuncios con IA',
        category: 'MANUAL',
        type: 'PDF',
        author: 'Equipo Egrow',
        fileUrl: '#',
        requiresAuth: true,
        isFree: true,
        rating: 4.7,
        status: 'PUBLISHED'
      },
      {
        title: 'Ebook: Diseñadores vs IA',
        slug: 'ebook-disenadores-vs-ia',
        description: 'Guía completa sobre cómo los diseñadores pueden colaborar con la IA para potenciar su creatividad',
        shortDescription: 'Colaboración entre diseñadores y la IA',
        category: 'EBOOK',
        type: 'PDF',
        author: 'Equipo Egrow',
        fileUrl: '#',
        requiresAuth: true,
        isFree: true,
        rating: 4.9,
        status: 'PUBLISHED'
      },
      {
        title: 'GPT para evaluar o mejorar diseños',
        slug: 'gpt-evaluar-mejorar-disenos',
        description: 'Técnicas y prompts específicos para usar GPT como crítico constructivo de tus proyectos de diseño',
        shortDescription: 'Usa GPT para mejorar tus diseños',
        category: 'TUTORIAL',
        type: 'LINK',
        author: 'Equipo Egrow',
        fileUrl: '#',
        requiresAuth: true,
        isFree: true,
        rating: 4.6,
        status: 'PUBLISHED'
      }
    ];

    for (const resource of resources) {
      // Verificar si el recurso ya existe
      const existingResource = await prisma.resource.findUnique({
        where: { slug: resource.slug }
      });

      if (existingResource) {
        console.log(`⚠️  El recurso "${resource.title}" ya existe, actualizando...`);
        await prisma.resource.update({
          where: { slug: resource.slug },
          data: resource
        });
      } else {
        console.log(`✅ Creando recurso "${resource.title}"...`);
        await prisma.resource.create({
          data: resource
        });
      }
    }

    console.log('🎉 ¡Recursos agregados exitosamente a la biblioteca!');

  } catch (error) {
    console.error('❌ Error al agregar recursos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  addFeaturedResources()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export default addFeaturedResources;