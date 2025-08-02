#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { MaintenanceMode } from './maintenance-mode'

// Cargar variables de entorno de desarrollo por defecto
dotenv.config()

interface SyncOptions {
  dryRun?: boolean
  backupProduction?: boolean
  syncUsers?: boolean // Por defecto false para proteger usuarios
  enableMaintenance?: boolean // Activar modo mantenimiento automáticamente
  maintenanceReason?: string
  maintenanceDuration?: string
}

class ProductionSync {
  private devPrisma: PrismaClient
  private prodPrisma: PrismaClient
  private maintenance: MaintenanceMode

  constructor() {
    // Conexión a desarrollo
    this.devPrisma = new PrismaClient()
    
    // Conexión a producción
    dotenv.config({ path: '.env.production', override: true })
    this.prodPrisma = new PrismaClient()
    
    // Sistema de mantenimiento
    this.maintenance = new MaintenanceMode()
  }

  private async backupProduction(): Promise<string> {
    console.log('🔒 Creando backup de producción antes de sincronizar...')
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const backupFile = path.join(process.cwd(), 'backups', `production-pre-sync-${timestamp}.json`)
    
    const backupData = {
      timestamp: new Date().toISOString(),
      environment: 'produccion-pre-sync',
      tables: {
        users: await this.prodPrisma.user.findMany(),
        courses: await this.prodPrisma.course.findMany(),
        lessons: await this.prodPrisma.lesson.findMany(),
        resources: await this.prodPrisma.resource.findMany(),
        events: await this.prodPrisma.event.findMany(),
        promotions: await this.prodPrisma.promotion.findMany(),
        enrollments: await this.prodPrisma.enrollment.findMany(),
        payments: await this.prodPrisma.payment.findMany()
      }
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2))
    console.log(`✅ Backup de producción guardado: ${backupFile}`)
    
    return backupFile
  }

  private async syncContentTables(options: SyncOptions): Promise<void> {
    console.log('📋 Sincronizando contenido (NO usuarios)...')
    
    // Tablas de contenido que se pueden sincronizar sin riesgo
    const contentTables = [
      {
        name: 'courses',
        devModel: this.devPrisma.course,
        prodModel: this.prodPrisma.course,
        identifier: 'id'
      },
      {
        name: 'lessons', 
        devModel: this.devPrisma.lesson,
        prodModel: this.prodPrisma.lesson,
        identifier: 'id'
      },
      {
        name: 'resources',
        devModel: this.devPrisma.resource,
        prodModel: this.prodPrisma.resource,
        identifier: 'id'
      },
      {
        name: 'events',
        devModel: this.devPrisma.event,
        prodModel: this.prodPrisma.event,
        identifier: 'id'
      },
      {
        name: 'promotions',
        devModel: this.prodPrisma.promotion,
        prodModel: this.prodPrisma.promotion,
        identifier: 'id'
      }
    ]

    for (const table of contentTables) {
      await this.syncTable(table, options)
    }
  }

  private async syncTable(table: any, options: SyncOptions): Promise<void> {
    try {
      console.log(`🔄 Sincronizando ${table.name}...`)
      
      // Obtener datos de desarrollo
      const devData = await table.devModel.findMany()
      console.log(`📊 ${table.name}: ${devData.length} registros en desarrollo`)
      
      if (options.dryRun) {
        console.log(`🧪 [DRY RUN] Se sincronizarían ${devData.length} registros de ${table.name}`)
        return
      }

      // Limpiar tabla en producción (solo contenido, no usuarios)
      await table.prodModel.deleteMany({})
      console.log(`🗑️ ${table.name}: tabla limpiada en producción`)
      
      // Insertar datos de desarrollo en producción
      let syncedCount = 0
      for (const record of devData) {
        try {
          await table.prodModel.create({ data: record })
          syncedCount++
        } catch (error: any) {
          console.warn(`⚠️ Error sincronizando registro en ${table.name}:`, error.message)
        }
      }
      
      console.log(`✅ ${table.name}: ${syncedCount}/${devData.length} registros sincronizados`)
      
    } catch (error) {
      console.error(`❌ Error sincronizando ${table.name}:`, error)
    }
  }

  private async syncUsersCarefully(options: SyncOptions): Promise<void> {
    if (!options.syncUsers) {
      console.log('🔒 Omitiendo sincronización de usuarios (protegidos)')
      return
    }

    console.log('⚠️ Sincronizando usuarios (CUIDADO)...')
    
    const devUsers = await this.devPrisma.user.findMany()
    const prodUsers = await this.prodPrisma.user.findMany()
    
    console.log(`📊 Usuarios - Dev: ${devUsers.length}, Prod: ${prodUsers.length}`)
    
    if (options.dryRun) {
      console.log('🧪 [DRY RUN] Usuarios NO se sincronizarían por seguridad')
      return
    }

    // Aquí implementarías lógica más sofisticada para usuarios
    console.log('🔒 Sincronización de usuarios requiere implementación manual')
  }

  public async performSync(options: SyncOptions = {}): Promise<void> {
    const startTime = Date.now()
    let maintenanceEnabled = false
    
    try {
      console.log('🚀 Iniciando sincronización Desarrollo → Producción...')
      
      if (options.dryRun) {
        console.log('🧪 MODO DRY RUN - No se harán cambios reales')
      }

      // 1. Activar modo mantenimiento si se solicita
      if (options.enableMaintenance && !options.dryRun) {
        await this.maintenance.enable({
          reason: options.maintenanceReason || 'Sincronización de contenido',
          duration: options.maintenanceDuration || '10 minutos'
        })
        maintenanceEnabled = true
        console.log('⏱️ Esperando 30 segundos para que se propague el mantenimiento...')
        await new Promise(resolve => setTimeout(resolve, 30000))
      }

      // 2. Backup de producción
      if (options.backupProduction !== false) {
        await this.backupProduction()
      }

      // 3. Sincronizar contenido (seguro)
      await this.syncContentTables(options)

      // 4. Sincronizar usuarios (con cuidado)
      await this.syncUsersCarefully(options)

      const duration = Date.now() - startTime
      console.log(`✅ Sincronización completada en ${duration}ms`)
      
      if (options.dryRun) {
        console.log('💡 Para aplicar cambios reales, ejecuta sin --dry-run')
      }
      
    } catch (error) {
      console.error('💥 Error durante la sincronización:', error)
      throw error
    } finally {
      // 5. Desactivar modo mantenimiento
      if (maintenanceEnabled) {
        console.log('⏱️ Esperando 10 segundos adicionales antes de desactivar mantenimiento...')
        await new Promise(resolve => setTimeout(resolve, 10000))
        await this.maintenance.disable()
      }
      
      await this.devPrisma.$disconnect()
      await this.prodPrisma.$disconnect()
    }
  }

  public async compareEnvironments(): Promise<void> {
    try {
      console.log('🔍 Comparando entornos...')
      
      const devCourses = await this.devPrisma.course.count()
      const prodCourses = await this.prodPrisma.course.count()
      
      const devLessons = await this.devPrisma.lesson.count()
      const prodLessons = await this.prodPrisma.lesson.count()
      
      const devUsers = await this.devPrisma.user.count()
      const prodUsers = await this.prodPrisma.user.count()
      
      const devResources = await this.devPrisma.resource.count()
      const prodResources = await this.prodPrisma.resource.count()

      console.log('📊 Comparación de entornos:')
      console.log(`   Cursos:    Dev: ${devCourses} | Prod: ${prodCourses}`)
      console.log(`   Lecciones: Dev: ${devLessons} | Prod: ${prodLessons}`)
      console.log(`   Usuarios:  Dev: ${devUsers} | Prod: ${prodUsers}`)
      console.log(`   Recursos:  Dev: ${devResources} | Prod: ${prodResources}`)
      
    } catch (error) {
      console.error('❌ Error comparando entornos:', error)
    } finally {
      await this.devPrisma.$disconnect()
      await this.prodPrisma.$disconnect()
    }
  }
}

