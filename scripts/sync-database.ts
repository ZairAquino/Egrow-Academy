import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function syncDatabase() {
  try {
    console.log('🔄 Sincronizando base de datos con el schema...');
    
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Ejecutar migración push
    const { execSync } = require('child_process');
    
    console.log('📝 Ejecutando prisma db push...');
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('✅ Base de datos sincronizada exitosamente');
    
    // Verificar que la tabla courses ahora tiene la columna category
    const courses = await prisma.course.findMany({
      take: 1
    });
    
    console.log(`✅ Tabla courses verificada. Cursos encontrados: ${courses.length}`);
    
    if (courses.length > 0) {
      const course = courses[0];
      console.log('📋 Ejemplo de curso con nueva estructura:', {
        id: course.id,
        title: course.title,
        category: course.category,
        status: course.status
      });
    }
    
  } catch (error) {
    console.error('❌ Error sincronizando la base de datos:', error);
    
    if (error instanceof Error) {
      console.error('Detalles del error:', {
        message: error.message,
        name: error.name
      });
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

syncDatabase()
  .then(() => {
    console.log('✅ Script de sincronización completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 