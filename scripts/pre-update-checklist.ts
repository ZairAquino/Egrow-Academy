#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno de producción
dotenv.config({ path: '.env.production', override: true })

class PreUpdateChecklist {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  private async checkUserDataIntegrity(): Promise<boolean> {
    console.log('🔍 Verificando integridad de datos de usuarios...')
    
    try {
      const userCount = await this.prisma.user.count()
      const streakCount = await this.prisma.userStreak.count()
      const badgeCount = await this.prisma.userStreakBadge.count()
      const pointsCount = await this.prisma.userPointsHistory.count()
      const progressCount = await this.prisma.courseProgress.count()
      
      console.log(`   👥 Usuarios: ${userCount}`)
      console.log(`   🏆 Rachas: ${streakCount}`)
      console.log(`   🏅 Badges: ${badgeCount}`)
      console.log(`   💎 Puntos: ${pointsCount}`)
      console.log(`   📊 Progreso: ${progressCount}`)
      
      if (userCount === 0) {
        console.error('❌ CRÍTICO: No hay usuarios en la base de datos')
        return false
      }
      
      console.log('✅ Datos de usuarios verificados')
      return true
      
    } catch (error) {
      console.error('❌ Error verificando datos de usuarios:', error)
      return false
    }
  }

  private async checkSystemHealth(): Promise<boolean> {
    console.log('🏥 Verificando salud del sistema...')
    
    try {
      // Verificar conexión a base de datos
      await this.prisma.$connect()
      
      // Verificar tablas críticas
      const criticalTables = [
        'user',
        'userStreak',
        'userStreakBadge',
        'userPointsHistory',
        'courseProgress'
      ]
      
      for (const table of criticalTables) {
        try {
          const count = await (this.prisma as any)[table].count()
          console.log(`   ✅ ${table}: ${count} registros`)
        } catch (error) {
          console.error(`   ❌ Error en ${table}:`, error)
          return false
        }
      }
      
      console.log('✅ Sistema saludable')
      return true
      
    } catch (error) {
      console.error('❌ Error verificando salud del sistema:', error)
      return false
    }
  }

