import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { BACKUP_CONFIG } from './production-backup-system';

/**
 * 🔄 SISTEMA DE RESTORE/ROLLBACK PARA PRODUCCIÓN
 * 
 * Este script permite restaurar la base de datos desde backups
 * en caso de que algo salga mal durante la sincronización.
 */

interface RestoreOptions {
  backupPath: string;
  restoreType: 'full' | 'critical-only' | 'selective';
  tablesToRestore?: string[];
  confirmDestruction?: boolean;
  dryRun?: boolean;
}

interface RestoreResult {
  success: boolean;
  tablesRestored: number;
  recordsRestored: number;
  errors: string[];
  duration: number;
}

class ProductionRestoreSystem {
  private prisma: PrismaClient;
  private backupDir: string;
  
  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.PRODUCTION_DATABASE_URL
        }
      }
    });
    
    this.backupDir = path.join(process.cwd(), 'backups', 'production-safety');
  }
  
  /**
   * 🚨 RESTAURACIÓN COMPLETA - DESTRUYE TODOS LOS DATOS ACTUALES
   */
  async restoreFullDatabase(backupPath: string, confirmDestruction: boolean = false): Promise<RestoreResult> {
    if (!confirmDestruction) {
      throw new Error('❌ OPERACIÓN PELIGROSA: Debes confirmar explícitamente que quieres destruir todos los datos actuales');
    }
    
    const startTime = Date.now();
    const result: RestoreResult = {
      success: false,
      tablesRestored: 0,
      recordsRestored: 0,
      errors: [],
      duration: 0
    };
    
    try {
      console.log('🚨 INICIANDO RESTAURACIÓN COMPLETA DE BASE DE DATOS');
      console.log('⚠️  ESTO DESTRUIRÁ TODOS LOS DATOS ACTUALES');
      console.log(`📁 Desde backup: ${backupPath}`);
      
      // Validar que el backup existe y es válido
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Archivo de backup no encontrado: ${backupPath}`);
      }
      
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      if (!backup.metadata || !backup.data) {
        throw new Error('Formato de backup inválido');
      }
      
      console.log(`📋 Backup info: ${backup.metadata.backupType} - ${backup.metadata.timestamp}`);
      
      // Obtener lista de tablas a restaurar
      const tablesToRestore = Object.keys(backup.data);
      console.log(`📊 Tablas a restaurar: ${tablesToRestore.length}`);
      
      // Usar transacción para rollback automático si algo falla
      await this.prisma.$transaction(async (tx) => {
        
        // 1. ELIMINAR TODOS LOS DATOS ACTUALES (en orden correcto para evitar FK errors)
        console.log('🗑️  ELIMINANDO DATOS ACTUALES...');
        
        // Orden específico para evitar errores de foreign keys
        const deletionOrder = [
          // Datos dependientes primero
          'lesson_progress',
          'course_progress',
          'enrollments',
          'user_streak_badges',
          'user_points_history',
          'weekly_lesson_completions',
          'user_streaks',
          'streak_recovery_history',
          'achievements',
          'recommendations',
          'user_behaviors',
          'resource_access_logs',
          'event_registrations',
          'promotion_interactions',
          'payments',
          'subscriptions',
          'likes',
          'comments',
          'ratings',
          'sessions',
          'security_logs',
          'user_preferences',
          // Usuarios al final
          'users',
          // Contenido
          'lessons',
          'courses',
          'resource_topics',
          'resources',
          'events',
          'community_posts',
          'promotions',
          'prices',
          'products'
        ];
        
        for (const tableName of deletionOrder) {
          if (tablesToRestore.includes(tableName)) {
            try {
              await tx.$executeRawUnsafe(`DELETE FROM "${tableName}"`);
              console.log(`   🗑️ ${tableName} - datos eliminados`);
            } catch (error) {
              console.warn(`   ⚠️ Error eliminando ${tableName}:`, error);
            }
          }
        }
        
        // 2. RESTAURAR DATOS DESDE BACKUP
        console.log('📥 RESTAURANDO DATOS DESDE BACKUP...');
        
        for (const tableName of tablesToRestore) {
          try {
            const records = backup.data[tableName];
            
            if (!Array.isArray(records) || records.length === 0) {
              console.log(`   ⏭️ ${tableName} - sin datos que restaurar`);
              continue;
            }
            
            console.log(`   📥 Restaurando ${tableName}: ${records.length} registros...`);
            
            // Construir INSERT statement dinámicamente
            if (records.length > 0) {
              const columns = Object.keys(records[0]);
              const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
              const columnNames = columns.map(col => `"${col}"`).join(', ');
              
              // Insertar registros uno por uno para mejor control de errores
              for (const record of records) {
                const values = columns.map(col => record[col]);
                
                try {
                  await tx.$executeRawUnsafe(
                    `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`,
                    ...values
                  );
                } catch (insertError) {
                  result.errors.push(`Error insertando en ${tableName}: ${insertError}`);
                  console.error(`     ❌ Error insertando registro en ${tableName}:`, insertError);
                }
              }
              
              result.recordsRestored += records.length;
              result.tablesRestored++;
              console.log(`   ✅ ${tableName} - ${records.length} registros restaurados`);
            }
            
          } catch (error) {
            const errorMsg = `Error restaurando tabla ${tableName}: ${error}`;
            result.errors.push(errorMsg);
            console.error(`   ❌ ${errorMsg}`);
          }
        }
        
      }, {
        maxWait: 300000, // 5 minutos max wait
        timeout: 600000, // 10 minutos timeout
      });
      
      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;
      
      if (result.success) {
        console.log('✅ RESTAURACIÓN COMPLETA EXITOSA');
        console.log(`📊 Estadísticas:`);
        console.log(`   - Tablas restauradas: ${result.tablesRestored}`);
        console.log(`   - Registros restaurados: ${result.recordsRestored}`);
        console.log(`   - Duración: ${Math.round(result.duration / 1000)}s`);
      } else {
        console.error('❌ RESTAURACIÓN COMPLETADA CON ERRORES');
        console.error(`❌ Errores encontrados: ${result.errors.length}`);
      }
      
      return result;
      
    } catch (error) {
      result.success = false;
      result.duration = Date.now() - startTime;
      result.errors.push(`Error crítico: ${error}`);
      
      console.error('❌ ERROR CRÍTICO EN RESTAURACIÓN:', error);
      throw error;
    }
  }
  
  /**
   * 🔄 RESTAURACIÓN SELECTIVA - Solo tablas específicas
   */
  async restoreSelectiveTables(backupPath: string, tablesToRestore: string[]): Promise<RestoreResult> {
    const startTime = Date.now();
    const result: RestoreResult = {
      success: false,
      tablesRestored: 0,
      recordsRestored: 0,
      errors: [],
      duration: 0
    };
    
    try {
      console.log('🔄 INICIANDO RESTAURACIÓN SELECTIVA');
      console.log(`📁 Desde backup: ${backupPath}`);
      console.log(`📋 Tablas a restaurar: ${tablesToRestore.join(', ')}`);
      
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      await this.prisma.$transaction(async (tx) => {
        
        for (const tableName of tablesToRestore) {
          try {
            if (!backup.data[tableName]) {
              result.errors.push(`Tabla ${tableName} no encontrada en backup`);
              continue;
            }
            
            const records = backup.data[tableName];
            
            if (!Array.isArray(records) || records.length === 0) {
              console.log(`   ⏭️ ${tableName} - sin datos`);
              continue;
            }
            
            console.log(`   🔄 Restaurando ${tableName}: ${records.length} registros...`);
            
            // Limpiar tabla actual
            await tx.$executeRawUnsafe(`DELETE FROM "${tableName}"`);
            
            // Restaurar datos
            if (records.length > 0) {
              const columns = Object.keys(records[0]);
              const columnNames = columns.map(col => `"${col}"`).join(', ');
              
              for (const record of records) {
                const values = columns.map(col => record[col]);
                const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
                
                await tx.$executeRawUnsafe(
                  `INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`,
                  ...values
                );
              }
              
              result.recordsRestored += records.length;
              result.tablesRestored++;
              console.log(`   ✅ ${tableName} - restaurado`);
            }
            
          } catch (error) {
            const errorMsg = `Error restaurando ${tableName}: ${error}`;
            result.errors.push(errorMsg);
            console.error(`   ❌ ${errorMsg}`);
          }
        }
        
      });
      
      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;
      
      console.log(result.success ? '✅ RESTAURACIÓN SELECTIVA EXITOSA' : '❌ RESTAURACIÓN CON ERRORES');
      
      return result;
      
    } catch (error) {
      result.success = false;
      result.duration = Date.now() - startTime;
      result.errors.push(`Error crítico: ${error}`);
      
      console.error('❌ ERROR EN RESTAURACIÓN SELECTIVA:', error);
      throw error;
    }
  }
  
  /**
   * 🔍 DRY RUN - Simular restauración sin cambios reales
   */
  async dryRunRestore(backupPath: string): Promise<{valid: boolean, issues: string[], stats: any}> {
    try {
      console.log('🔍 SIMULANDO RESTAURACIÓN (DRY RUN)...');
      
      if (!fs.existsSync(backupPath)) {
        return {
          valid: false,
          issues: ['Archivo de backup no encontrado'],
          stats: {}
        };
      }
      
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      const issues: string[] = [];
      const stats: any = {};
      
      // Validar estructura
      if (!backup.metadata || !backup.data) {
        issues.push('Estructura de backup inválida');
      }
      
      // Analizar cada tabla
      for (const [tableName, records] of Object.entries(backup.data)) {
        if (Array.isArray(records)) {
          stats[tableName] = {
            recordCount: records.length,
            hasData: records.length > 0,
            sampleColumns: records.length > 0 ? Object.keys(records[0]) : []
          };
          
          // Verificar que la tabla existe en la base actual
          try {
            await this.prisma.$queryRawUnsafe(`SELECT 1 FROM "${tableName}" LIMIT 1`);
            stats[tableName].tableExists = true;
          } catch (error) {
            stats[tableName].tableExists = false;
            issues.push(`Tabla ${tableName} no existe en base de datos actual`);
          }
        }
      }
      
      const valid = issues.length === 0;
      
      console.log(`🔍 DRY RUN COMPLETADO - ${valid ? 'VÁLIDO' : 'ISSUES ENCONTRADOS'}`);
      console.log(`📊 Tablas analizadas: ${Object.keys(stats).length}`);
      
      if (issues.length > 0) {
        console.log('⚠️ Issues encontrados:');
        issues.forEach(issue => console.log(`   - ${issue}`));
      }
      
      return { valid, issues, stats };
      
    } catch (error) {
      console.error('❌ Error en dry run:', error);
      return {
        valid: false,
        issues: [`Error en análisis: ${error}`],
        stats: {}
      };
    }
  }
  
  /**
   * 📋 Listar backups disponibles para restore
   */
  listAvailableBackups(): Array<{file: string, path: string, type: string, date: Date, size: string}> {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filepath = path.join(this.backupDir, file);
          const stats = fs.statSync(filepath);
          const sizeMB = Math.round((stats.size / 1024 / 1024) * 100) / 100;
          
          // Determinar tipo de backup por el nombre
          let type = 'unknown';
          if (file.includes('full-backup')) type = 'full';
          else if (file.includes('critical-users')) type = 'critical';
          else if (file.includes('selective')) type = 'selective';
          
          return {
            file,
            path: filepath,
            type,
            date: stats.mtime,
            size: `${sizeMB} MB`
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

// Función para uso interactivo
async function interactiveRestore() {
  const restoreSystem = new ProductionRestoreSystem();
  
  try {
    console.log('🔄 SISTEMA DE RESTAURACIÓN DE PRODUCCIÓN');
    console.log('========================================');
    
    const backups = restoreSystem.listAvailableBackups();
    
    if (backups.length === 0) {
      console.log('❌ No se encontraron backups disponibles');
      return;
    }
    
    console.log('📁 Backups disponibles:');
    backups.forEach((backup, index) => {
      console.log(`   ${index + 1}. ${backup.file}`);
      console.log(`      Tipo: ${backup.type} | Tamaño: ${backup.size} | Fecha: ${backup.date.toLocaleString()}`);
    });
    
    console.log('\n⚠️  USAR CON EXTREMA PRECAUCIÓN');
    console.log('⚠️  Siempre hacer backup antes de restaurar');
    
  } catch (error) {
    console.error('❌ Error en restauración interactiva:', error);
  } finally {
    await restoreSystem.disconnect();
  }
}

// Exportar para uso en otros scripts
export { ProductionRestoreSystem, RestoreOptions, RestoreResult };

// Ejecutar si se llama directamente
if (require.main === module) {
  interactiveRestore();
}