async function main() {
  const sync = new ProductionSync()
  const command = process.argv[2]
  const flags = process.argv.slice(3)

  const options: SyncOptions = {
    dryRun: flags.includes('--dry-run'),
    backupProduction: !flags.includes('--no-backup'),
    syncUsers: flags.includes('--sync-users'),
    enableMaintenance: flags.includes('--maintenance'),
    maintenanceReason: flags.find(f => f.startsWith('--reason='))?.split('=')[1],
    maintenanceDuration: flags.find(f => f.startsWith('--duration='))?.split('=')[1]
  }

  switch (command) {
    case 'sync':
      await sync.performSync(options)
      break
      
    case 'compare':
      await sync.compareEnvironments()
      break
      
    case 'dry-run':
      options.dryRun = true
      await sync.performSync(options)
      break
      
    default:
      console.log('🔄 Sincronización Desarrollo → Producción')
      console.log('')
      console.log('Uso: npx tsx scripts/sync-to-production.ts [comando] [flags]')
      console.log('')
      console.log('Comandos:')
      console.log('  sync     - Sincronizar desarrollo → producción')
      console.log('  compare  - Comparar entornos sin cambios')
      console.log('  dry-run  - Simular sincronización sin cambios')
      console.log('')
      console.log('Flags:')
      console.log('  --dry-run           - Simular sin hacer cambios')
      console.log('  --no-backup         - No crear backup de producción')
      console.log('  --sync-users        - Incluir usuarios (PELIGROSO)')
      console.log('  --maintenance       - Activar modo mantenimiento durante sync')
      console.log('  --reason="texto"    - Razón del mantenimiento')
      console.log('  --duration="10min"  - Duración estimada')
      console.log('')
      console.log('Ejemplos:')
      console.log('  npx tsx scripts/sync-to-production.ts compare')
      console.log('  npx tsx scripts/sync-to-production.ts dry-run')
      console.log('  npx tsx scripts/sync-to-production.ts sync --maintenance')
      console.log('  npx tsx scripts/sync-to-production.ts sync --maintenance --reason="Nuevo curso"')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { ProductionSync }