  private async checkBackupSystem(): Promise<boolean> {
    console.log('💾 Verificando sistema de backup...')
    
    try {
      const fs = require('fs')
      const path = require('path')
      
      const backupDir = path.join(process.cwd(), 'backups')
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true })
        console.log('   ✅ Directorio de backups creado')
      } else {
        console.log('   ✅ Directorio de backups existe')
      }
      
      // Verificar que se puede escribir
      const testFile = path.join(backupDir, 'test-backup.json')
      fs.writeFileSync(testFile, JSON.stringify({ test: true }))
      fs.unlinkSync(testFile)
      
      console.log('✅ Sistema de backup funcional')
      return true
      
    } catch (error) {
      console.error('❌ Error verificando sistema de backup:', error)
      return false
    }
  }

  private async checkEnvironmentVariables(): Promise<boolean> {
    console.log('🔧 Verificando variables de entorno...')
    
    try {
      const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'STRIPE_SECRET_KEY',
        'UPLOADTHING_SECRET',
        'RESEND_API_KEY'
      ]
      
      for (const varName of requiredVars) {
        if (!process.env[varName]) {
          console.error(`   ❌ Variable ${varName} no encontrada`)
          return false
        }
        console.log(`   ✅ ${varName}: Configurada`)
      }
      
      console.log('✅ Variables de entorno verificadas')
      return true
      
    } catch (error) {
      console.error('❌ Error verificando variables de entorno:', error)
      return false
    }
  }

  public async runChecklist(): Promise<void> {
    console.log('🚀 CHECKLIST OBLIGATORIO - ANTES DE ACTUALIZACIÓN')
    console.log('=' .repeat(60))
    console.log('')
    
    const results = {
      userData: false,
      systemHealth: false,
      backupSystem: false,
      environment: false
    }
    
    try {
      // 1. Verificar datos de usuarios
      results.userData = await this.checkUserDataIntegrity()
      console.log('')
      
      // 2. Verificar salud del sistema
      results.systemHealth = await this.checkSystemHealth()
      console.log('')
      
      // 3. Verificar sistema de backup
      results.backupSystem = await this.checkBackupSystem()
      console.log('')
      
      // 4. Verificar variables de entorno
      results.environment = await this.checkEnvironmentVariables()
      console.log('')
      
      // Resumen
      console.log('📊 RESUMEN DEL CHECKLIST:')
      console.log(`   🔍 Datos de usuarios: ${results.userData ? '✅' : '❌'}`)
      console.log(`   🏥 Salud del sistema: ${results.systemHealth ? '✅' : '❌'}`)
      console.log(`   💾 Sistema de backup: ${results.backupSystem ? '✅' : '❌'}`)
      console.log(`   🔧 Variables de entorno: ${results.environment ? '✅' : '❌'}`)
      console.log('')
      
      const allPassed = Object.values(results).every(r => r)
      
      if (allPassed) {
        console.log('🎉 ¡TODOS LOS CHECKS PASARON!')
        console.log('✅ El sistema está listo para actualización')
        console.log('')
        console.log('📝 PRÓXIMOS PASOS:')
        console.log('   1. npx tsx scripts/safe-sync-to-production.ts compare')
        console.log('   2. npx tsx scripts/safe-sync-to-production.ts dry-run')
        console.log('   3. npx tsx scripts/safe-sync-to-production.ts sync')
        console.log('   4. npx tsx scripts/validate-streaks-production.ts quick')
      } else {
        console.log('⚠️ ALGUNOS CHECKS FALLARON')
        console.log('❌ NO PROCEDER CON LA ACTUALIZACIÓN')
        console.log('')
        console.log('🔧 CORREGIR PROBLEMAS ANTES DE CONTINUAR')
      }
      
    } catch (error) {
      console.error('💥 Error durante el checklist:', error)
      console.log('❌ NO PROCEDER CON LA ACTUALIZACIÓN')
    } finally {
      await this.prisma.$disconnect()
    }
  }

  public async showRules(): Promise<void> {
    console.log('📋 REGLAS CRÍTICAS DE PROTECCIÓN DE DATOS')
    console.log('=' .repeat(60))
    console.log('')
    console.log('❌ NUNCA eliminar usuarios registrados')
    console.log('❌ NUNCA borrar progreso de cursos')
    console.log('❌ NUNCA eliminar rachas ganadas')
    console.log('❌ NUNCA borrar puntos acumulados')
    console.log('❌ NUNCA eliminar badges otorgados')
    console.log('❌ NUNCA borrar pagos o suscripciones')
    console.log('❌ NUNCA eliminar comentarios o interacciones')
    console.log('❌ NUNCA borrar logs de seguridad o comportamiento')
    console.log('')
    console.log('✅ SOLO sincronizar contenido (cursos, lecciones, recursos)')
    console.log('✅ SIEMPRE hacer backup antes de cualquier cambio')
    console.log('✅ SIEMPRE validar después de cualquier cambio')
    console.log('')
    console.log('📖 Documentación completa: docs/USER-DATA-PROTECTION-RULES.md')
  }
}

async function main() {
  const checklist = new PreUpdateChecklist()
  const command = process.argv[2]

  switch (command) {
    case 'check':
      await checklist.runChecklist()
      break
      
    case 'rules':
      await checklist.showRules()
      break
      
    default:
      console.log('🔍 Checklist Obligatorio - Antes de Actualización')
      console.log('')
      console.log('Uso: npx tsx scripts/pre-update-checklist.ts [comando]')
      console.log('')
      console.log('Comandos:')
      console.log('  check - Ejecutar checklist completo')
      console.log('  rules - Mostrar reglas críticas')
      console.log('')
      console.log('Ejemplos:')
      console.log('  npx tsx scripts/pre-update-checklist.ts check')
      console.log('  npx tsx scripts/pre-update-checklist.ts rules')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { PreUpdateChecklist } 