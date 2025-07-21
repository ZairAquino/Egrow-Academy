import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateChatGPTContent() {
  try {
    console.log('🔍 Actualizando contenido del ChatGPT...');

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

    // Buscar el tema del ChatGPT (primer tema)
    const chatgptTopic = webinar.topics.find(topic => topic.order === 1);
    
    if (chatgptTopic) {
      // Actualizar el tema del ChatGPT
      await prisma.resourceTopic.update({
        where: { id: chatgptTopic.id },
        data: {
          title: 'GPT de Contexto',
          description: 'GPT especializado para generar contexto de tu negocio. Herramienta avanzada que te ayuda a estructurar y analizar información empresarial de manera efectiva, creando contextos claros y profesionales para tu negocio.'
        }
      });

      console.log('✅ Tema ChatGPT actualizado');
    }

    console.log('🎉 Contenido del ChatGPT actualizado exitosamente!');

  } catch (error) {
    console.error('❌ Error actualizando el contenido:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateChatGPTContent(); 