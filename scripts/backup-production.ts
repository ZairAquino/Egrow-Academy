import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function backupProduction() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Iniciando backup de producción...');

  try {
    // Intentar conectar a la base de datos de producción
    console.log('🔌 Conectando a la base de datos de producción...');
    
    // Primero intentar con la variable de entorno de producción
    let prodPrisma;
    
    if (process.env.PROD_DATABASE_URL) {
      console.log('✅ Usando PROD_DATABASE_URL');
      prodPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.PROD_DATABASE_URL
          }
        }
      });
    } else {
      console.log('⚠️ No se encontró PROD_DATABASE_URL, intentando con DATABASE_URL');
      prodPrisma = new PrismaClient();
    }

    // Verificar conexión
    await prodPrisma.$connect();
    console.log('✅ Conexión exitosa a producción\n');

    const prodBackupPath = path.join(backupDir, `prod-backup-${timestamp}.json`);
    
    // Hacer backup de todos los datos importantes
    const prodData = {
      users: await prodPrisma.user.findMany(),
      courses: await prodPrisma.course.findMany(),
      lessons: await prodPrisma.lesson.findMany(),
      enrollments: await prodPrisma.enrollment.findMany(),
      courseProgress: await prodPrisma.courseProgress.findMany(),
      lessonProgress: await prodPrisma.lessonProgress.findMany(),
      webinars: await prodPrisma.webinar.findMany(),
      webinarRegistrations: await prodPrisma.webinarRegistration.findMany(),
      resources: await prodPrisma.resource.findMany(),
      promotions: await prodPrisma.promotion.findMany(),
      payments: await prodPrisma.payment.findMany(),
      subscriptions: await prodPrisma.subscription.findMany()
    };

    fs.writeFileSync(prodBackupPath, JSON.stringify(prodData, null, 2));
    console.log(`✅ Backup de producción guardado en: ${prodBackupPath}`);

    // Mostrar estadísticas
    console.log('\n📊 Estadísticas del backup de producción:');
    console.log(`Usuarios: ${prodData.users.length}`);
    console.log(`Cursos: ${prodData.courses.length}`);
    console.log(`Lecciones: ${prodData.lessons.length}`);
    console.log(`Inscripciones: ${prodData.enrollments.length}`);
    console.log(`Progreso de cursos: ${prodData.courseProgress.length}`);
    console.log(`Progreso de lecciones: ${prodData.lessonProgress.length}`);
    console.log(`Webinars: ${prodData.webinars.length}`);
    console.log(`Registros de webinars: ${prodData.webinarRegistrations.length}`);
    console.log(`Recursos: ${prodData.resources.length}`);
    console.log(`Promociones: ${prodData.promotions.length}`);
    console.log(`Pagos: ${prodData.payments.length}`);
    console.log(`Suscripciones: ${prodData.subscriptions.length}`);

    await prodPrisma.$disconnect();
    console.log('\n🎉 Backup de producción completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el backup de producción:', error);
    console.log('\n💡 Si no tienes configurada la URL de producción, puedes:');
    console.log('1. Agregar PROD_DATABASE_URL a tu archivo .env');
    console.log('2. O ejecutar el script después de configurar la conexión');
  }
}

backupProduction().catch(console.error); 