import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertBasePromptsSora() {
  const title = 'Base de Prompts para Videos en Sora';
  const slug = 'base-prompts-videos-sora';

  // Imagen distinta a las ya usadas
  const imageUrl = '/images/repro.png';

  const fileUrl =
    'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfdLgTeToy4Supo1nji5c23mtlJAQCh9PNELZV';

  const description =
    'Colección de prompts optimizados para generar videos con Sora: planos, estilo, ritmo, transiciones, iluminación y narrativa.';

  const shortDescription = 'Base de prompts para crear videos con Sora de forma consistente.';

  try {
    console.log(`🔄 Creando/actualizando recurso: ${title}`);

    const data = {
      title,
      slug,
      description,
      shortDescription,
      imageUrl,
      category: ResourceCategory.MANUAL,
      type: ResourceType.LINK,
      author: 'Equipo Egrow',
      fileUrl,
      requiresAuth: true,
      isFree: true,
      rating: 4.8,
      status: ResourceStatus.PUBLISHED as const
    };

    await prisma.resource.upsert({
      where: { slug },
      update: data,
      create: data
    });

    console.log('✅ Recurso listo.');
  } catch (error) {
    console.error('❌ Error al crear el recurso:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  upsertBasePromptsSora();
}

export default upsertBasePromptsSora;


