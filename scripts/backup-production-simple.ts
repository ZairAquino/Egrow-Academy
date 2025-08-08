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
 * Script para crear backup simplificado de las tablas principales
 */

async function createSimpleProductionBackup() {
  try {
    console.log('🔒 CREANDO BACKUP SIMPLIFICADO DE PRODUCCIÓN...');
    console.log('🌐 Base de datos: ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech');
    console.log('📅 Fecha:', new Date().toISOString());
    
    const backupData = {
      timestamp: new Date().toISOString(),
      database: 'production',
      tables: {} as any
    };

    // Backup básico de tablas principales
    console.log('👤 Respaldando usuarios...');
    const users = await prisma.user.findMany();
    backupData.tables.users = users;
    console.log(`✅ ${users.length} usuarios respaldados`);

    console.log('📚 Respaldando cursos...');
    const courses = await prisma.course.findMany();
    backupData.tables.courses = courses;
    console.log(`✅ ${courses.length} cursos respaldados`);

    console.log('📖 Respaldando lecciones...');
    const lessons = await prisma.lesson.findMany();
    backupData.tables.lessons = lessons;
    console.log(`✅ ${lessons.length} lecciones respaldadas`);

    console.log('📂 Saltando módulos (tabla no disponible)...');

    console.log('🎯 Respaldando webinars...');
    const webinars = await prisma.webinar.findMany();
    backupData.tables.webinars = webinars;
    console.log(`✅ ${webinars.length} webinars respaldados`);

    console.log('📧 Respaldando registros de webinars...');
    const webinarRegistrations = await prisma.webinarRegistration.findMany();
    backupData.tables.webinarRegistrations = webinarRegistrations;
    console.log(`✅ ${webinarRegistrations.length} registros de webinars respaldados`);

    console.log('📝 Respaldando inscripciones...');
    const enrollments = await prisma.enrollment.findMany();
    backupData.tables.enrollments = enrollments;
    console.log(`✅ ${enrollments.length} inscripciones respaldadas`);

    console.log('📎 Respaldando recursos...');
    const resources = await prisma.resource.findMany();
    backupData.tables.resources = resources;
    console.log(`✅ ${resources.length} recursos respaldados`);

    // Crear archivo de backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-production-simple-${timestamp}.json`;
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
    console.log('✅ ¡BACKUP SIMPLIFICADO COMPLETADO!');
    console.log(`📁 Archivo: ${backupFileName}`);
    console.log(`📍 Ubicación: ${backupPath}`);
    console.log(`💾 Tamaño: ${(fs.statSync(backupPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Resumen del backup
    console.log('\n📊 RESUMEN DEL BACKUP:');
    console.log(`👤 Usuarios: ${users.length}`);
    console.log(`📚 Cursos: ${courses.length}`);
    console.log(`📖 Lecciones: ${lessons.length}`);
    console.log(`🎯 Webinars: ${webinars.length}`);
    console.log(`📧 Registros webinars: ${webinarRegistrations.length}`);
    console.log(`📝 Inscripciones: ${enrollments.length}`);
    console.log(`📎 Recursos: ${resources.length}`);
    
    console.log('\n🔒 El backup está listo. Ahora puedes proceder con la migración del curso.');
    
    return backupPath;

  } catch (error) {
    console.error('❌ Error creando backup simplificado:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar backup
createSimpleProductionBackup()
  .then((backupPath) => {
    console.log(`\n🏁 Backup de producción completado: ${backupPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal en backup:', error);
    process.exit(1);
  });