#!/usr/bin/env tsx

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

interface BackupConfig {
  databaseUrl: string
  backupDir: string
  maxBackups: number
  compression: boolean
  encryption: boolean
  encryptionKey?: string
}

class DatabaseBackup {
  private config: BackupConfig

  constructor(config: BackupConfig) {
    this.config = config
    this.ensureBackupDirectory()
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.config.backupDir)) {
      fs.mkdirSync(this.config.backupDir, { recursive: true })
      console.log(`📁 Directorio de backup creado: ${this.config.backupDir}`)
    }
  }

  private getTimestamp(): string {
    const now = new Date()
    return now.toISOString().replace(/[:.]/g, '-').slice(0, -5)
  }

  private async executeCommand(command: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(command)
      if (stderr) {
        console.warn('⚠️ Advertencia en comando:', stderr)
      }
      return stdout
    } catch (error) {
      console.error('❌ Error ejecutando comando:', error)
      throw error
    }
  }

  private async createBackup(): Promise<string> {
    const timestamp = this.getTimestamp()
    const backupFileName = `egrow-academy-backup-${timestamp}.sql`
    const backupPath = path.join(this.config.backupDir, backupFileName)

    console.log(`🔄 Iniciando backup: ${backupFileName}`)

    // Extraer información de conexión de la URL de la base de datos
    const dbUrl = new URL(this.config.databaseUrl)
    const host = dbUrl.hostname
    const port = dbUrl.port || '5432'
    const database = dbUrl.pathname.slice(1)
    const username = dbUrl.username
    const password = dbUrl.password

    // Comando pg_dump para PostgreSQL
    const pgDumpCommand = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} --verbose --clean --if-exists --no-owner --no-privileges > "${backupPath}"`

    try {
      await this.executeCommand(pgDumpCommand)
      console.log(`✅ Backup creado exitosamente: ${backupPath}`)
      return backupPath
    } catch (error) {
      console.error('❌ Error creando backup:', error)
      throw error
    }
  }

  private async compressBackup(backupPath: string): Promise<string> {
    if (!this.config.compression) {
      return backupPath
    }

    const compressedPath = `${backupPath}.gz`
    console.log(`🗜️ Comprimiendo backup: ${compressedPath}`)

    try {
      await this.executeCommand(`gzip -f "${backupPath}"`)
      console.log(`✅ Backup comprimido: ${compressedPath}`)
      return compressedPath
    } catch (error) {
      console.error('❌ Error comprimiendo backup:', error)
      throw error
    }
  }

  private async encryptBackup(backupPath: string): Promise<string> {
    if (!this.config.encryption || !this.config.encryptionKey) {
      return backupPath
    }

    const encryptedPath = `${backupPath}.enc`
    console.log(`🔐 Encriptando backup: ${encryptedPath}`)

    try {
      // Usar openssl para encriptar
      const encryptCommand = `openssl enc -aes-256-cbc -salt -in "${backupPath}" -out "${encryptedPath}" -k "${this.config.encryptionKey}"`
      await this.executeCommand(encryptCommand)
      
      // Eliminar archivo sin encriptar
      fs.unlinkSync(backupPath)
      
      console.log(`✅ Backup encriptado: ${encryptedPath}`)
      return encryptedPath
    } catch (error) {
      console.error('❌ Error encriptando backup:', error)
      throw error
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir)
      const backupFiles = files
        .filter(file => file.includes('egrow-academy-backup-'))
        .map(file => ({
          name: file,
          path: path.join(this.config.backupDir, file),
          stats: fs.statSync(path.join(this.config.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime())

      if (backupFiles.length > this.config.maxBackups) {
        const filesToDelete = backupFiles.slice(this.config.maxBackups)
        console.log(`🗑️ Eliminando ${filesToDelete.length} backups antiguos...`)

        for (const file of filesToDelete) {
          fs.unlinkSync(file.path)
          console.log(`🗑️ Eliminado: ${file.name}`)
        }
      }
    } catch (error) {
      console.error('❌ Error limpiando backups antiguos:', error)
    }
  }

  private async uploadToCloud(backupPath: string): Promise<void> {
    // Aquí puedes implementar la subida a servicios en la nube
    // como AWS S3, Google Cloud Storage, etc.
    console.log(`☁️ Backup listo para subir a la nube: ${backupPath}`)
    
    // Ejemplo para AWS S3 (requiere configuración adicional)
    // await this.uploadToS3(backupPath)
  }

  public async performBackup(): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log('🚀 Iniciando proceso de backup de eGrow Academy...')
      
      // 1. Crear backup
      const backupPath = await this.createBackup()
      
      // 2. Comprimir backup
      const compressedPath = await this.compressBackup(backupPath)
      
      // 3. Encriptar backup
      const finalPath = await this.encryptBackup(compressedPath)
      
      // 4. Limpiar backups antiguos
      await this.cleanupOldBackups()
      
      // 5. Subir a la nube (opcional)
      await this.uploadToCloud(finalPath)
      
      const duration = Date.now() - startTime
      console.log(`✅ Backup completado en ${duration}ms`)
      console.log(`📁 Ubicación: ${finalPath}`)
      
      // Log de éxito
      await this.logBackupSuccess(finalPath, duration)
      
    } catch (error) {
      console.error('💥 Error durante el backup:', error)
      await this.logBackupError(error)
      throw error
    }
  }

  private async logBackupSuccess(backupPath: string, duration: number): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'BACKUP_SUCCESS',
      backupPath,
      duration,
      size: fs.statSync(backupPath).size
    }
    
    console.log('📝 Log de backup:', logEntry)
  }

  private async logBackupError(error: any): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'BACKUP_ERROR',
      error: error.message,
      stack: error.stack
    }
    
    console.error('📝 Log de error:', logEntry)
  }

  public async listBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir)
      const backupFiles = files
        .filter(file => file.includes('egrow-academy-backup-'))
        .map(file => {
          const filePath = path.join(this.config.backupDir, file)
          const stats = fs.statSync(filePath)
          return {
            name: file,
            size: stats.size,
            created: stats.mtime,
            path: filePath
          }
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime())

      console.log('📋 Lista de backups disponibles:')
      backupFiles.forEach((file, index) => {
        const sizeMB = (file.size / 1024 / 1024).toFixed(2)
        console.log(`${index + 1}. ${file.name} (${sizeMB} MB) - ${file.created.toLocaleString()}`)
      })
    } catch (error) {
      console.error('❌ Error listando backups:', error)
    }
  }
}

// Configuración del backup
const backupConfig: BackupConfig = {
  databaseUrl: process.env.DATABASE_URL || '',
  backupDir: './backups',
  maxBackups: 10, // Mantener solo los últimos 10 backups
  compression: true,
  encryption: true,
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || 'egrow-backup-key-2024'
}

async function main() {
  if (!backupConfig.databaseUrl) {
    console.error('❌ DATABASE_URL no está configurada')
    process.exit(1)
  }

  const backup = new DatabaseBackup(backupConfig)

  const command = process.argv[2]

  switch (command) {
    case 'backup':
      await backup.performBackup()
      break
    case 'list':
      await backup.listBackups()
      break
    default:
      console.log('Uso: npm run backup-database [backup|list]')
      console.log('  backup - Crear nuevo backup')
      console.log('  list   - Listar backups existentes')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { DatabaseBackup, backupConfig } 