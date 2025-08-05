import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWebinarImages() {
  try {
    console.log('🎯 Actualizando URLs de imágenes de webinars...\n');

    // Actualizar webinars para usar imágenes existentes
    const updates = [
      {
        slug: 'desarrollo-web-fullstack-ia',
        imageUrl: '/images/15.png' // Usar imagen existente
      },
      {
        slug: 'data-science-negocios-python',
        imageUrl: '/images/16.png' // Usar imagen existente
      },
      {
        slug: 'ciberseguridad-ia-proteccion',
        imageUrl: '/images/17.png' // Usar imagen existente
      }
    ];

    for (const update of updates) {
      const webinar = await prisma.webinar.update({
        where: { slug: update.slug },
        data: { imageUrl: update.imageUrl }
      });
      
      console.log(`✅ Webinar actualizado: ${webinar.title}`);
      console.log(`   🖼️ Nueva imagen: ${webinar.imageUrl}`);
      console.log('');
    }

    console.log('🎉 URLs de imágenes actualizadas exitosamente!');
    console.log('📋 Los webinars ahora usan imágenes que existen en el proyecto.');

  } catch (error) {
    console.error('❌ Error actualizando imágenes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWebinarImages(); 