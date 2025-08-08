import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'fs';
import { join } from 'path';

// URL de base de datos de producción
const DATABASE_URL = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

/**
 * Script para crear backup completo de la base de datos de producción
 * Esto nos permite restaurar en caso de cualquier problema
 */

async function createProductionBackup() {
  try {
    console.log('🔒 CREANDO BACKUP DE LA BASE DE DATOS DE PRODUCCIÓN...');
    console.log('🌐 Base de datos: ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech');
    console.log('📅 Fecha:', new Date().toISOString());
    
    const backupData = {
      timestamp: new Date().toISOString(),
      database: 'production',
      tables: {} as any
    };

    // Backup de Users
    console.log('👤 Respaldando usuarios...');
    const users = await prisma.user.findMany({
      include: {
        enrollments: true,
        webinarRegistrations: true,
        userStreaks: true
      }
    });
    backupData.tables.users = users;
    console.log(`✅ ${users.length} usuarios respaldados`);

    // Backup de Courses
    console.log('📚 Respaldando cursos...');
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
        enrollments: true
      }
    });
    backupData.tables.courses = courses;
    console.log(`✅ ${courses.length} cursos respaldados`);

    // Backup de Webinars
    console.log('🎯 Respaldando webinars...');
    const webinars = await prisma.webinar.findMany({
      include: {
        registrations: true
      }
    });
    backupData.tables.webinars = webinars;
    console.log(`✅ ${webinars.length} webinars respaldados`);

    // Backup de Categories
    console.log('🏷️ Respaldando categorías...');
    const categories = await prisma.category.findMany();
    backupData.tables.categories = categories;
    console.log(`✅ ${categories.length} categorías respaldadas`);

    // Backup de Resources
    console.log('📎 Respaldando recursos...');
    const resources = await prisma.resource.findMany();
    backupData.tables.resources = resources;
    console.log(`✅ ${resources.length} recursos respaldados`);

    // Backup de Enrollments
    console.log('📝 Respaldando inscripciones...');
    const enrollments = await prisma.enrollment.findMany();
    backupData.tables.enrollments = enrollments;
    console.log(`✅ ${enrollments.length} inscripciones respaldadas`);

    // Backup de Lessons
    console.log('📖 Respaldando lecciones...');
    const lessons = await prisma.lesson.findMany({
      include: {
        resources: true
      }
    });
    backupData.tables.lessons = lessons;
    console.log(`✅ ${lessons.length} lecciones respaldadas`);

    // Backup de Modules
    console.log('📂 Respaldando módulos...');
    const modules = await prisma.module.findMany();
    backupData.tables.modules = modules;
    console.log(`✅ ${modules.length} módulos respaldados`);

    // Crear archivo de backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-production-${timestamp}.json`;
    const backupPath = join(process.cwd(), 'backups', backupFileName);
    
    // Asegurar que existe el directorio backups
    const fs = require('fs');
    const backupsDir = join(process.cwd(), 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Guardar backup
    writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ¡BACKUP COMPLETADO EXITOSAMENTE!');
    console.log(`📁 Archivo: ${backupFileName}`);
    console.log(`📍 Ubicación: ${backupPath}`);
    console.log(`💾 Tamaño: ${(fs.statSync(backupPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Resumen del backup
    console.log('\n📊 RESUMEN DEL BACKUP:');
    console.log(`👤 Usuarios: ${users.length}`);
    console.log(`📚 Cursos: ${courses.length}`);
    console.log(`🎯 Webinars: ${webinars.length}`);
    console.log(`🏷️ Categorías: ${categories.length}`);
    console.log(`📎 Recursos: ${resources.length}`);
    console.log(`📝 Inscripciones: ${enrollments.length}`);
    console.log(`📖 Lecciones: ${lessons.length}`);
    console.log(`📂 Módulos: ${modules.length}`);
    
    console.log('\n🔒 El backup está listo para ser usado en caso de emergencia.');
    
    return backupPath;

  } catch (error) {
    console.error('❌ Error creando backup de producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar backup
createProductionBackup()
  .then((backupPath) => {
    console.log(`\n🏁 Backup de producción completado: ${backupPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal en backup:', error);
    process.exit(1);
  });