import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function testResourcesPage() {
  try {
    console.log('🔄 Probando página de recursos...');
    
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar recursos publicados
    const publishedResources = await prisma.resource.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        topics: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    console.log(`✅ Recursos publicados encontrados: ${publishedResources.length}`);
    
    // Mostrar detalles de cada recurso
    publishedResources.forEach((resource, index) => {
      console.log(`\n📋 Recurso ${index + 1}:`);
      console.log(`  - ID: ${resource.id}`);
      console.log(`  - Título: ${resource.title}`);
      console.log(`  - Slug: ${resource.slug}`);
      console.log(`  - Categoría: ${resource.category}`);
      console.log(`  - Tipo: ${resource.type}`);
      console.log(`  - Requiere Auth: ${resource.requiresAuth}`);
      console.log(`  - Es Gratis: ${resource.isFree}`);
      console.log(`  - Rating: ${resource.rating}`);
      console.log(`  - Downloads: ${resource.downloadsCount}`);
      console.log(`  - Topics: ${resource.topics.length}`);
      
      if (resource.topics.length > 0) {
        console.log(`  - Topics:`);
        resource.topics.forEach(topic => {
          console.log(`    * ${topic.title} (${topic.order})`);
        });
      }
    });
    
    // Verificar categorías disponibles
    const categories = await prisma.resource.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED'
      },
      _count: {
        category: true
      }
    });
    
    console.log('\n📂 Categorías disponibles:');
    categories.forEach(cat => {
      console.log(`  - ${cat.category}: ${cat._count.category} recursos`);
    });
    
    // Verificar que los slugs son únicos
    const slugs = publishedResources.map(r => r.slug);
    const uniqueSlugs = new Set(slugs);
    
    if (slugs.length !== uniqueSlugs.size) {
      console.log('⚠️ Advertencia: Hay slugs duplicados');
    } else {
      console.log('✅ Todos los slugs son únicos');
    }
    
    console.log('\n✅ Prueba de página de recursos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba de página de recursos:', error);
    
    if (error instanceof Error) {
      console.error('Detalles del error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

testResourcesPage()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 