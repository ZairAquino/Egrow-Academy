#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno
dotenv.config()

const prisma = new PrismaClient()

interface BackupData {
  timestamp: string
  environment: string
  tables: {
    [tableName: string]: any[]
  }
}

class RestoreFromBackup {
  constructor() {}

  private async clearTable(tableName: string, model: any): Promise<void> {
    try {
      console.log(`🗑️ Limpiando tabla: ${tableName}`)
      await model.deleteMany({})
      console.log(`✅ ${tableName} limpiada`)
    } catch (error) {
      console.error(`❌ Error limpiando ${tableName}:`, error)
    }
  }

  private async restoreTable(tableName: string, model: any, data: any[]): Promise<void> {
    if (!data || data.length === 0) {
      console.log(`⏭️ ${tableName}: sin datos para restaurar`)
      return
    }

    try {
      console.log(`📥 Restaurando tabla: ${tableName} (${data.length} registros)`)
      
      // Restaurar registro por registro para manejar errores individualmente
      let successCount = 0
      for (const record of data) {
        try {
          await model.create({ data: record })
          successCount++
        } catch (error: any) {
          console.warn(`⚠️ Error restaurando registro en ${tableName}:`, error.message)
        }
      }
      
      console.log(`✅ ${tableName}: ${successCount}/${data.length} registros restaurados`)
    } catch (error) {
      console.error(`❌ Error restaurando ${tableName}:`, error)
    }
  }

  public async restoreFromFile(backupFilePath: string): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log(`🚀 Iniciando restauración desde: ${backupFilePath}`)
      
      // Leer archivo de backup
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Archivo de backup no encontrado: ${backupFilePath}`)
      }

      const backupContent = fs.readFileSync(backupFilePath, 'utf-8')
      const backupData: BackupData = JSON.parse(backupContent)
      
      console.log(`📊 Backup de ${backupData.environment} - ${backupData.timestamp}`)

      // Orden específico de restauración para respetar foreign keys
      const restoreOrder = [
        { name: 'users', model: prisma.user },
        { name: 'courses', model: prisma.course },
        { name: 'lessons', model: prisma.lesson },
        { name: 'resources', model: prisma.resource },
        { name: 'events', model: prisma.event },
        { name: 'promotions', model: prisma.promotion },
        { name: 'enrollments', model: prisma.enrollment },
        { name: 'payments', model: prisma.payment },
        { name: 'eventRegistrations', model: prisma.eventRegistration },
        { name: 'ratings', model: prisma.rating },
        { name: 'achievements', model: prisma.achievement },
        { name: 'userAchievements', model: prisma.userAchievement },
        { name: 'userPromotions', model: prisma.userPromotion }
      ]

      // Restaurar en orden
      for (const table of restoreOrder) {
        const tableData = backupData.tables[table.name]
        if (tableData && table.model) {
          await this.restoreTable(table.name, table.model, tableData)
        }
      }

      const duration = Date.now() - startTime
      console.log(`✅ Restauración completada en ${duration}ms`)
      
    } catch (error) {
      console.error('💥 Error durante la restauración:', error)
      throw error
    } finally {
      await prisma.$disconnect()
    }
  }

  public async listBackupFiles(): Promise<string[]> {
    const backupDir = path.join(process.cwd(), 'backups')
    
    if (!fs.existsSync(backupDir)) {
      console.log('📁 No se encontró directorio de backups')
      return []
    }

    const files = fs.readdirSync(backupDir)
    const backupFiles = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse()

    console.log('📋 Archivos de backup disponibles:')
    backupFiles.forEach((file, index) => {
      const filePath = path.join(backupDir, file)
      const stats = fs.statSync(filePath)
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2)
      console.log(`${index + 1}. ${file} (${sizeMB} MB) - ${stats.mtime.toLocaleString()}`)
    })

    return backupFiles.map(file => path.join(backupDir, file))
  }
}

async function main() {
  const restore = new RestoreFromBackup()
  const command = process.argv[2]
  const backupFile = process.argv[3]

  switch (command) {
    case 'restore':
      if (!backupFile) {
        console.error('❌ Especifica el archivo de backup')
        console.log('Uso: npx tsx scripts/restore-from-backup.ts restore <archivo-backup.json>')
        process.exit(1)
      }
      
      // Si es solo el nombre del archivo, añadir la ruta completa
      const fullPath = backupFile.includes('backups') 
        ? backupFile 
        : path.join(process.cwd(), 'backups', backupFile)
      
      await restore.restoreFromFile(fullPath)
      break
      
    case 'list':
      await restore.listBackupFiles()
      break
      
    default:
      console.log('Uso: npx tsx scripts/restore-from-backup.ts [restore|list] [archivo-backup.json]')
      console.log('  restore - Restaurar desde archivo de backup')
      console.log('  list    - Listar backups disponibles')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { RestoreFromBackup }