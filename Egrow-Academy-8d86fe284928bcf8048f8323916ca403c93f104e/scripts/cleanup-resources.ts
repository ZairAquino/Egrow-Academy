import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupResources() {
  try {
    console.log('🔍 Limpiando recursos...');

    // Eliminar recursos individuales (mantener solo el webinar)
    const resourcesToDelete = [
      'chatgpt-contexto-empresarial',
      'manual-gem-google-gemini', 
      'manual-gpt-openai'
    ];

    for (const slug of resourcesToDelete) {
      const resource = await prisma.resource.findUnique({
        where: { slug },
        include: { topics: true }
      });

      if (resource) {
        console.log(`🗑️ Eliminando recurso: ${resource.title}`);
        
        // Eliminar temas primero
        await prisma.resourceTopic.deleteMany({
          where: { resourceId: resource.id }
        });

        // Eliminar logs de acceso
        await prisma.resourceAccessLog.deleteMany({
          where: { resourceId: resource.id }
        });

        // Eliminar el recurso
        await prisma.resource.delete({
          where: { id: resource.id }
        });

        console.log(`✅ Recurso eliminado: ${resource.title}`);
      }
    }

    console.log('🎉 Limpieza completada. Solo queda el webinar.');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupResources(); 