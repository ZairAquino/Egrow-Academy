#!/usr/bin/env tsx

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno
dotenv.config()

const execAsync = promisify(exec)

interface BackupConfig {
  databaseUrl: string
  backupDir: string
  localBackupDir: string
  maxBackups: number
  compression: boolean
  encryption: boolean
  encryptionKey?: string
  environment: 'development' | 'production'
}

class DatabaseBackupPrisma {
  private config: BackupConfig
  private prisma: PrismaClient

  constructor(config: BackupConfig) {
    this.config = config
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.databaseUrl
        }
      }
    })
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

  private async createBackupWithPrisma(): Promise<string> {
    const timestamp = this.getTimestamp()
    const environment = this.config.environment
    const backupFileName = `egrow-academy-${environment}-backup-${timestamp}.json`
    const backupPath = path.join(this.config.backupDir, backupFileName)

    console.log(`🔄 Iniciando backup de ${environment} en proyecto: ${backupFileName}`)

    try {
      // Obtener todos los datos de la base de datos usando Prisma
      const backupData = await this.generateBackupData()
      
      // Guardar como JSON
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
      
      console.log(`✅ Backup de ${environment} creado exitosamente en proyecto: ${backupPath}`)
      return backupPath
    } catch (error) {
      console.error('❌ Error creando backup en proyecto:', error)
      throw error
    }
  }

  private async createLocalBackupWithPrisma(): Promise<string> {
    const timestamp = this.getTimestamp()
    const environment = this.config.environment
    const backupFileName = `egrow-academy-${environment}-backup-${timestamp}.json`
    const backupPath = path.join(this.config.localBackupDir, backupFileName)

    console.log(`🔄 Iniciando backup de ${environment} en equipo local: ${backupFileName}`)

    // Asegurar que el directorio local existe
    if (!fs.existsSync(this.config.localBackupDir)) {
      fs.mkdirSync(this.config.localBackupDir, { recursive: true })
      console.log(`📁 Directorio local creado: ${this.config.localBackupDir}`)
    }

    try {
      // Obtener todos los datos de la base de datos usando Prisma
      const backupData = await this.generateBackupData()
      
      // Guardar como JSON
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
      
      console.log(`✅ Backup de ${environment} creado exitosamente en equipo local: ${backupPath}`)
      return backupPath
    } catch (error) {
      console.error('❌ Error creando backup en equipo local:', error)
      throw error
    }
  }

  private async generateBackupData(): Promise<any> {
    console.log('📊 Generando datos de backup...')
    
    const backupData: any = {
      metadata: {
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
        version: '1.0.0'
      },
      data: {}
    }

    try {
      // Obtener datos de todas las tablas principales
      const tables = [
        'User',
        'Course',
        'Lesson',
        'Enrollment',
        'Progress',
        'Achievement',
        'UserAchievement',
        'Streak',
        'Resource',
        'Promotion',
        'Event'
      ]

      for (const table of tables) {
        try {
          const data = await (this.prisma as any)[table.toLowerCase()].findMany({
            take: 1000 // Limitar a 1000 registros por tabla para evitar problemas de memoria
          })
          backupData.data[table] = data
          console.log(`✅ ${table}: ${data.length} registros`)
        } catch (error) {
          console.warn(`⚠️ No se pudo hacer backup de ${table}:`, error.message)
          backupData.data[table] = []
        }
      }

      return backupData
    } catch (error) {
      console.error('❌ Error generando datos de backup:', error)
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
      return backupPath // Retornar archivo sin comprimir si falla
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
      return backupPath // Retornar archivo sin encriptar si falla
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.config.backupDir)
      const backupFiles = files
        .filter(file => file.includes('egrow-academy-'))
        .map(file => ({
          name: file,
          path: path.join(this.config.backupDir, file),
          stats: fs.statSync(path.join(this.config.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime())

      if (backupFiles.length > this.config.maxBackups) {
        const filesToDelete = backupFiles.slice(this.config.maxBackups)
        console.log(`🗑️ Eliminando ${filesToDelete.length} backups antiguos del proyecto...`)

        for (const file of filesToDelete) {
          fs.unlinkSync(file.path)
          console.log(`🗑️ Eliminado del proyecto: ${file.name}`)
        }
      }
    } catch (error) {
      console.error('❌ Error limpiando backups antiguos del proyecto:', error)
    }
  }

  private async cleanupOldLocalBackups(): Promise<void> {
    try {
      if (!fs.existsSync(this.config.localBackupDir)) {
        return
      }

      const files = fs.readdirSync(this.config.localBackupDir)
      const backupFiles = files
        .filter(file => file.includes('egrow-academy-'))
        .map(file => ({
          name: file,
          path: path.join(this.config.localBackupDir, file),
          stats: fs.statSync(path.join(this.config.localBackupDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime())

      if (backupFiles.length > this.config.maxBackups) {
        const filesToDelete = backupFiles.slice(this.config.maxBackups)
        console.log(`🗑️ Eliminando ${filesToDelete.length} backups antiguos del equipo local...`)

        for (const file of filesToDelete) {
          fs.unlinkSync(file.path)
          console.log(`🗑️ Eliminado del equipo local: ${file.name}`)
        }
      }
    } catch (error) {
      console.error('❌ Error limpiando backups antiguos del equipo local:', error)
    }
  }

  private async uploadToCloud(backupPath: string): Promise<void> {
    // Aquí puedes implementar la subida a servicios en la nube
    console.log(`☁️ Backup listo para subir a la nube: ${backupPath}`)
  }

  public async performBackup(): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log('🚀 Iniciando proceso de backup de eGrow Academy (usando Prisma)...')
      
      // 1. Crear backup en el proyecto
      const projectBackupPath = await this.createBackupWithPrisma()
      
      // 2. Crear backup en el equipo local
      const localBackupPath = await this.createLocalBackupWithPrisma()
      
      // 3. Comprimir backups
      const compressedProjectPath = await this.compressBackup(projectBackupPath)
      const compressedLocalPath = await this.compressBackup(localBackupPath)
      
      // 4. Encriptar backups
      const finalProjectPath = await this.encryptBackup(compressedProjectPath)
      const finalLocalPath = await this.encryptBackup(compressedLocalPath)
      
      // 5. Limpiar backups antiguos en ambas ubicaciones
      await this.cleanupOldBackups()
      await this.cleanupOldLocalBackups()
      
      // 6. Subir a la nube (opcional)
      await this.uploadToCloud(finalProjectPath)
      
      const duration = Date.now() - startTime
      console.log(`✅ Backup completado en ${duration}ms`)
      console.log(`📁 Ubicación proyecto: ${finalProjectPath}`)
      console.log(`📁 Ubicación local: ${finalLocalPath}`)
      
      // Log de éxito
      await this.logBackupSuccess(finalProjectPath, duration)
      
    } catch (error) {
      console.error('💥 Error durante el backup:', error)
      await this.logBackupError(error)
      throw error
    } finally {
      await this.prisma.$disconnect()
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
      // Listar backups del proyecto
      console.log('📋 Lista de backups del proyecto:')
      if (fs.existsSync(this.config.backupDir)) {
        const projectFiles = fs.readdirSync(this.config.backupDir)
        const projectBackupFiles = projectFiles
          .filter(file => file.includes('egrow-academy-'))
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

        projectBackupFiles.forEach((file, index) => {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2)
          console.log(`  ${index + 1}. ${file.name} (${sizeMB} MB) - ${file.created.toLocaleString()}`)
        })
      } else {
        console.log('  No hay backups en el proyecto')
      }

      // Listar backups del equipo local
      console.log('\n📋 Lista de backups del equipo local:')
      if (fs.existsSync(this.config.localBackupDir)) {
        const localFiles = fs.readdirSync(this.config.localBackupDir)
        const localBackupFiles = localFiles
          .filter(file => file.includes('egrow-academy-'))
          .map(file => {
            const filePath = path.join(this.config.localBackupDir, file)
            const stats = fs.statSync(filePath)
            return {
              name: file,
              size: stats.size,
              created: stats.mtime,
              path: filePath
            }
          })
          .sort((a, b) => b.created.getTime() - a.created.getTime())

        localBackupFiles.forEach((file, index) => {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2)
          console.log(`  ${index + 1}. ${file.name} (${sizeMB} MB) - ${file.created.toLocaleString()}`)
        })
      } else {
        console.log('  No hay backups en el equipo local')
      }
    } catch (error) {
      console.error('❌ Error listando backups:', error)
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

// Configuración del backup
const getBackupDirectories = (environment: 'development' | 'production'): { projectDir: string, localDir: string } => {
  const documentsPath = path.join(os.homedir(), 'Documents')
  
  // Directorio en el proyecto
  const projectDir = './backups'
  
  // Directorio en el equipo del usuario
  let localDir: string
  if (environment === 'production') {
    localDir = path.join(documentsPath, 'backup-produccion')
  } else {
    localDir = path.join(documentsPath, 'Backups egrow academy', 'database')
  }
  
  return { projectDir, localDir }
}

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const backupDirs = getBackupDirectories(environment)

const backupConfig: BackupConfig = {
  databaseUrl: process.env.DATABASE_URL || '',
  backupDir: backupDirs.projectDir, // Directorio principal en el proyecto
  localBackupDir: backupDirs.localDir, // Directorio adicional en el equipo
  maxBackups: 10, // Mantener solo los últimos 10 backups
  compression: true,
  encryption: true,
  encryptionKey: process.env.BACKUP_ENCRYPTION_KEY || 'egrow-backup-key-2024',
  environment
}

async function main() {
  if (!backupConfig.databaseUrl) {
    console.error('❌ DATABASE_URL no está configurada')
    process.exit(1)
  }

  const backup = new DatabaseBackupPrisma(backupConfig)

  const command = process.argv[2]

  switch (command) {
    case 'backup':
      await backup.performBackup()
      break
    case 'list':
      await backup.listBackups()
      break
    default:
      console.log('Uso: npm run backup-database-prisma [backup|list]')
      console.log('  backup - Crear nuevo backup usando Prisma')
      console.log('  list   - Listar backups existentes')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { DatabaseBackupPrisma, backupConfig } 