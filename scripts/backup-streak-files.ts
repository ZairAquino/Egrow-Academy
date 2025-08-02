import * as fs from 'fs';
import * as path from 'path';
import { BACKUP_CONFIG, getBackupPath, generateBackupFilename, ensureBackupDirectories } from './backup-config';

interface FileBackup {
  metadata: {
    backupDate: string;
    description: string;
    totalFiles: number;
  };
  files: Record<string, {
    content: string;
    size: number;
    lastModified: string;
    description: string;
  }>;
}

async function backupStreakFiles() {
  try {
    console.log('📁 INICIANDO BACKUP DE ARCHIVOS DEL SISTEMA DE RACHAS');
    console.log('📅 Fecha:', new Date().toISOString());
    console.log('');

    const filesToBackup = [
      {
        path: 'src/lib/streaks.ts',
        description: 'Lógica principal del sistema de rachas (550+ líneas)'
      },
      {
        path: 'src/components/streaks/StreakDisplay.tsx',
        description: 'Componente React para mostrar rachas en UI'
      },
      {
        path: 'src/hooks/useStreaks.ts',
        description: 'Hook React para gestionar estado de rachas'
      },
      {
        path: 'src/app/api/streaks/route.ts',
        description: 'API endpoint para obtener estadísticas de rachas'
      },
      {
        path: 'scripts/test-streaks-system.ts',
        description: 'Script de pruebas del sistema de rachas'
      },
      {
        path: 'scripts/test-streaks-integration.ts',
        description: 'Script de pruebas de integración con API existente'
      },
      {
        path: 'docs/SISTEMA-RACHAS-EXTENSIONES-FUTURAS.md',
        description: 'Documentación de extensiones futuras del sistema'
      },
      {
        path: 'scripts/test-goal-completion.ts',
        description: 'Script de prueba para completar meta semanal'
      }
    ];

    const backup: FileBackup = {
      metadata: {
        backupDate: new Date().toISOString(),
        description: 'Backup completo de archivos del sistema de rachas - Egrow Academy',
        totalFiles: filesToBackup.length
      },
      files: {}
    };

    console.log('📂 Respaldando archivos del sistema de rachas...');

    for (const fileInfo of filesToBackup) {
      const fullPath = path.join(process.cwd(), fileInfo.path);
      
      try {
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const stats = fs.statSync(fullPath);
          
          backup.files[fileInfo.path] = {
            content,
            size: stats.size,
            lastModified: stats.mtime.toISOString(),
            description: fileInfo.description
          };
          
          console.log(`   ✅ ${fileInfo.path} (${(stats.size / 1024).toFixed(1)} KB)`);
        } else {
          console.log(`   ⚠️ ${fileInfo.path} - archivo no encontrado`);
        }
      } catch (error) {
        console.log(`   ❌ ${fileInfo.path} - error: ${error}`);
      }
    }

    // Usar directorio estándar de backups
    await ensureBackupDirectories();
    const backupsDir = getBackupPath(BACKUP_CONFIG.SUBDIRS.STREAK_SYSTEM);

    // Guardar backup de archivos usando configuración estándar
    const filename = generateBackupFilename('streak-files-backup-{timestamp}') + '.json';
    const filepath = path.join(backupsDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

    // Estadísticas del backup
    const stats = fs.statSync(filepath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    const totalLines = Object.values(backup.files)
      .reduce((total, file) => total + file.content.split('\n').length, 0);

    console.log('');
    console.log('✅ BACKUP DE ARCHIVOS COMPLETADO');
    console.log('📁 Archivo:', filename);
    console.log('📂 Ubicación:', filepath);
    console.log('📏 Tamaño:', fileSizeInMB, 'MB');
    console.log('📊 Archivos respaldados:', Object.keys(backup.files).length);
    console.log('📝 Total de líneas de código:', totalLines.toLocaleString());

    // Crear también backup del schema de Prisma (solo las partes relevantes)
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
      
      // Extraer solo las partes del schema relacionadas con rachas
      const streakModels = [
        'enum StreakBadgeLevel',
        'enum PointTransactionType',
        'model UserStreak',
        'model UserWeeklyHistory',
        'model UserStreakBadge',
        'model UserPointsHistory',
        'model StreakRecoveryHistory',
        'model WeeklyLessonCompletion'
      ];

      const schemaBackup = {
        metadata: {
          backupDate: new Date().toISOString(),
          description: 'Esquema de base de datos para sistema de rachas',
          models: streakModels.length
        },
        fullSchema: schemaContent,
        streakRelatedModels: streakModels.map(modelName => {
          const startPattern = new RegExp(`^${modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gm');
          const match = schemaContent.match(startPattern);
          if (match) {
            const startIndex = schemaContent.indexOf(match[0]);
            let endIndex = schemaContent.indexOf('\n\n', startIndex);
            if (endIndex === -1) endIndex = schemaContent.length;
            return {
              name: modelName,
              definition: schemaContent.substring(startIndex, endIndex).trim()
            };
          }
          return { name: modelName, definition: 'No encontrado' };
        })
      };

      const schemaFilename = generateBackupFilename('streak-schema-backup-{timestamp}') + '.json';
      const schemaFilepath = path.join(backupsDir, schemaFilename);
      fs.writeFileSync(schemaFilepath, JSON.stringify(schemaBackup, null, 2), 'utf-8');
      
      console.log('🗃️ Schema de base de datos respaldado:', schemaFilename);
    }

    console.log('');
    console.log('🎯 ARCHIVOS DEL SISTEMA DE RACHAS RESPALDADOS:');
    Object.entries(backup.files).forEach(([path, info]) => {
      console.log(`   📄 ${path}`);
      console.log(`      ${info.description}`);
      console.log(`      Tamaño: ${(info.size / 1024).toFixed(1)} KB | Líneas: ${info.content.split('\n').length}`);
    });

  } catch (error) {
    console.error('❌ ERROR durante el backup de archivos:', error);
  }
}

backupStreakFiles();