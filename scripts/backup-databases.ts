import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups');
  
  // Crear directorio de backups si no existe
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Iniciando backup de bases de datos...');

  try {
    // Backup de desarrollo
    console.log('📦 Creando backup de desarrollo...');
    const devBackupPath = path.join(backupDir, `dev-backup-${timestamp}.json`);
    
    const devPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    const devData = await getAllData(devPrisma);
    fs.writeFileSync(devBackupPath, JSON.stringify(devData, null, 2));
    console.log(`✅ Backup de desarrollo guardado en: ${devBackupPath}`);

    await devPrisma.$disconnect();

    // Backup de producción
    console.log('📦 Creando backup de producción...');
    const prodBackupPath = path.join(backupDir, `prod-backup-${timestamp}.json`);
    
    const prodPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PROD_DATABASE_URL
        }
      }
    });

    const prodData = await getAllData(prodPrisma);
    fs.writeFileSync(prodBackupPath, JSON.stringify(prodData, null, 2));
    console.log(`✅ Backup de producción guardado en: ${prodBackupPath}`);

    await prodPrisma.$disconnect();

    console.log('🎉 Backup completado exitosamente');
    
    // Mostrar estadísticas
    console.log('\n📊 Estadísticas de los backups:');
    console.log(`Desarrollo: ${Object.keys(devData).length} tablas`);
    console.log(`Producción: ${Object.keys(prodData).length} tablas`);

  } catch (error) {
    console.error('❌ Error durante el backup:', error);
    process.exit(1);
  }
}

async function getAllData(prisma: PrismaClient) {
  const data: any = {};

  // Obtener todos los datos de las tablas principales
  const tables = [
    'user', 'session', 'course', 'lesson', 'enrollment', 'courseProgress', 
    'lessonProgress', 'comment', 'like', 'payment', 'subscription', 'product', 
    'price', 'resource', 'resourceTopic', 'resourceAccessLog', 'event', 
    'eventRegistration', 'rating', 'securityLog', 'promotion', 'promotionInteraction', 
    'userBehavior', 'userPreference', 'recommendation', 'achievement', 'userStreak', 
    'weeklyLessonCompletion', 'userStreakBadge', 'userPointsHistory', 'streakRecoveryHistory',
    'webinar', 'webinarRegistration'
  ];

  for (const table of tables) {
    try {
      // @ts-ignore - Acceso dinámico a las tablas
      const tableData = await prisma[table].findMany();
      data[table] = tableData;
      console.log(`  ✅ ${table}: ${tableData.length} registros`);
    } catch (error) {
      console.log(`  ⚠️ ${table}: No disponible o vacía`);
      data[table] = [];
    }
  }

  return data;
}

backupDatabase().catch(console.error); 