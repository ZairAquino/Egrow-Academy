import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupTestResources() {
  try {
    console.log('🧹 Limpiando recursos de prueba...\n');

    // Eliminar recursos de prueba
    const deletedResources = await prisma.resource.deleteMany({
      where: {
        OR: [
          { title: { startsWith: 'Test - Último Webinar' } },
          { title: { startsWith: 'Test - En Vivo' } }
        ]
      }
    });

    console.log(`✅ Eliminados ${deletedResources.count} recursos de prueba`);
    console.log('🧹 Limpieza completada!');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestResources(); 