import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function backupSpecificData() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Iniciando backup específico de datos...');

  try {
    // Backup de desarrollo
    console.log('📦 Creando backup de desarrollo...');
    const devBackupPath = path.join(backupDir, `dev-specific-backup-${timestamp}.json`);
    
    const devPrisma = new PrismaClient();

    const devData = {
      courses: await devPrisma.course.findMany(),
      lessons: await devPrisma.lesson.findMany(),
      webinars: await devPrisma.webinar.findMany(),
      webinarRegistrations: await devPrisma.webinarRegistration.findMany(),
      resources: await devPrisma.resource.findMany(),
      promotions: await devPrisma.promotion.findMany()
    };

    fs.writeFileSync(devBackupPath, JSON.stringify(devData, null, 2));
    console.log(`✅ Backup de desarrollo guardado en: ${devBackupPath}`);

    // Mostrar estadísticas
    console.log('\n📊 Estadísticas del backup de desarrollo:');
    console.log(`Cursos: ${devData.courses.length}`);
    console.log(`Lecciones: ${devData.lessons.length}`);
    console.log(`Webinars: ${devData.webinars.length}`);
    console.log(`Registros de webinars: ${devData.webinarRegistrations.length}`);
    console.log(`Recursos: ${devData.resources.length}`);
    console.log(`Promociones: ${devData.promotions.length}`);

    await devPrisma.$disconnect();

    // Backup de producción (si existe la variable de entorno)
    if (process.env.PROD_DATABASE_URL) {
      console.log('\n📦 Creando backup de producción...');
      const prodBackupPath = path.join(backupDir, `prod-specific-backup-${timestamp}.json`);
      
      const prodPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.PROD_DATABASE_URL
          }
        }
      });

      const prodData = {
        courses: await prodPrisma.course.findMany(),
        lessons: await prodPrisma.lesson.findMany(),
        webinars: await prodPrisma.webinar.findMany(),
        webinarRegistrations: await prodPrisma.webinarRegistration.findMany(),
        resources: await prodPrisma.resource.findMany(),
        promotions: await prodPrisma.promotion.findMany()
      };

      fs.writeFileSync(prodBackupPath, JSON.stringify(prodData, null, 2));
      console.log(`✅ Backup de producción guardado en: ${prodBackupPath}`);

      console.log('\n📊 Estadísticas del backup de producción:');
      console.log(`Cursos: ${prodData.courses.length}`);
      console.log(`Lecciones: ${prodData.lessons.length}`);
      console.log(`Webinars: ${prodData.webinars.length}`);
      console.log(`Registros de webinars: ${prodData.webinarRegistrations.length}`);
      console.log(`Recursos: ${prodData.resources.length}`);
      console.log(`Promociones: ${prodData.promotions.length}`);

      await prodPrisma.$disconnect();
    } else {
      console.log('⚠️ No se encontró PROD_DATABASE_URL, saltando backup de producción');
    }

    console.log('\n🎉 Backup específico completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    process.exit(1);
  }
}

backupSpecificData().catch(console.error); 