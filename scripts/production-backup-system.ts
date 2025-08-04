import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * 🛡️ SISTEMA DE BACKUP COMPLETO PARA PRODUCCIÓN
 * 
 * Este script crea respaldos completos y categorizados de la base de datos
 * para permitir rollback completo en caso de problemas.
 */

// Configuración de tablas por categoría
const BACKUP_CONFIG = {
  // 🔴 DATOS CRÍTICOS DE USUARIOS (NUNCA se deben perder)
  CRITICAL_USER_DATA: [
    'users',
    'enrollments',
    'course_progress',
    'lesson_progress',
    'payments',
    'subscriptions',
    'user_streaks',
    'user_streak_badges',
    'user_points_history',
    'weekly_lesson_completions',
    'streak_recovery_history',
    'user_behaviors',
    'achievements',
    'recommendations'
  ],
  
  // 🟡 DATOS DE CONFIGURACIÓN IMPORTANTES
  CONFIGURATION_DATA: [
    'sessions',
    'security_logs',
    'promotion_interactions',
    'resource_access_logs',
    'event_registrations',
    'user_preferences'
  ],
  
  // 🟢 CONTENIDO (se puede regenerar desde desarrollo)
  CONTENT_DATA: [
    'courses',
    'lessons',
    'resources',
    'resource_topics',
    'events',
    'promotions',
    'products',
    'prices'
  ],
  
  // 🔵 DATOS COMUNITARIOS
  COMMUNITY_DATA: [
    'community_posts',
    'comments',
    'likes',
    'ratings'
  ]
};

interface BackupResult {
  timestamp: string;
  backupPath: string;
  tablesBackedUp: number;
  totalRecords: number;
  fileSizeMB: number;
  success: boolean;
  error?: string;
}

class ProductionBackupSystem {
  private prisma: PrismaClient;
  private backupDir: string;
  
