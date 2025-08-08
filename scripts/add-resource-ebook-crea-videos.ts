import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertEbookCreaVideosIA() {
  const title = 'Ebook_ Crea videos profesionales con IA';
  const slug = 'ebook-crea-videos-profesionales-ia';

  const imageUrl = 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80&auto=format&fit=crop';
  const fileUrl = 'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3Wf009oYi3zH8OinDQ0vfu7r9b4CGqgU2Kl1WpF';

  const description =
    'Ebook práctico para crear videos profesionales con IA: flujo de trabajo, estilo visual, prompts efectivos y consejos de producción.';
  const shortDescription = 'Ebook para producir videos profesionales con IA.';

  try {
    console.log(`🔄 Creando/actualizando recurso: ${title}`);

    const data = {
      title,
      slug,
      description,
      shortDescription,
      imageUrl,
      category: ResourceCategory.EBOOK,
      type: ResourceType.PDF,
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
  upsertEbookCreaVideosIA();
}

export default upsertEbookCreaVideosIA;


