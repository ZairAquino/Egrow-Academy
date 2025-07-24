import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateChatGPTGuideUrl() {
  try {
    console.log('🔍 [UPDATE-RESOURCE] Iniciando actualización del recurso...');

    // Actualizar el recurso existente
    const updatedResource = await prisma.resource.update({
      where: {
        slug: 'guia-prompts-chatgpt'
      },
      data: {
        fileUrl: 'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfkxKajlFauwDyGejd5FRObK2AmQgXJHscf1C3'
      }
    });

    console.log('✅ [UPDATE-RESOURCE] Recurso actualizado exitosamente');
    console.log('📊 [UPDATE-RESOURCE] Detalles del recurso actualizado:');
    console.log(`   - ID: ${updatedResource.id}`);
    console.log(`   - Título: ${updatedResource.title}`);
    console.log(`   - Nueva URL: ${updatedResource.fileUrl}`);

  } catch (error) {
    console.error('❌ [UPDATE-RESOURCE] Error al actualizar el recurso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateChatGPTGuideUrl();