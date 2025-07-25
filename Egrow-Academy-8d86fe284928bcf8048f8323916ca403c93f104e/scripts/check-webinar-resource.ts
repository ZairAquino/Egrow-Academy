import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkWebinarResource() {
  try {
    // Buscar recursos de tipo WEBINAR
    const webinarResources = await prisma.resource.findMany({
      where: {
        category: 'WEBINAR'
      }
    });

    if (webinarResources.length > 0) {
      console.log('🔍 Recursos WEBINAR encontrados:');
      webinarResources.forEach(resource => {
        console.log('\n📺 Recurso:');
        console.log('- ID:', resource.id);
        console.log('- Título:', resource.title);
        console.log('- Slug:', resource.slug);
        console.log('- FileURL:', resource.fileUrl);
        console.log('- Type:', resource.type);
        console.log('- Category:', resource.category);
      });
    } else {
      console.log('❌ No se encontraron recursos de tipo WEBINAR');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWebinarResource();