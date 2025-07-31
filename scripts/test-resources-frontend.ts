import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function testResourcesFrontend() {
  try {
    console.log('🔄 Probando carga de recursos desde el frontend...');
    
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Simular la carga de recursos como lo hace el hook useResources
    const categories = ['todos', 'WEBINAR', 'MANUAL', 'TUTORIAL', 'PAPER', 'HERRAMIENTA', 'DATASET', 'PODCAST', 'LIBRO'];
    
    for (const category of categories) {
      console.log(`\n🔍 Probando categoría: ${category}`);
      
      const whereClause: any = {
        status: 'PUBLISHED'
      };
      
      if (category !== 'todos') {
        whereClause.category = category;
      }
      
      const resources = await prisma.resource.findMany({
        where: whereClause,
        include: {
          topics: {
            orderBy: {
              order: 'asc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50,
        skip: 0
      });
      
      const totalCount = await prisma.resource.count({
        where: whereClause
      });
      
      console.log(`  ✅ Encontrados: ${resources.length} recursos de ${totalCount} total`);
      
      if (resources.length > 0) {
        console.log(`  📋 Primer recurso: ${resources[0].title}`);
        console.log(`  📝 Topics: ${resources[0].topics.length}`);
      }
    }
    
    // Verificar que todos los recursos tienen los campos necesarios para el frontend
    const allResources = await prisma.resource.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        topics: true
      }
    });
    
    console.log('\n🔍 Verificando campos requeridos por el frontend...');
    
    const requiredFields = ['id', 'title', 'slug', 'category', 'type', 'requiresAuth', 'isFree', 'rating', 'downloadsCount', 'status'];
    const missingFields: string[] = [];
    
    allResources.forEach((resource, index) => {
      const missing = requiredFields.filter(field => !(field in resource));
      if (missing.length > 0) {
        missingFields.push(`Recurso ${index + 1} (${resource.title}): ${missing.join(', ')}`);
      }
    });
    
    if (missingFields.length > 0) {
      console.log('⚠️ Campos faltantes:');
      missingFields.forEach(field => console.log(`  - ${field}`));
    } else {
      console.log('✅ Todos los recursos tienen los campos requeridos');
    }
    
    // Verificar que los slugs son válidos para URLs
    const invalidSlugs = allResources.filter(r => !r.slug || r.slug.includes(' '));
    if (invalidSlugs.length > 0) {
      console.log('⚠️ Slugs inválidos encontrados:');
      invalidSlugs.forEach(r => console.log(`  - ${r.title}: "${r.slug}"`));
    } else {
      console.log('✅ Todos los slugs son válidos');
    }
    
    console.log('\n✅ Prueba de frontend completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba de frontend:', error);
    
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

testResourcesFrontend()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 