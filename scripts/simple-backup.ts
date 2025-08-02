#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno
dotenv.config()
dotenv.config({ path: '.env.production' })

const prisma = new PrismaClient()

interface BackupData {
  timestamp: string
  environment: string
  tables: {
    [tableName: string]: any[]
  }
}

class SimpleBackup {
  private backupDir: string
  private timestamp: string

  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups')
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    this.ensureBackupDirectory()
  }

  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
      console.log(`📁 Directorio de backup creado: ${this.backupDir}`)
    }
  }

  private async exportTable<T>(tableName: string, model: any): Promise<T[]> {
    try {
      console.log(`📦 Exportando tabla: ${tableName}`)
      const data = await model.findMany()
      console.log(`✅ ${tableName}: ${data.length} registros`)
      return data
    } catch (error) {
      console.error(`❌ Error exportando ${tableName}:`, error)
      return []
    }
  }

  public async performBackup(environment: string = 'desarrollo'): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log(`🚀 Iniciando backup de ${environment}...`)
      
      const backupData: BackupData = {
        timestamp: new Date().toISOString(),
        environment,
        tables: {}
      }

      // Exportar todas las tablas principales
      backupData.tables.users = await this.exportTable('users', prisma.user)
      backupData.tables.courses = await this.exportTable('courses', prisma.course)
      backupData.tables.lessons = await this.exportTable('lessons', prisma.lesson)
      backupData.tables.enrollments = await this.exportTable('enrollments', prisma.enrollment)
      backupData.tables.progress = await this.exportTable('progress', prisma.progress)
      backupData.tables.payments = await this.exportTable('payments', prisma.payment)
      backupData.tables.resources = await this.exportTable('resources', prisma.resource)
      backupData.tables.events = await this.exportTable('events', prisma.event)
      backupData.tables.eventRegistrations = await this.exportTable('eventRegistrations', prisma.eventRegistration)
      backupData.tables.ratings = await this.exportTable('ratings', prisma.rating)
      backupData.tables.achievements = await this.exportTable('achievements', prisma.achievement)
      backupData.tables.userAchievements = await this.exportTable('userAchievements', prisma.userAchievement)
      backupData.tables.promotions = await this.exportTable('promotions', prisma.promotion)
      backupData.tables.userPromotions = await this.exportTable('userPromotions', prisma.userPromotion)

      // Guardar backup en formato JSON
      const backupFileName = `egrow-academy-${environment}-${this.timestamp}.json`
      const backupPath = path.join(this.backupDir, backupFileName)
      
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))
      
      // Crear también un backup SQL-like
      const sqlBackupPath = path.join(this.backupDir, `egrow-academy-${environment}-${this.timestamp}.sql`)
      await this.createSQLBackup(backupData, sqlBackupPath)
      
      const duration = Date.now() - startTime
      const fileSize = fs.statSync(backupPath).size
      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2)
      
      console.log(`✅ Backup completado en ${duration}ms`)
      console.log(`📁 JSON: ${backupPath} (${fileSizeMB} MB)`)
      console.log(`📁 SQL:  ${sqlBackupPath}`)
      
      return backupPath

    } catch (error) {
      console.error('💥 Error durante el backup:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  }

  private async createSQLBackup(backupData: BackupData, sqlPath: string): Promise<void> {
    try {
      let sqlContent = `-- eGrow Academy Database Backup\n`
      sqlContent += `-- Environment: ${backupData.environment}\n`
      sqlContent += `-- Timestamp: ${backupData.timestamp}\n\n`
      
      sqlContent += `-- Disable foreign key checks\n`
      sqlContent += `SET foreign_key_checks = 0;\n\n`

      // Generar INSERT statements para cada tabla
      for (const [tableName, records] of Object.entries(backupData.tables)) {
        if (records.length > 0) {
          sqlContent += `-- Table: ${tableName}\n`
          sqlContent += `DELETE FROM ${tableName};\n`
          
          const firstRecord = records[0]
          const columns = Object.keys(firstRecord)
          
          for (const record of records) {
            const values = columns.map(col => {
              const value = record[col]
              if (value === null) return 'NULL'
              if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
              if (value instanceof Date) return `'${value.toISOString()}'`
              if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
              return value
            }).join(', ')
            
            sqlContent += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});\n`
          }
          sqlContent += `\n`
        }
      }
      
      sqlContent += `-- Enable foreign key checks\n`
      sqlContent += `SET foreign_key_checks = 1;\n`
      
      fs.writeFileSync(sqlPath, sqlContent)
      
    } catch (error) {
      console.error('❌ Error creando backup SQL:', error)
    }
  }

  public async listBackups(): Promise<void> {
    try {
      const files = fs.readdirSync(this.backupDir)
      const backupFiles = files
        .filter(file => file.includes('egrow-academy-') && (file.endsWith('.json') || file.endsWith('.sql')))
        .map(file => {
          const filePath = path.join(this.backupDir, file)
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

async function main() {
  const backup = new SimpleBackup()
  const command = process.argv[2]
  const environment = process.argv[3] || 'desarrollo'

  // Para producción, usar configuración específica
  if (environment === 'produccion') {
    console.log('🔄 Configurando conexión a producción...')
    
    // Cargar archivo .env.production específicamente
    dotenv.config({ path: '.env.production', override: true })
    
    // La URL ya debería estar disponible desde .env.production
    const prodUrl = process.env.DATABASE_URL
    if (!prodUrl) {
      console.error('❌ No se encontró DATABASE_URL en .env.production')
      console.log('💡 Verificar archivo .env.production')
      process.exit(1)
    } else {
      console.log('✅ Usando base de datos de producción')
      console.log(`🔗 Conectando a: ${prodUrl.split('@')[1]?.split('/')[0] || 'base de datos'}`)
    }
  }

  switch (command) {
    case 'backup':
      await backup.performBackup(environment)
      break
    case 'list':
      await backup.listBackups()
      break
    case 'both':
      console.log('🚀 Ejecutando backup completo (desarrollo y producción)...\n')
      
      // Backup de desarrollo
      await backup.performBackup('desarrollo')
      console.log('\n' + '='.repeat(50) + '\n')
      
      // Backup de producción
      console.log('🔄 Configurando producción para backup completo...')
      dotenv.config({ path: '.env.production', override: true })
      
      const prodUrl = process.env.DATABASE_URL
      if (prodUrl) {
        console.log('✅ Configuración de producción encontrada')
        const prodBackup = new SimpleBackup()
        await prodBackup.performBackup('produccion')
      } else {
        console.log('⚠️ Saltando backup de producción - no hay configuración disponible')
      }
      break
    default:
      console.log('Uso: npx tsx scripts/simple-backup.ts [backup|list|both] [desarrollo|produccion]')
      console.log('  backup - Crear nuevo backup')
      console.log('  list   - Listar backups existentes')
      console.log('  both   - Backup de desarrollo y producción')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { SimpleBackup }