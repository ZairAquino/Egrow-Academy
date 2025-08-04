#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno de producción
dotenv.config({ path: '.env.production', override: true })

class StreakValidation {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  private async validateUserStreaks(): Promise<void> {
    console.log('🔍 Validando sistema de rachas de usuarios...')
    
    try {
      const userStreaks = await this.prisma.userStreak.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      console.log(`📊 Total de rachas activas: ${userStreaks.length}`)
      
      for (const streak of userStreaks) {
        console.log(`👤 Usuario: ${streak.user.firstName} ${streak.user.lastName} (${streak.user.email})`)
        console.log(`   🏆 Racha actual: ${streak.currentStreak} semanas`)
        console.log(`   📈 Racha más larga: ${streak.longestStreak} semanas`)
        console.log(`   🎯 Meta semanal: ${streak.weeklyGoal} lecciones`)
        console.log(`   ✅ Completadas esta semana: ${streak.lessonsCompletedThisWeek}`)
        console.log(`   📅 Última actividad: ${streak.lastActivityDate}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando rachas:', error)
    }
  }

  private async validateStreakBadges(): Promise<void> {
    console.log('🏅 Validando badges de rachas...')
    
    try {
      const badges = await this.prisma.userStreakBadge.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      console.log(`📊 Total de badges otorgados: ${badges.length}`)
      
      const badgeTypes = badges.reduce((acc: any, badge) => {
        acc[badge.badgeType] = (acc[badge.badgeType] || 0) + 1
        return acc
      }, {})

      console.log('📈 Distribución de badges:')
      for (const [type, count] of Object.entries(badgeTypes)) {
        console.log(`   ${type}: ${count} usuarios`)
      }
      
    } catch (error) {
      console.error('❌ Error validando badges:', error)
    }
  }

  private async validateWeeklyCompletions(): Promise<void> {
    console.log('📅 Validando completaciones semanales...')
    
    try {
      const completions = await this.prisma.weeklyLessonCompletion.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          lastLessonAt: 'desc'
        },
        take: 10
      })

      console.log(`📊 Últimas 10 completaciones:`)
      
      for (const completion of completions) {
        console.log(`   👤 ${completion.user.firstName} ${completion.user.lastName}`)
        console.log(`   📚 Curso: ${completion.courseId}`)
        console.log(`   📅 ${completion.lastLessonAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando completaciones:', error)
    }
  }

  private async validatePointsHistory(): Promise<void> {
    console.log('💎 Validando historial de puntos...')
    
    try {
      const pointsHistory = await this.prisma.userPointsHistory.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })

      console.log(`📊 Últimas 10 transacciones de puntos:`)
      
      for (const points of pointsHistory) {
        console.log(`   👤 ${points.user.firstName} ${points.user.lastName}`)
        console.log(`   💎 ${points.pointsEarned} puntos por ${points.reason}`)
        console.log(`   📅 ${points.createdAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando puntos:', error)
    }
  }

  private async validateStreakRecovery(): Promise<void> {
    console.log('🔄 Validando recuperaciones de rachas...')
    
    try {
      const recoveries = await this.prisma.streakRecoveryHistory.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          recoveredAt: 'desc'
        },
        take: 5
      })

      console.log(`📊 Últimas 5 recuperaciones de rachas:`)
      
      for (const recovery of recoveries) {
        console.log(`   👤 ${recovery.user.firstName} ${recovery.user.lastName}`)
        console.log(`   🔄 Recuperó racha de ${recovery.originalStreakLost} semanas`)
        console.log(`   📅 ${recovery.recoveredAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando recuperaciones:', error)
    }
  }

  private async validateSystemIntegrity(): Promise<void> {
    console.log('🔒 Validando integridad del sistema...')
    
    try {
      // Verificar que usuarios con rachas tienen datos consistentes
      const usersWithStreaks = await this.prisma.user.findMany({
        where: {
          userStreaks: {
            some: {}
          }
        },
        include: {
          userStreaks: true,
          userStreakBadges: true,
          weeklyLessonCompletions: {
            where: {
              lastLessonAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Última semana
              }
            }
          }
        }
      })

      console.log(`📊 Usuarios con rachas activas: ${usersWithStreaks.length}`)
      
      let integrityIssues = 0
      
      for (const user of usersWithStreaks) {
        const streak = user.userStreaks[0]
        const weeklyCompletions = user.weeklyLessonCompletions.length
        
        if (streak && streak.lessonsCompletedThisWeek !== weeklyCompletions) {
          console.warn(`⚠️ Inconsistencia en usuario ${user.email}:`)
          console.warn(`   Racha dice: ${streak.lessonsCompletedThisWeek} lecciones`)
          console.warn(`   Real completadas: ${weeklyCompletions} lecciones`)
          integrityIssues++
        }
      }
      
      if (integrityIssues === 0) {
        console.log('✅ Integridad del sistema verificada - Sin problemas detectados')
      } else {
        console.warn(`⚠️ Se detectaron ${integrityIssues} inconsistencias`)
      }
      
    } catch (error) {
      console.error('❌ Error validando integridad:', error)
    }
  }

  public async performFullValidation(): Promise<void> {
    console.log('🚀 Iniciando validación completa del sistema de rachas...')
    console.log('')
    
    try {
      await this.validateUserStreaks()
      console.log('')
      
      await this.validateStreakBadges()
      console.log('')
      
      await this.validateWeeklyCompletions()
      console.log('')
      
      await this.validatePointsHistory()
      console.log('')
      
      await this.validateStreakRecovery()
      console.log('')
      
      await this.validateSystemIntegrity()
      console.log('')
      
      console.log('✅ Validación completa finalizada')
      
    } catch (error) {
      console.error('💥 Error durante la validación:', error)
    } finally {
      await this.prisma.$disconnect()
    }
  }

  public async quickCheck(): Promise<void> {
    console.log('⚡ Verificación rápida del sistema de rachas...')
    
    try {
      const totalUsers = await this.prisma.user.count()
      const usersWithStreaks = await this.prisma.userStreak.count()
      const totalBadges = await this.prisma.userStreakBadge.count()
      const weeklyCompletions = await this.prisma.weeklyLessonCompletion.count({
        where: {
          lastLessonAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })

      console.log('📊 Estado del sistema:')
      console.log(`   👥 Total usuarios: ${totalUsers}`)
      console.log(`   🏆 Usuarios con rachas: ${usersWithStreaks}`)
      console.log(`   🏅 Total badges otorgados: ${totalBadges}`)
      console.log(`   📅 Completaciones esta semana: ${weeklyCompletions}`)
      
      if (usersWithStreaks > 0) {
        console.log('✅ Sistema de rachas activo')
      } else {
        console.log('ℹ️ No hay usuarios con rachas activas')
      }
      
    } catch (error) {
      console.error('❌ Error en verificación rápida:', error)
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

async function main() {
  const validator = new StreakValidation()
  const command = process.argv[2]

  switch (command) {
    case 'full':
      await validator.performFullValidation()
      break
      
    case 'quick':
      await validator.quickCheck()
      break
      
    default:
      console.log('🔍 Validación del Sistema de Rachas en Producción')
      console.log('')
      console.log('Uso: npx tsx scripts/validate-streaks-production.ts [comando]')
      console.log('')
      console.log('Comandos:')
      console.log('  full  - Validación completa del sistema')
      console.log('  quick - Verificación rápida del estado')
      console.log('')
      console.log('Ejemplos:')
      console.log('  npx tsx scripts/validate-streaks-production.ts quick')
      console.log('  npx tsx scripts/validate-streaks-production.ts full')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { StreakValidation } 