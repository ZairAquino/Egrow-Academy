import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeExtraTopics() {
  try {
    console.log('🔍 Eliminando temas adicionales del webinar...');

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

    // Eliminar temas 4 y 5 (Implementación Práctica y Casos de Uso)
    const topicsToDelete = webinar.topics.filter(topic => topic.order >= 4);
    
    for (const topic of topicsToDelete) {
      await prisma.resourceTopic.delete({
        where: { id: topic.id }
      });
      console.log(`🗑️ Tema eliminado: ${topic.title}`);
    }

    console.log('🎉 Temas adicionales eliminados exitosamente!');
    console.log(`📊 Total de temas restantes: ${webinar.topics.length - topicsToDelete.length}`);

  } catch (error) {
    console.error('❌ Error eliminando temas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeExtraTopics(); 