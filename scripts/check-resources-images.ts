import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResourcesImages() {
  try {
    console.log('🔍 [CHECK-IMAGES] Verificando imágenes de recursos...');

    // Buscar los recursos específicos
    const resources = await prisma.resource.findMany({
      where: {
        OR: [
          { slug: 'guia-prompts-chatgpt' },
          { slug: 'webinar-asistente-virtual' }
        ]
      }
    });

    console.log('\n📊 [CHECK-IMAGES] Recursos encontrados:');
    resources.forEach(resource => {
      console.log(`\n📄 ${resource.title}`);
      console.log(`   - Slug: ${resource.slug}`);
      console.log(`   - Imagen actual: ${resource.imageUrl}`);
      console.log(`   - Categoría: ${resource.category}`);
      console.log(`   - Tipo: ${resource.type}`);
    });

  } catch (error) {
    console.error('❌ [CHECK-IMAGES] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResourcesImages();