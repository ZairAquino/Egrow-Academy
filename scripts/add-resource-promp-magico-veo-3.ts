import { PrismaClient, ResourceCategory, ResourceStatus, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertPrompMagicoVeo3() {
  const title = 'Promp mágico VEO 3';
  const slug = 'promp-magico-veo-3';

  // Imagen alineada a IA/video cinematográfico
  const imageUrl = '/images/repro.png';

  const fileUrl =
    'https://3o0p1lzj4n.ufs.sh/f/P2bnXUoat3WfCnehABUdaWlSVx5UpNGs8y7ucRKXzLg4rF9A';

  const description =
    'Prompt cinematográfico para generación de video estilo VEO 3: habitación vacía que se transforma con objetos temáticos, estilo fotorrealista, ángulo amplio fijo, iluminación con acentos, montaje rápido y final sin texto.';

  const shortDescription = 'Prompt cinematográfico fotorrealista para VEO 3 con montaje temático.';

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
  upsertPrompMagicoVeo3();
}

export default upsertPrompMagicoVeo3;


