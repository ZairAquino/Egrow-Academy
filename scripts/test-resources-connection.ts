import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function testResourcesConnection() {
  try {
    console.log('🔄 Probando conexión de recursos...');
    
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la tabla resources existe
    const resources = await prisma.resource.findMany({
      where: {
        status: 'PUBLISHED'
      },
      take: 5
    });
    
    console.log(`✅ Tabla resources encontrada. Recursos publicados: ${resources.length}`);
    
    // Verificar el schema de la tabla
    const resourceCount = await prisma.resource.count();
    console.log(`📊 Total de recursos en la base de datos: ${resourceCount}`);
    
    if (resources.length > 0) {
      const sampleResource = resources[0];
      console.log('📋 Ejemplo de recurso:', {
        id: sampleResource.id,
        title: sampleResource.title,
        category: sampleResource.category,
        status: sampleResource.status,
        type: sampleResource.type
      });
      
      // Verificar topics del recurso
      const topics = await prisma.resourceTopic.findMany({
        where: {
          resourceId: sampleResource.id
        }
      });
      
      console.log(`📝 Topics del recurso: ${topics.length}`);
    }
    
    // Verificar categorías disponibles
    const categories = await prisma.resource.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });
    
    console.log('📂 Categorías de recursos disponibles:');
    categories.forEach(cat => {
      console.log(`  - ${cat.category}: ${cat._count.category} recursos`);
    });
    
    console.log('✅ Prueba de conexión de recursos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión de recursos:', error);
    
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

testResourcesConnection()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 