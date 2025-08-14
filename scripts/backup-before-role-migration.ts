import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Función para crear backup antes de agregar campo role
async function createBackupBeforeRoleMigration() {
  console.log('🔄 Creando backup antes de agregar campo role...');
  
  // Backup de desarrollo
  console.log('\n=== BACKUP DESARROLLO ===');
  await createBackup('development');
  
  // Backup de producción  
  console.log('\n=== BACKUP PRODUCCIÓN ===');
  await createBackup('production');
}

async function createBackup(environment: 'development' | 'production') {
  // Cargar variables de entorno según el ambiente
  if (environment === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env' });
  }
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(`DATABASE_URL no encontrada para ${environment}`);
  }
  
  console.log(`🔄 Conectando a base de datos de ${environment}...`);
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });
  
  try {
    // Verificar conexión
    await prisma.$queryRaw`SELECT 1`;
    console.log(`✅ Conexión a ${environment} establecida`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = path.join(process.cwd(), 'backups', `role-migration-${environment}`);
    
    // Crear directorio si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log(`🔄 Creando backup de ${environment}...`);
    
    // Obtener datos críticos con enfoque en usuarios
    const [users, courses, webinars, enrollments, userStreaks, subscriptions, payments] = await Promise.all([
      prisma.user.findMany({
        include: {
          enrollments: true,
          userStreaks: true,
          subscriptions: true,
          payments: true,
          achievements: true,
          webinarRegistrations: true
        }
      }),
      prisma.course.findMany({
        include: {
          lessons: true,
          enrollments: true,
          ratings: true,
          comments: true
        }
      }),
      prisma.webinar.findMany({
        include: {
          registrations: true
        }
      }),
      prisma.enrollment.findMany(),
      prisma.userStreak.findMany(),
      prisma.subscription.findMany(),
      prisma.payment.findMany()
    ]);
    
    // Verificar estructura actual de tabla users (antes de agregar role)
    const currentUserSchema = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    const backup = {
      timestamp,
      environment,
      purpose: 'Backup antes de agregar campo role a tabla users',
      database: environment === 'production' ? 'egrow-academy-production' : 'egrow-academy-development',
      currentUserSchema,
      stats: {
        users: users.length,
        courses: courses.length,
        webinars: webinars.length,
        enrollments: enrollments.length,
        userStreaks: userStreaks.length,
        subscriptions: subscriptions.length,
        payments: payments.length
      },
      data: {
        users,
        courses,
        webinars,
        enrollments,
        userStreaks,
        subscriptions,
        payments
      }
    };
    
    // Guardar backup
    const backupFile = path.join(backupDir, `role-migration-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup de ${environment} guardado en: ${backupFile}`);
    console.log(`📊 Estadísticas del backup de ${environment}:`);
    console.log(`  - Usuarios: ${users.length}`);
    console.log(`  - Cursos: ${courses.length}`);
    console.log(`  - Webinars: ${webinars.length}`);
    console.log(`  - Inscripciones: ${enrollments.length}`);
    console.log(`  - Rachas de usuarios: ${userStreaks.length}`);
    console.log(`  - Suscripciones: ${subscriptions.length}`);
    console.log(`  - Pagos: ${payments.length}`);
    
    // Mostrar esquema actual de usuarios
    console.log(`\n📋 Esquema actual de tabla users en ${environment}:`);
    console.table(currentUserSchema);
    
    return { backupFile, stats: backup.stats };
    
  } catch (error) {
    console.error(`❌ Error creando backup de ${environment}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar backup
createBackupBeforeRoleMigration()
  .then(() => {
    console.log('\n🎉 BACKUP COMPLETO ANTES DE MIGRACIÓN DE ROLES');
    console.log('✅ Desarrollo y producción respaldados exitosamente');
    console.log('🚀 Listo para proceder con la migración del campo role');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en backup pre-migración:', err);
    process.exit(1);
  });