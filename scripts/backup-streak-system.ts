import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

interface StreakSystemBackup {
  metadata: {
    backupDate: string;
    description: string;
    version: string;
    tables: string[];
  };
  data: {
    userStreaks: any[];
    userWeeklyHistory: any[];
    userStreakBadges: any[];
    userPointsHistory: any[];
    streakRecoveryHistory: any[];
    weeklyLessonCompletions: any[];
  };
  schema: {
    enums: string[];
    relationships: string[];
  };
}

async function backupStreakSystem() {
  try {
    console.log('🏆 INICIANDO BACKUP DEL SISTEMA DE RACHAS');
    console.log('📅 Fecha:', new Date().toISOString());
    console.log('');

    // 1. Contar registros en cada tabla
    console.log('📊 Contando registros en tablas de rachas...');
    
    const counts = {
      userStreaks: await prisma.userStreak.count(),
      userWeeklyHistory: await prisma.userWeeklyHistory.count(),
      userStreakBadges: await prisma.userStreakBadge.count(),
      userPointsHistory: await prisma.userPointsHistory.count(),
      streakRecoveryHistory: await prisma.streakRecoveryHistory.count(),
      weeklyLessonCompletions: await prisma.weeklyLessonCompletion.count()
    };

    console.log('   📋 Registros encontrados:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`      - ${table}: ${count} registros`);
    });
    console.log('');

    // 2. Extraer datos de todas las tablas
    console.log('💾 Extrayendo datos del sistema de rachas...');
    
    const userStreaks = await prisma.userStreak.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log(`   ✅ userStreaks: ${userStreaks.length} registros`);

    const userWeeklyHistory = await prisma.userWeeklyHistory.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log(`   ✅ userWeeklyHistory: ${userWeeklyHistory.length} registros`);

    const userStreakBadges = await prisma.userStreakBadge.findMany({
      orderBy: { earnedAt: 'asc' }
    });
    console.log(`   ✅ userStreakBadges: ${userStreakBadges.length} registros`);

    const userPointsHistory = await prisma.userPointsHistory.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log(`   ✅ userPointsHistory: ${userPointsHistory.length} registros`);

    const streakRecoveryHistory = await prisma.streakRecoveryHistory.findMany({
      orderBy: { recoveredAt: 'asc' }
    });
    console.log(`   ✅ streakRecoveryHistory: ${streakRecoveryHistory.length} registros`);

    const weeklyLessonCompletions = await prisma.weeklyLessonCompletion.findMany({
      orderBy: { createdAt: 'asc' }
    });
    console.log(`   ✅ weeklyLessonCompletions: ${weeklyLessonCompletions.length} registros`);
    console.log('');

    // 3. Crear estructura del backup
    const backup: StreakSystemBackup = {
      metadata: {
        backupDate: new Date().toISOString(),
        description: 'Backup completo del sistema de rachas semanales - Egrow Academy',
        version: '1.0.0',
        tables: [
          'user_streaks',
          'user_weekly_history', 
          'user_streak_badges',
          'user_points_history',
          'streak_recovery_history',
          'weekly_lesson_completions'
        ]
      },
      data: {
        userStreaks,
        userWeeklyHistory,
        userStreakBadges,
        userPointsHistory,
        streakRecoveryHistory,
        weeklyLessonCompletions
      },
      schema: {
        enums: [
          'StreakBadgeLevel: PRINCIPIANTE, ESTUDIANTE, DEDICADO, EN_LLAMAS, IMPARABLE, MAESTRO, LEYENDA',
          'PointTransactionType: WEEKLY_GOAL, BONUS_LESSONS, DIVERSITY_BONUS, STREAK_BONUS, RECOVERY_SPENT, ADMIN_ADJUSTMENT'
        ],
        relationships: [
          'UserStreak -> User (userId)',
          'UserWeeklyHistory -> User (userId)',
          'UserStreakBadge -> User (userId)',
          'UserPointsHistory -> User (userId)',
          'StreakRecoveryHistory -> User (userId)',
          'WeeklyLessonCompletion -> User (userId)',
          'WeeklyLessonCompletion -> Course (courseId)'
        ]
      }
    };

    // 4. Crear directorio de backups si no existe
    const backupsDir = path.join(process.cwd(), 'backups', 'streak-system');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
      console.log('📁 Directorio de backups creado:', backupsDir);
    }

    // 5. Generar nombre del archivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `streak-system-backup-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);

    // 6. Guardar backup
    console.log('💾 Guardando backup...');
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');
    
    // 7. Verificar tamaño del archivo
    const stats = fs.statSync(filepath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    
    console.log('');
    console.log('✅ BACKUP DEL SISTEMA DE RACHAS COMPLETADO');
    console.log('📁 Archivo:', filename);
    console.log('📂 Ubicación:', filepath);
    console.log('📏 Tamaño:', fileSizeInMB, 'MB');
    console.log('📊 Total de registros respaldados:', 
      Object.values(counts).reduce((sum, count) => sum + count, 0));
    console.log('');

    // 8. Crear backup adicional de la configuración
    const configBackup = {
      metadata: {
        backupDate: new Date().toISOString(),
        description: 'Configuración y archivos del sistema de rachas',
        type: 'configuration'
      },
      files: {
        'src/lib/streaks.ts': 'Lógica principal del sistema de rachas',
        'src/components/streaks/StreakDisplay.tsx': 'Componente visual de rachas',
        'src/hooks/useStreaks.ts': 'Hook React para rachas',
        'src/app/api/streaks/route.ts': 'API endpoint de rachas',
        'scripts/test-streaks-system.ts': 'Script de pruebas del sistema',
        'scripts/test-streaks-integration.ts': 'Script de pruebas de integración',
        'docs/SISTEMA-RACHAS-EXTENSIONES-FUTURAS.md': 'Documentación de extensiones'
      },
      integration: {
        modifiedFiles: [
          'src/app/api/courses/progress/route.ts - líneas 394-403',
          'src/components/auth/UserProfile.tsx - líneas 189-190',
          'src/app/globals.css - estilos de rachas líneas 2814-2983',
          'prisma/schema.prisma - 6 nuevos modelos y 2 enums'
        ]
      },
      features: {
        weeklyGoal: '5 lecciones por semana (lunes-domingo)',
        pointsSystem: '5 puntos base + bonificaciones',
        badgeLevels: '7 niveles (PRINCIPIANTE a LEYENDA)',
        recoverySystem: 'Usar puntos para recuperar rachas perdidas',
        tracking: 'Progreso automático al completar lecciones'
      }
    };

    const configFilename = `streak-system-config-${timestamp}.json`;
    const configFilepath = path.join(backupsDir, configFilename);
    fs.writeFileSync(configFilepath, JSON.stringify(configBackup, null, 2), 'utf-8');
    
    console.log('⚙️ Backup de configuración guardado:', configFilename);
    console.log('');
    console.log('🎯 RESUMEN DEL SISTEMA DE RACHAS RESPALDADO:');
    console.log('   📚 Meta semanal: 5 lecciones');
    console.log('   🏆 Badges: 7 niveles disponibles');
    console.log('   💰 Puntos: Sistema completo implementado');
    console.log('   🔄 Recuperación: Sistema de puntos para restaurar rachas');
    console.log('   📱 UI: Componente integrado en dropdown de usuario');
    console.log('   🔗 API: Endpoint /api/streaks funcional');
    console.log('   ⚡ Integración: Automática con progreso de lecciones');

  } catch (error) {
    console.error('❌ ERROR durante el backup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar backup
backupStreakSystem();