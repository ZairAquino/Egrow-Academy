import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function quickBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Crear directorio si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log('🔄 Creando backup rápido antes de la migración...');
    
    // Obtener todos los datos importantes
    const [courses, users, webinars, events, lessons, enrollments] = await Promise.all([
      prisma.course.findMany(),
      prisma.user.findMany({ select: { id: true, email: true, firstName: true, lastName: true }}),
      prisma.webinar.findMany(),
      prisma.event.findMany(),
      prisma.lesson.findMany(),
      prisma.enrollment.findMany()
    ]);
    
    const backup = {
      timestamp,
      stats: {
        courses: courses.length,
        users: users.length,
        webinars: webinars.length,
        events: events.length,
        lessons: lessons.length,
        enrollments: enrollments.length
      },
      data: {
        courses,
        users,
        webinars,
        events,
        lessons,
        enrollments
      }
    };
    
    // Guardar backup
    const backupFile = path.join(backupDir, `quick-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup guardado en: ${backupFile}`);
    console.log('📊 Resumen del backup:');
    console.log(`  - Cursos: ${courses.length}`);
    console.log(`  - Usuarios: ${users.length}`);
    console.log(`  - Webinars: ${webinars.length}`);
    console.log(`  - Eventos: ${events.length}`);
    console.log(`  - Lecciones: ${lessons.length}`);
    console.log(`  - Inscripciones: ${enrollments.length}`);
    
    return backupFile;
    
  } catch (error) {
    console.error('❌ Error creando backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
quickBackup()
  .then(file => {
    console.log('\n✅ Backup completado:', file);
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error:', err);
    process.exit(1);
  });