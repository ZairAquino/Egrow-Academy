import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertBasePromptsPublicidad() {
  const title = 'Base de Prompts para Publicidad con IA';
  const slug = 'base-prompts-publicidad-ia';

  // Imagen diferente a la usada por fallback en ResourceCard
  const imageUrl = '/images/repro.png';

  const fileUrl =
    'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf19gNCEQM9nSueGgY57l4tshCfzyKDB3XWdkj';

  const description =
    'Plantillas de prompts para anuncios con IA: premium, comida apetecible, retro+moderno, minimalista, storytelling y surrealista. Incluye guías de estilo, iluminación y composición.';

  const shortDescription = 'Base de prompts para generar anuncios con IA, lista para usar.';

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
  upsertBasePromptsPublicidad();
}

export default upsertBasePromptsPublicidad;


