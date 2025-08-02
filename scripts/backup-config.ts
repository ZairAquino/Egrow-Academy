import * as path from 'path';
import * as os from 'os';

/**
 * REGLA ESTABLECIDA: Configuración estándar de backups para Egrow Academy
 * 
 * Todos los backups se guardan en la carpeta de Documentos del usuario
 * en una carpeta específica llamada "Backups egrow academy"
 * 
 * Esta configuración es la regla estándar para todos los scripts de backup
 * presentes y futuros del proyecto.
 */

export const BACKUP_CONFIG = {
  // Ubicación estándar de backups en Documentos del usuario
  STANDARD_BACKUP_DIR: path.join(os.homedir(), 'Documents', 'Backups egrow academy'),
  
  // Subdirectorios organizados por tipo
  SUBDIRS: {
    DATABASE: 'database',
    STREAK_SYSTEM: 'streak-system', 
    CODE: 'code-backups',
    SCHEMA: 'schema-backups',
    FULL_SYSTEM: 'full-system'
  },
  
  // Formatos de nombres de archivo
  FILENAME_PATTERNS: {
    DATABASE: 'egrow-academy-{environment}-{timestamp}',
    STREAK_SYSTEM: 'streak-system-backup-{timestamp}',
    CODE: 'code-backup-{timestamp}',
    SCHEMA: 'schema-backup-{timestamp}',
    FULL: 'full-backup-{timestamp}'
  },
  
  // Configuraciones de backup
  SETTINGS: {
    // Mantener backups por 30 días por defecto
    RETENTION_DAYS: 30,
    // Crear backup automático antes de migraciones
    AUTO_BACKUP_BEFORE_MIGRATION: true,
    // Comprimir backups grandes
    COMPRESS_LARGE_BACKUPS: true,
    // Tamaño mínimo para comprimir (en MB)
    COMPRESS_THRESHOLD_MB: 10
  }
} as const;

/**
 * Obtiene la ruta completa para un backup específico
 */
export function getBackupPath(subdir?: string): string {
  if (subdir) {
    return path.join(BACKUP_CONFIG.STANDARD_BACKUP_DIR, subdir);
  }
  return BACKUP_CONFIG.STANDARD_BACKUP_DIR;
}

/**
 * Genera nombre de archivo con timestamp
 */
export function generateBackupFilename(pattern: string, environment?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return pattern
    .replace('{timestamp}', timestamp)
    .replace('{environment}', environment || 'desarrollo');
}

/**
 * Crea los directorios necesarios para backups
 */
export async function ensureBackupDirectories(): Promise<void> {
  const fs = await import('fs');
  
  // Crear directorio principal
  if (!fs.existsSync(BACKUP_CONFIG.STANDARD_BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_CONFIG.STANDARD_BACKUP_DIR, { recursive: true });
  }
  
  // Crear subdirectorios
  Object.values(BACKUP_CONFIG.SUBDIRS).forEach(subdir => {
    const fullPath = path.join(BACKUP_CONFIG.STANDARD_BACKUP_DIR, subdir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

/**
 * Información sobre la configuración de backup
 */
export function getBackupInfo(): void {
  console.log('📁 CONFIGURACIÓN DE BACKUP - EGROW ACADEMY');
  console.log('🏠 Ubicación estándar:', BACKUP_CONFIG.STANDARD_BACKUP_DIR);
  console.log('📂 Subdirectorios disponibles:');
  Object.entries(BACKUP_CONFIG.SUBDIRS).forEach(([key, value]) => {
    console.log(`   - ${key}: ${value}`);
  });
  console.log('⚙️ Configuraciones:');
  console.log(`   - Retención: ${BACKUP_CONFIG.SETTINGS.RETENTION_DAYS} días`);
  console.log(`   - Auto-backup antes de migraciones: ${BACKUP_CONFIG.SETTINGS.AUTO_BACKUP_BEFORE_MIGRATION ? 'Sí' : 'No'}`);
  console.log(`   - Comprimir archivos > ${BACKUP_CONFIG.SETTINGS.COMPRESS_THRESHOLD_MB} MB: ${BACKUP_CONFIG.SETTINGS.COMPRESS_LARGE_BACKUPS ? 'Sí' : 'No'}`);
}