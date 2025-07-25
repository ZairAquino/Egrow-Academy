import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResource() {
  try {
    const resource = await prisma.resource.findUnique({
      where: {
        slug: 'guia-prompts-chatgpt'
      }
    });

    if (resource) {
      console.log('🔍 Recurso encontrado:');
      console.log('- ID:', resource.id);
      console.log('- Título:', resource.title);
      console.log('- FileURL:', resource.fileUrl);
      console.log('- RequiresAuth:', resource.requiresAuth);
      console.log('- Type:', resource.type);
      console.log('- Status:', resource.status);
    } else {
      console.log('❌ Recurso no encontrado');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResource();