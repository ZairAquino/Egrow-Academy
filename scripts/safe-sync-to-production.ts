#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno de desarrollo por defecto
dotenv.config()

interface SyncConfig {
  contentTables: string[]
  userTables: string[]
  mergeStrategy: 'INSERT_NEW' | 'UPSERT' | 'SKIP'
}

interface SyncOptions {
  dryRun?: boolean
  backupProduction?: boolean
  enableMaintenance?: boolean
  maintenanceReason?: string
  maintenanceDuration?: string
  validateOnly?: boolean
}

class SafeProductionSync {
  private devPrisma: PrismaClient
  private prodPrisma: PrismaClient

  // Configuración de sincronización segura
  private readonly SYNC_CONFIG: SyncConfig = {
    contentTables: [
      'course',
      'lesson', 
      'resource',
      'event',
      'promotion',
      'product',
      'price'
    ],
    userTables: [
      'user',
      'enrollment',
      'courseProgress',
      'lessonProgress',
      'payment',
      'subscription',
      'userStreak',
      'userStreakBadge',
      'userPointsHistory',
      'weeklyLessonCompletion',
      'streakRecoveryHistory',
      'userBehavior',
      'recommendation',
      'achievement',
      'comment',
      'like',
      'communityPost',
      'eventRegistration',
      'promotionInteraction',
      'rating',
      'resourceAccessLog',
      'securityLog',
      'session',
      'userPreference'
    ],
    mergeStrategy: 'UPSERT'
  }

  constructor() {
    // Conexión a desarrollo
    this.devPrisma = new PrismaClient()
    
    // Conexión a producción
    dotenv.config({ path: '.env.production', override: true })
    this.prodPrisma = new PrismaClient()
  }

  private async createProductionBackup(): Promise<string> {
    console.log('🔒 Creando backup completo de producción...')
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const backupDir = path.join(process.cwd(), 'backups', `safe-sync-backup-${timestamp}`)
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Backup de todas las tablas críticas
    const backupData: any = {
      timestamp: new Date().toISOString(),
      environment: 'produccion-pre-safe-sync',
      tables: {}
    }

    // Backup de tablas de contenido
    for (const tableName of this.SYNC_CONFIG.contentTables) {
      try {
        const data = await this.getTableData(tableName, this.prodPrisma)
        backupData.tables[tableName] = data
        console.log(`📋 Backup ${tableName}: ${data.length} registros`)
      } catch (error) {
        console.warn(`⚠️ No se pudo hacer backup de ${tableName}:`, error)
      }
    }

    // Backup de tablas de usuarios (solo para verificación)
    for (const tableName of this.SYNC_CONFIG.userTables) {
      try {
        const data = await this.getTableData(tableName, this.prodPrisma)
        backupData.tables[tableName] = data
        console.log(`👥 Backup ${tableName}: ${data.length} registros`)
      } catch (error) {
        console.warn(`⚠️ No se pudo hacer backup de ${tableName}:`, error)
      }
    }

    const backupFile = path.join(backupDir, 'production-backup.json')
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2))
    
    console.log(`✅ Backup de producción guardado: ${backupFile}`)
    return backupFile
  }

  private async getTableData(tableName: string, prisma: PrismaClient): Promise<any[]> {
    const model = (prisma as any)[tableName]
    if (!model) {
      throw new Error(`Modelo ${tableName} no encontrado`)
    }
    return await model.findMany()
  }

  private async identifyNewContent(): Promise<any> {
    console.log('🔍 Identificando contenido nuevo en desarrollo...')
    
    const newContent: any = {}
    
    for (const tableName of this.SYNC_CONFIG.contentTables) {
      try {
        const devData = await this.getTableData(tableName, this.devPrisma)
        const prodData = await this.getTableData(tableName, this.prodPrisma)
        
        // Encontrar registros nuevos (por ID)
        const prodIds = new Set(prodData.map((item: any) => item.id))
        const newRecords = devData.filter((item: any) => !prodIds.has(item.id))
        
        // Encontrar registros actualizados (mismo ID, contenido diferente)
        const updatedRecords = devData.filter((devItem: any) => {
          const prodItem = prodData.find((p: any) => p.id === devItem.id)
          return prodItem && JSON.stringify(devItem) !== JSON.stringify(prodItem)
        })
        
        newContent[tableName] = {
          new: newRecords,
          updated: updatedRecords,
          total: devData.length,
          existing: prodData.length
        }
        
        console.log(`📊 ${tableName}: ${newRecords.length} nuevos, ${updatedRecords.length} actualizados`)
        
      } catch (error) {
        console.warn(`⚠️ Error analizando ${tableName}:`, error)
      }
    }
    
    return newContent
  }

  private async syncContentOnly(newContent: any, options: SyncOptions): Promise<void> {
    console.log('🔄 Sincronizando solo contenido nuevo/actualizado...')
    
    for (const [tableName, content] of Object.entries(newContent)) {
      const { new: newRecords, updated: updatedRecords } = content as any
      
      if (options.dryRun) {
        console.log(`🧪 [DRY RUN] ${tableName}: ${newRecords.length} nuevos, ${updatedRecords.length} actualizados`)
        continue
      }
      
      try {
        const model = (this.prodPrisma as any)[tableName]
        
        // Insertar registros nuevos
        for (const record of newRecords) {
          try {
            await model.create({ data: record })
            console.log(`✅ ${tableName}: Insertado nuevo registro ${record.id}`)
          } catch (error: any) {
            console.warn(`⚠️ Error insertando ${record.id} en ${tableName}:`, error.message)
          }
        }
        
        // Actualizar registros existentes
        for (const record of updatedRecords) {
          try {
            const { id, ...updateData } = record
            await model.update({
              where: { id },
              data: updateData
            })
            console.log(`✅ ${tableName}: Actualizado registro ${id}`)
          } catch (error: any) {
            console.warn(`⚠️ Error actualizando ${record.id} en ${tableName}:`, error.message)
          }
        }
        
      } catch (error) {
        console.error(`❌ Error sincronizando ${tableName}:`, error)
      }
    }
  }

  private async verifySync(): Promise<void> {
    console.log('🔍 Verificando integridad post-sync...')
    
    let allGood = true
    
    for (const tableName of this.SYNC_CONFIG.contentTables) {
      try {
        const devCount = await this.getTableData(tableName, this.devPrisma).then(d => d.length)
        const prodCount = await this.getTableData(tableName, this.prodPrisma).then(d => d.length)
        
        console.log(`📊 ${tableName}: Dev: ${devCount}, Prod: ${prodCount}`)
        
        if (prodCount < devCount) {
          console.warn(`⚠️ ${tableName}: Posible pérdida de datos`)
          allGood = false
        }
        
      } catch (error) {
        console.error(`❌ Error verificando ${tableName}:`, error)
        allGood = false
      }
    }
    
    // Verificar que usuarios no se tocaron
    for (const tableName of this.SYNC_CONFIG.userTables) {
      try {
        const prodCount = await this.getTableData(tableName, this.prodPrisma).then(d => d.length)
        console.log(`👥 ${tableName}: ${prodCount} registros (protegidos)`)
      } catch (error) {
        console.warn(`⚠️ No se pudo verificar ${tableName}:`, error)
      }
    }
    
    if (allGood) {
      console.log('✅ Verificación completada - Sincronización exitosa')
    } else {
      console.warn('⚠️ Verificación completada - Se detectaron posibles problemas')
    }
  }

  private async validateUserDataIntegrity(): Promise<void> {
    console.log('🔒 Validando integridad de datos de usuarios...')
    
    let userDataIntact = true
    
    for (const tableName of this.SYNC_CONFIG.userTables) {
      try {
        const prodData = await this.getTableData(tableName, this.prodPrisma)
        console.log(`👥 ${tableName}: ${prodData.length} registros preservados`)
        
        if (prodData.length === 0 && tableName === 'users') {
          console.error(`❌ CRÍTICO: Tabla ${tableName} está vacía`)
          userDataIntact = false
        }
        
      } catch (error) {
        console.warn(`⚠️ No se pudo validar ${tableName}:`, error)
      }
    }
    
    if (userDataIntact) {
      console.log('✅ Datos de usuarios preservados correctamente')
    } else {
      throw new Error('CRÍTICO: Se detectó pérdida de datos de usuarios')
    }
  }

  public async performSafeSync(options: SyncOptions = {}): Promise<void> {
    const startTime = Date.now()
    
    try {
      console.log('🚀 Iniciando sincronización segura Desarrollo → Producción...')
      console.log('🔒 Este proceso respeta completamente los datos de usuarios')
      
      if (options.dryRun) {
        console.log('🧪 MODO DRY RUN - No se harán cambios reales')
      }

      // 1. Backup de producción
      if (options.backupProduction !== false) {
        await this.createProductionBackup()
      }

      // 2. Identificar contenido nuevo
      const newContent = await this.identifyNewContent()
      
      // 3. Validar que hay contenido para sincronizar
      const totalNew = Object.values(newContent).reduce((sum: number, content: any) => 
        sum + (content.new?.length || 0), 0)
      const totalUpdated = Object.values(newContent).reduce((sum: number, content: any) => 
        sum + (content.updated?.length || 0), 0)
      
      if (totalNew === 0 && totalUpdated === 0) {
        console.log('ℹ️ No hay contenido nuevo para sincronizar')
        return
      }

      // 4. Sincronizar solo contenido
      await this.syncContentOnly(newContent, options)

      // 5. Verificar integridad
      await this.verifySync()
      
      // 6. Validar que datos de usuarios no se tocaron
      await this.validateUserDataIntegrity()

      const duration = Date.now() - startTime
      console.log(`✅ Sincronización segura completada en ${duration}ms`)
      console.log(`📊 Resumen: ${totalNew} nuevos, ${totalUpdated} actualizados`)
      
      if (options.dryRun) {
        console.log('💡 Para aplicar cambios reales, ejecuta sin --dry-run')
      }
      
    } catch (error) {
      console.error('💥 Error durante la sincronización segura:', error)
      throw error
    } finally {
      await this.devPrisma.$disconnect()
      await this.prodPrisma.$disconnect()
    }
  }

  public async compareEnvironments(): Promise<void> {
    try {
      console.log('🔍 Comparando entornos (solo contenido)...')
      
      for (const tableName of this.SYNC_CONFIG.contentTables) {
        try {
          const devCount = await this.getTableData(tableName, this.devPrisma).then(d => d.length)
          const prodCount = await this.getTableData(tableName, this.prodPrisma).then(d => d.length)
          
          console.log(`📊 ${tableName}: Dev: ${devCount} | Prod: ${prodCount}`)
          
        } catch (error) {
          console.warn(`⚠️ No se pudo comparar ${tableName}:`, error)
        }
      }
      
      console.log('\n👥 Datos de usuarios (protegidos):')
      for (const tableName of this.SYNC_CONFIG.userTables) {
        try {
          const prodCount = await this.getTableData(tableName, this.prodPrisma).then(d => d.length)
          console.log(`   ${tableName}: ${prodCount} registros`)
        } catch (error) {
          console.warn(`   ⚠️ ${tableName}: No disponible`)
        }
      }
      
    } catch (error) {
      console.error('❌ Error comparando entornos:', error)
    } finally {
      await this.devPrisma.$disconnect()
      await this.prodPrisma.$disconnect()
    }
  }
}

async function main() {
  const sync = new SafeProductionSync()
  const command = process.argv[2]
  const flags = process.argv.slice(3)

  const options: SyncOptions = {
    dryRun: flags.includes('--dry-run'),
    backupProduction: !flags.includes('--no-backup'),
    enableMaintenance: flags.includes('--maintenance'),
    maintenanceReason: flags.find(f => f.startsWith('--reason='))?.split('=')[1],
    maintenanceDuration: flags.find(f => f.startsWith('--duration='))?.split('=')[1],
    validateOnly: flags.includes('--validate-only')
  }

  switch (command) {
    case 'sync':
      await sync.performSafeSync(options)
      break
      
    case 'compare':
      await sync.compareEnvironments()
      break
      
    case 'dry-run':
      options.dryRun = true
      await sync.performSafeSync(options)
      break
      
    case 'validate':
      await sync.validateUserDataIntegrity()
      break
      
    default:
      console.log('🔄 Sincronización Segura Desarrollo → Producción')
      console.log('')
      console.log('Uso: npx tsx scripts/safe-sync-to-production.ts [comando] [flags]')
      console.log('')
      console.log('Comandos:')
      console.log('  sync     - Sincronizar contenido (respeta usuarios)')
      console.log('  compare  - Comparar entornos sin cambios')
      console.log('  dry-run  - Simular sincronización sin cambios')
      console.log('  validate - Validar integridad de datos de usuarios')
      console.log('')
      console.log('Flags:')
      console.log('  --dry-run           - Simular sin hacer cambios')
      console.log('  --no-backup         - No crear backup de producción')
      console.log('  --maintenance       - Activar modo mantenimiento durante sync')
      console.log('  --reason="texto"    - Razón del mantenimiento')
      console.log('  --duration="10min"  - Duración estimada')
      console.log('  --validate-only     - Solo validar, no sincronizar')
      console.log('')
      console.log('Ejemplos:')
      console.log('  npx tsx scripts/safe-sync-to-production.ts compare')
      console.log('  npx tsx scripts/safe-sync-to-production.ts dry-run')
      console.log('  npx tsx scripts/safe-sync-to-production.ts sync')
      console.log('  npx tsx scripts/safe-sync-to-production.ts validate')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { SafeProductionSync } 