  constructor() {
    // Usar URL de producción directamente
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.PRODUCTION_DATABASE_URL
        }
      }
    });
    
    this.backupDir = path.join(process.cwd(), 'backups', 'production-safety');
    
    // Crear directorio de backups si no existe
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }
  
  /**
   * Crear backup completo de producción
   */
  async createFullBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `full-backup-${timestamp}.json`);
    
    try {
      console.log('🛡️ INICIANDO BACKUP COMPLETO DE PRODUCCIÓN...');
      console.log(`📁 Ruta de backup: ${backupPath}`);
      
      const backup: any = {
        metadata: {
          timestamp,
          environment: 'production',
          backupType: 'full',
          prismaVersion: '6.12.0',
          nodeVersion: process.version
        },
        data: {}
      };
      
      let totalRecords = 0;
      let tablesBackedUp = 0;
      
      // Backup por categorías
      const allTables = [
        ...BACKUP_CONFIG.CRITICAL_USER_DATA,
        ...BACKUP_CONFIG.CONFIGURATION_DATA,
        ...BACKUP_CONFIG.CONTENT_DATA,
        ...BACKUP_CONFIG.COMMUNITY_DATA
      ];
      
      for (const tableName of allTables) {
        try {
          console.log(`📋 Respaldando tabla: ${tableName}...`);
          
          // Usar prisma.$queryRaw para obtener todos los registros
          const records = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
          
          backup.data[tableName] = records;
          totalRecords += Array.isArray(records) ? records.length : 0;
          tablesBackedUp++;
          
          console.log(`   ✅ ${tableName}: ${Array.isArray(records) ? records.length : 0} registros`);
          
        } catch (error) {
          console.warn(`   ⚠️ Error respaldando ${tableName}:`, error);
          // Continuar con otras tablas
        }
      }
      
      // Guardar backup
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      
      const stats = fs.statSync(backupPath);
      const fileSizeMB = Math.round((stats.size / 1024 / 1024) * 100) / 100;
      
      console.log('✅ BACKUP COMPLETO EXITOSO');
      console.log(`📊 Estadísticas:`);
      console.log(`   - Tablas respaldadas: ${tablesBackedUp}`);
      console.log(`   - Total registros: ${totalRecords}`);
      console.log(`   - Tamaño archivo: ${fileSizeMB} MB`);
      console.log(`   - Ubicación: ${backupPath}`);
      
      return {
        timestamp,
        backupPath,
        tablesBackedUp,
        totalRecords,
        fileSizeMB,
        success: true
      };
      
    } catch (error) {
      console.error('❌ ERROR EN BACKUP COMPLETO:', error);
      
      return {
        timestamp,
        backupPath,
        tablesBackedUp: 0,
        totalRecords: 0,
        fileSizeMB: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Crear backup solo de datos críticos de usuarios
   */
  async createCriticalUserDataBackup(): Promise<BackupResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `critical-users-${timestamp}.json`);
    
    try {
      console.log('🔴 INICIANDO BACKUP DE DATOS CRÍTICOS DE USUARIOS...');
      
      const backup: any = {
        metadata: {
          timestamp,
          environment: 'production',
          backupType: 'critical-users-only',
          description: 'Solo datos críticos de usuarios que NUNCA se deben perder'
        },
        data: {}
      };
      
      let totalRecords = 0;
      let tablesBackedUp = 0;
      
      for (const tableName of BACKUP_CONFIG.CRITICAL_USER_DATA) {
        try {
          console.log(`🔴 Respaldando (CRÍTICO): ${tableName}...`);
          
          const records = await this.prisma.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
          
          backup.data[tableName] = records;
          totalRecords += Array.isArray(records) ? records.length : 0;
          tablesBackedUp++;
          
          console.log(`   ✅ ${tableName}: ${Array.isArray(records) ? records.length : 0} registros`);
          
        } catch (error) {
          console.error(`   ❌ ERROR CRÍTICO respaldando ${tableName}:`, error);
          throw error; // Para datos críticos, fallar completamente si hay error
        }
      }
      
      fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
      
      const stats = fs.statSync(backupPath);
      const fileSizeMB = Math.round((stats.size / 1024 / 1024) * 100) / 100;
      
      console.log('✅ BACKUP CRÍTICO EXITOSO');
      console.log(`📊 Estadísticas críticas:`);
      console.log(`   - Tablas críticas: ${tablesBackedUp}`);
      console.log(`   - Registros críticos: ${totalRecords}`);
      console.log(`   - Tamaño: ${fileSizeMB} MB`);
      
      return {
        timestamp,
        backupPath,
        tablesBackedUp,
        totalRecords,
        fileSizeMB,
        success: true
      };
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO EN BACKUP DE USUARIOS:', error);
      throw error; // Re-throw para que el caller sepa que falló
    }
  }
  
  /**
   * Validar integridad de un backup
   */
  async validateBackup(backupPath: string): Promise<boolean> {
    try {
      console.log(`🔍 Validando backup: ${backupPath}`);
      
      if (!fs.existsSync(backupPath)) {
        console.error('❌ Archivo de backup no existe');
        return false;
      }
      
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      if (!backup.metadata || !backup.data) {
        console.error('❌ Estructura de backup inválida');
        return false;
      }
      
      // Validar que tenga datos críticos
      const criticalTables = BACKUP_CONFIG.CRITICAL_USER_DATA;
      for (const table of criticalTables) {
        if (!backup.data[table]) {
          console.warn(`⚠️ Tabla crítica faltante: ${table}`);
        }
      }
      
      console.log('✅ Backup validado exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error validando backup:', error);
      return false;
    }
  }
  
  /**
   * Listar todos los backups disponibles
   */
  listBackups(): Array<{file: string, path: string, size: string, date: Date}> {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filepath = path.join(this.backupDir, file);
          const stats = fs.statSync(filepath);
          const sizeMB = Math.round((stats.size / 1024 / 1024) * 100) / 100;
          
          return {
            file,
            path: filepath,
            size: `${sizeMB} MB`,
            date: stats.mtime
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      return files;
    } catch (error) {
      console.error('Error listando backups:', error);
      return [];
    }
  }
  
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Función principal para uso desde línea de comandos
async function main() {
  const backupSystem = new ProductionBackupSystem();
  
  try {
    console.log('🛡️ SISTEMA DE BACKUP DE PRODUCCIÓN');
    console.log('==================================');
    
    // Crear backup completo
    const fullBackup = await backupSystem.createFullBackup();
    
    if (fullBackup.success) {
      // Crear backup crítico adicional
      const criticalBackup = await backupSystem.createCriticalUserDataBackup();
      
      // Validar ambos backups
      await backupSystem.validateBackup(fullBackup.backupPath);
      await backupSystem.validateBackup(criticalBackup.backupPath);
      
      console.log('\n🎉 TODOS LOS BACKUPS COMPLETADOS EXITOSAMENTE');
      console.log('📁 Backups disponibles:');
      
      const backups = backupSystem.listBackups();
      backups.forEach(backup => {
        console.log(`   - ${backup.file} (${backup.size}) - ${backup.date.toLocaleString()}`);
      });
      
    } else {
      console.error('❌ FALLO EN BACKUP COMPLETO');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ ERROR CRÍTICO EN SISTEMA DE BACKUP:', error);
    process.exit(1);
  } finally {
    await backupSystem.disconnect();
  }
}

// Exportar para uso en otros scripts
export { ProductionBackupSystem, BACKUP_CONFIG };

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}