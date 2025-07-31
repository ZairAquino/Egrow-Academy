import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Verificar si la tabla courses existe
    const courses = await prisma.course.findMany({
      take: 1
    });
    
    console.log(`✅ Tabla courses encontrada. Cursos en la base de datos: ${courses.length}`);
    
    // Verificar el schema de la tabla
    const courseCount = await prisma.course.count();
    console.log(`📊 Total de cursos en la base de datos: ${courseCount}`);
    
    if (courseCount > 0) {
      const sampleCourse = await prisma.course.findFirst();
      console.log('📋 Ejemplo de curso:', {
        id: sampleCourse?.id,
        title: sampleCourse?.title,
        slug: sampleCourse?.slug,
        status: sampleCourse?.status,
        category: sampleCourse?.category
      });
    }
    
    console.log('✅ Prueba de conexión completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error);
    
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

testConnection()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 