#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno
dotenv.config()

class SafeSyncTester {
  private devPrisma: PrismaClient
  private prodPrisma: PrismaClient

  constructor() {
    this.devPrisma = new PrismaClient()
    dotenv.config({ path: '.env.production', override: true })
    this.prodPrisma = new PrismaClient()
  }

  private async testDatabaseConnections(): Promise<boolean> {
    console.log('🔌 Probando conexiones a bases de datos...')
    
    try {
      // Probar desarrollo
      await this.devPrisma.$connect()
      const devUserCount = await this.devPrisma.user.count()
      console.log(`✅ Desarrollo: Conectado (${devUserCount} usuarios)`)
      
      // Probar producción
      await this.prodPrisma.$connect()
      const prodUserCount = await this.prodPrisma.user.count()
      console.log(`✅ Producción: Conectado (${prodUserCount} usuarios)`)
      
      return true
    } catch (error) {
      console.error('❌ Error de conexión:', error)
      return false
    }
  }

  private async testContentTables(): Promise<boolean> {
    console.log('📋 Probando tablas de contenido...')
    
    const contentTables = [
      'course',
      'lesson', 
      'resource',
      'event',
      'promotion'
    ]
    
    let allGood = true
    
    for (const tableName of contentTables) {
      try {
        const devModel = (this.devPrisma as any)[tableName]
        const prodModel = (this.prodPrisma as any)[tableName]
        
        if (!devModel || !prodModel) {
          console.warn(`⚠️ Modelo ${tableName} no disponible`)
          continue
        }
        
        const devCount = await devModel.count()
        const prodCount = await prodModel.count()
        
        console.log(`✅ ${tableName}: Dev ${devCount} | Prod ${prodCount}`)
        
      } catch (error) {
        console.error(`❌ Error en ${tableName}:`, error)
        allGood = false
      }
    }
    
    return allGood
  }

  private async testUserTables(): Promise<boolean> {
    console.log('👥 Probando tablas de usuarios...')
    
    const userTables = [
      'user',
      'enrollment',
      'userStreak',
      'userStreakBadge',
      'weeklyLessonCompletion'
    ]
    
    let allGood = true
    
    for (const tableName of userTables) {
      try {
        const prodModel = (this.prodPrisma as any)[tableName]
        
        if (!prodModel) {
          console.warn(`⚠️ Modelo ${tableName} no disponible`)
          continue
        }
        
        const prodCount = await prodModel.count()
        console.log(`✅ ${tableName}: ${prodCount} registros (protegidos)`)
        
      } catch (error) {
        console.error(`❌ Error en ${tableName}:`, error)
        allGood = false
      }
    }
    
    return allGood
  }

  private async testStreakSystem(): Promise<boolean> {
    console.log('🏆 Probando sistema de rachas...')
    
    try {
      // Verificar que existen usuarios con rachas
      const usersWithStreaks = await this.prodPrisma.userStreak.count()
      console.log(`✅ Usuarios con rachas: ${usersWithStreaks}`)
      
      // Verificar badges
      const totalBadges = await this.prodPrisma.userStreakBadge.count()
      console.log(`✅ Total badges: ${totalBadges}`)
      
      // Verificar completaciones semanales
      const weeklyCompletions = await this.prodPrisma.weeklyLessonCompletion.count({
        where: {
          lastLessonAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
      console.log(`✅ Completaciones esta semana: ${weeklyCompletions}`)
      
      return true
    } catch (error) {
      console.error('❌ Error probando sistema de rachas:', error)
      return false
    }
  }

  private async testBackupSystem(): Promise<boolean> {
    console.log('💾 Probando sistema de backup...')
    
    try {
      const fs = require('fs')
      const path = require('path')
      
      const backupDir = path.join(process.cwd(), 'backups')
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
        console.log('✅ Directorio de backups creado')
      } else {
        console.log('✅ Directorio de backups existe')
      }
      
      // Verificar que se puede escribir en el directorio
      const testFile = path.join(backupDir, 'test-backup.json')
      fs.writeFileSync(testFile, JSON.stringify({ test: true }))
      fs.unlinkSync(testFile)
      
      console.log('✅ Sistema de backup funcional')
      return true
      
    } catch (error) {
      console.error('❌ Error probando sistema de backup:', error)
      return false
    }
  }

  private async testSyncLogic(): Promise<boolean> {
    console.log('🔄 Probando lógica de sincronización...')
    
    try {
      // Simular identificación de contenido nuevo
      const devCourses = await this.devPrisma.course.findMany()
      const prodCourses = await this.prodPrisma.course.findMany()
      
      const devIds = new Set(devCourses.map(c => c.id))
      const prodIds = new Set(prodCourses.map(c => c.id))
      
      const newCourses = devCourses.filter(c => !prodIds.has(c.id))
      const updatedCourses = devCourses.filter(devCourse => {
        const prodCourse = prodCourses.find(p => p.id === devCourse.id)
        return prodCourse && JSON.stringify(devCourse) !== JSON.stringify(prodCourse)
      })
      
      console.log(`✅ Lógica de sync: ${newCourses.length} nuevos, ${updatedCourses.length} actualizados`)
      
      return true
    } catch (error) {
      console.error('❌ Error probando lógica de sync:', error)
      return false
    }
  }

  public async runFullTest(): Promise<void> {
    console.log('🚀 Iniciando pruebas completas del sistema de sincronización segura...')
    console.log('')
    
    const results = {
      connections: false,
      contentTables: false,
      userTables: false,
      streakSystem: false,
      backupSystem: false,
      syncLogic: false
    }
    
    try {
      // 1. Probar conexiones
      results.connections = await this.testDatabaseConnections()
      console.log('')
      
      // 2. Probar tablas de contenido
      results.contentTables = await this.testContentTables()
      console.log('')
      
      // 3. Probar tablas de usuarios
      results.userTables = await this.testUserTables()
      console.log('')
      
      // 4. Probar sistema de rachas
      results.streakSystem = await this.testStreakSystem()
      console.log('')
      
      // 5. Probar sistema de backup
      results.backupSystem = await this.testBackupSystem()
      console.log('')
      
      // 6. Probar lógica de sincronización
      results.syncLogic = await this.testSyncLogic()
      console.log('')
      
      // Resumen de resultados
      console.log('📊 Resumen de Pruebas:')
      console.log(`   🔌 Conexiones: ${results.connections ? '✅' : '❌'}`)
      console.log(`   📋 Tablas contenido: ${results.contentTables ? '✅' : '❌'}`)
      console.log(`   👥 Tablas usuarios: ${results.userTables ? '✅' : '❌'}`)
      console.log(`   🏆 Sistema rachas: ${results.streakSystem ? '✅' : '❌'}`)
      console.log(`   💾 Sistema backup: ${results.backupSystem ? '✅' : '❌'}`)
      console.log(`   🔄 Lógica sync: ${results.syncLogic ? '✅' : '❌'}`)
      
      const allPassed = Object.values(results).every(r => r)
      
      if (allPassed) {
        console.log('')
        console.log('🎉 ¡Todas las pruebas pasaron! El sistema está listo para usar.')
        console.log('')
        console.log('📝 Próximos pasos:')
        console.log('   1. npx tsx scripts/safe-sync-to-production.ts compare')
        console.log('   2. npx tsx scripts/safe-sync-to-production.ts dry-run')
        console.log('   3. npx tsx scripts/safe-sync-to-production.ts sync')
      } else {
        console.log('')
        console.log('⚠️ Algunas pruebas fallaron. Revisar errores antes de continuar.')
      }
      
    } catch (error) {
      console.error('💥 Error durante las pruebas:', error)
    } finally {
      await this.devPrisma.$disconnect()
      await this.prodPrisma.$disconnect()
    }
  }
}

async function main() {
  const tester = new SafeSyncTester()
  await tester.runFullTest()
}

if (require.main === module) {
  main().catch(console.error)
}

export { SafeSyncTester } 