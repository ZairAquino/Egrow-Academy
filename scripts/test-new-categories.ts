import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewCategories() {
  try {
    console.log('🧪 Probando las nuevas categorías de recursos...\n');

    // Verificar que las categorías existen en el enum
    console.log('📋 Categorías disponibles en ResourceCategory:');
    const categories = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::"ResourceCategory")) as category;
    `;
    console.log(categories);

    // Crear un recurso de prueba con la nueva categoría
    console.log('\n📝 Creando recurso de prueba con categoría ULTIMO_WEBINAR...');
    const testResource = await prisma.resource.create({
      data: {
        title: 'Test - Último Webinar',
        slug: 'test-ultimo-webinar',
        description: 'Recurso de prueba para la categoría Último Webinar',
        category: 'ULTIMO_WEBINAR',
        type: 'VIDEO',
        author: 'eGrow Academy',
        requiresAuth: true,
        isFree: false,
        status: 'PUBLISHED'
      }
    });
    console.log('✅ Recurso creado:', testResource.title);

    // Crear otro recurso con la categoría EN_VIVO
    console.log('\n📝 Creando recurso de prueba con categoría EN_VIVO...');
    const testResource2 = await prisma.resource.create({
      data: {
        title: 'Test - En Vivo',
        slug: 'test-en-vivo',
        description: 'Recurso de prueba para la categoría En Vivo',
        category: 'EN_VIVO',
        type: 'VIDEO',
        author: 'eGrow Academy',
        requiresAuth: true,
        isFree: false,
        status: 'PUBLISHED'
      }
    });
    console.log('✅ Recurso creado:', testResource2.title);

    // Verificar que los recursos se crearon correctamente
    console.log('\n🔍 Verificando recursos creados...');
    const createdResources = await prisma.resource.findMany({
      where: {
        OR: [
          { category: 'ULTIMO_WEBINAR' },
          { category: 'EN_VIVO' }
        ]
      },
      select: {
        id: true,
        title: true,
        category: true,
        status: true
      }
    });

    console.log('📊 Recursos con nuevas categorías:');
    createdResources.forEach(resource => {
      console.log(`  - ${resource.title} (${resource.category})`);
    });

    console.log('\n✅ Prueba completada exitosamente!');
    console.log('🎨 Las nuevas categorías están listas para usar:');
    console.log('   - ULTIMO_WEBINAR: Azul (bg-blue-500 text-white)');
    console.log('   - EN_VIVO: Rojo (bg-red-500 text-white)');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewCategories(); 