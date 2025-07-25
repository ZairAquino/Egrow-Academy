import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateResourcesImages() {
  try {
    console.log('🔄 [UPDATE-IMAGES] Actualizando imágenes de recursos...');

    // Actualizar imagen de la Guía de Prompts para ChatGPT
    const chatgptGuide = await prisma.resource.update({
      where: {
        slug: 'guia-prompts-chatgpt'
      },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ [UPDATE-IMAGES] Guía de Prompts actualizada:');
    console.log(`   - Nueva imagen: ${chatgptGuide.imageUrl}`);

    // Actualizar imagen del Webinar: asistente virtual
    const webinar = await prisma.resource.update({
      where: {
        slug: 'webinar-asistente-virtual'
      },
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center'
      }
    });

    console.log('✅ [UPDATE-IMAGES] Webinar actualizado:');
    console.log(`   - Nueva imagen: ${webinar.imageUrl}`);

    console.log('\n🎉 [UPDATE-IMAGES] Todas las imágenes actualizadas exitosamente');

  } catch (error) {
    console.error('❌ [UPDATE-IMAGES] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateResourcesImages();