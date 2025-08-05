import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function backupProductionSafe() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Iniciando backup seguro de producción...');

  try {
    console.log('🔌 Conectando a la base de datos de producción...');
    
    const prodPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PROD_DATABASE_URL
        }
      }
    });

    await prodPrisma.$connect();
    console.log('✅ Conexión exitosa a producción\n');

    const prodBackupPath = path.join(backupDir, `prod-safe-backup-${timestamp}.json`);
    
    // Hacer backup solo de las tablas que sabemos que existen
    const prodData: any = {};

    // Verificar y hacer backup de usuarios
    try {
      prodData.users = await prodPrisma.user.findMany();
      console.log(`✅ Usuarios: ${prodData.users.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a usuarios:', error.message);
      prodData.users = [];
    }

    // Verificar y hacer backup de cursos
    try {
      prodData.courses = await prodPrisma.course.findMany();
      console.log(`✅ Cursos: ${prodData.courses.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a cursos:', error.message);
      prodData.courses = [];
    }

    // Verificar y hacer backup de lecciones
    try {
      prodData.lessons = await prodPrisma.lesson.findMany();
      console.log(`✅ Lecciones: ${prodData.lessons.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a lecciones:', error.message);
      prodData.lessons = [];
    }

    // Verificar y hacer backup de inscripciones
    try {
      prodData.enrollments = await prodPrisma.enrollment.findMany();
      console.log(`✅ Inscripciones: ${prodData.enrollments.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a inscripciones:', error.message);
      prodData.enrollments = [];
    }

    // Verificar y hacer backup de progreso de cursos
    try {
      prodData.courseProgress = await prodPrisma.courseProgress.findMany();
      console.log(`✅ Progreso de cursos: ${prodData.courseProgress.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a progreso de cursos:', error.message);
      prodData.courseProgress = [];
    }

    // Verificar y hacer backup de progreso de lecciones
    try {
      prodData.lessonProgress = await prodPrisma.lessonProgress.findMany();
      console.log(`✅ Progreso de lecciones: ${prodData.lessonProgress.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a progreso de lecciones:', error.message);
      prodData.lessonProgress = [];
    }

    // Verificar y hacer backup de webinars (puede que no exista)
    try {
      prodData.webinars = await prodPrisma.webinar.findMany();
      console.log(`✅ Webinars: ${prodData.webinars.length} registros`);
    } catch (error) {
      console.log('⚠️ Tabla de webinars no existe en producción');
      prodData.webinars = [];
    }

    // Verificar y hacer backup de registros de webinars (puede que no exista)
    try {
      prodData.webinarRegistrations = await prodPrisma.webinarRegistration.findMany();
      console.log(`✅ Registros de webinars: ${prodData.webinarRegistrations.length} registros`);
    } catch (error) {
      console.log('⚠️ Tabla de registros de webinars no existe en producción');
      prodData.webinarRegistrations = [];
    }

    // Verificar y hacer backup de recursos
    try {
      prodData.resources = await prodPrisma.resource.findMany();
      console.log(`✅ Recursos: ${prodData.resources.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a recursos:', error.message);
      prodData.resources = [];
    }

    // Verificar y hacer backup de promociones
    try {
      prodData.promotions = await prodPrisma.promotion.findMany();
      console.log(`✅ Promociones: ${prodData.promotions.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a promociones:', error.message);
      prodData.promotions = [];
    }

    // Verificar y hacer backup de pagos
    try {
      prodData.payments = await prodPrisma.payment.findMany();
      console.log(`✅ Pagos: ${prodData.payments.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a pagos:', error.message);
      prodData.payments = [];
    }

    // Verificar y hacer backup de suscripciones
    try {
      prodData.subscriptions = await prodPrisma.subscription.findMany();
      console.log(`✅ Suscripciones: ${prodData.subscriptions.length} registros`);
    } catch (error) {
      console.log('❌ Error accediendo a suscripciones:', error.message);
      prodData.subscriptions = [];
    }

    fs.writeFileSync(prodBackupPath, JSON.stringify(prodData, null, 2));
    console.log(`\n✅ Backup de producción guardado en: ${prodBackupPath}`);

    // Mostrar estadísticas finales
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
    console.log('\n🎉 Backup seguro de producción completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el backup de producción:', error);
  }
}

backupProductionSafe().catch(console.error); 