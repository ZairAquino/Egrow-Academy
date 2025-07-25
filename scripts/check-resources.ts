import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkResources() {
  try {
    console.log('🔍 [CHECK-RESOURCES] Verificando recursos en la base de datos...');

    const resources = await prisma.resource.findMany({
      include: {
        topics: true,
        _count: {
          select: {
            accessLogs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ [CHECK-RESOURCES] Total de recursos encontrados: ${resources.length}`);

    if (resources.length === 0) {
      console.log('❌ [CHECK-RESOURCES] No hay recursos en la base de datos');
    } else {
      console.log('\n📋 [CHECK-RESOURCES] Lista de recursos:');
      resources.forEach((resource, index) => {
        console.log(`\n${index + 1}. ${resource.title}`);
        console.log(`   - ID: ${resource.id}`);
        console.log(`   - Slug: ${resource.slug}`);
        console.log(`   - Categoría: ${resource.category}`);
        console.log(`   - Tipo: ${resource.type}`);
        console.log(`   - Estado: ${resource.status}`);
        console.log(`   - Es gratuito: ${resource.isFree}`);
        console.log(`   - Requiere auth: ${resource.requiresAuth}`);
        console.log(`   - Temas: ${resource.topics.length}`);
        console.log(`   - Accesos: ${resource._count.accessLogs}`);
      });
    }

  } catch (error) {
    console.error('❌ [CHECK-RESOURCES] Error al verificar recursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResources();