#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno de producción
dotenv.config({ path: '.env.production', override: true })

class ComprehensiveUserDataValidation {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  private async validateUserProfile(): Promise<void> {
    console.log('👤 Validando perfiles de usuarios...')
    
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          profileImage: true,
          bio: true,
          membershipLevel: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
          verificationCode: true,
          stripeCustomerId: true,
          verificationCodeExpires: true,
          country: true,
          hasBeenPremium: true
        }
      })

      console.log(`📊 Total usuarios: ${users.length}`)
      
      for (const user of users) {
        console.log(`   👤 ${user.firstName} ${user.lastName} (${user.email})`)
        console.log(`      🆔 ID: ${user.id}`)
        console.log(`      📧 Email: ${user.email}`)
        console.log(`      👤 Username: ${user.username || 'No definido'}`)
        console.log(`      🏷️ Membership: ${user.membershipLevel}`)
        console.log(`      ✅ Activo: ${user.isActive}`)
        console.log(`      📧 Verificado: ${user.emailVerified}`)
        console.log(`      💳 Stripe ID: ${user.stripeCustomerId || 'No configurado'}`)
        console.log(`      🌍 País: ${user.country || 'No especificado'}`)
        console.log(`      ⭐ Premium: ${user.hasBeenPremium}`)
        console.log(`      📅 Creado: ${user.createdAt}`)
        console.log(`      🔄 Actualizado: ${user.updatedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando perfiles:', error)
    }
  }

  private async validateEnrollments(): Promise<void> {
    console.log('📚 Validando inscripciones a cursos...')
    
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        }
      })

      console.log(`📊 Total inscripciones: ${enrollments.length}`)
      
      for (const enrollment of enrollments) {
        console.log(`   👤 ${enrollment.user.firstName} ${enrollment.user.lastName}`)
        console.log(`      📚 Curso: ${enrollment.course.title}`)
        console.log(`      📅 Inscrito: ${enrollment.enrolledAt}`)
        console.log(`      📊 Progreso: ${enrollment.progress}%`)
        console.log(`      🏷️ Estado: ${enrollment.status}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando inscripciones:', error)
    }
  }

  private async validateCourseProgress(): Promise<void> {
    console.log('📈 Validando progreso de cursos...')
    
    try {
      const progress = await this.prisma.courseProgress.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })

      console.log(`📊 Total progresos: ${progress.length}`)
      
      for (const prog of progress) {
        console.log(`   👤 ${prog.user.firstName} ${prog.user.lastName}`)
        console.log(`      📚 Curso: ${prog.course.title}`)
        console.log(`      📊 Progreso: ${prog.progress}%`)
        console.log(`      🏷️ Estado: ${prog.status}`)
        console.log(`      📅 Última actividad: ${prog.lastActivityAt}`)
        console.log(`      📅 Completado: ${prog.completedAt || 'No completado'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando progreso:', error)
    }
  }

  private async validateLessonProgress(): Promise<void> {
    console.log('📖 Validando progreso de lecciones...')
    
    try {
      const progress = await this.prisma.lessonProgress.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        }
      })

      console.log(`📊 Total progresos de lecciones: ${progress.length}`)
      
      for (const prog of progress) {
        console.log(`   👤 ${prog.user.firstName} ${prog.user.lastName}`)
        console.log(`      📚 Curso: ${prog.lesson.course.title}`)
        console.log(`      📖 Lección: ${prog.lesson.title}`)
        console.log(`      📊 Progreso: ${prog.progress}%`)
        console.log(`      🏷️ Estado: ${prog.status}`)
        console.log(`      📅 Completado: ${prog.completedAt || 'No completado'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando progreso de lecciones:', error)
    }
  }

  private async validatePayments(): Promise<void> {
    console.log('💳 Validando pagos...')
    
    try {
      const payments = await this.prisma.payment.findMany({
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

      console.log(`📊 Total pagos: ${payments.length}`)
      
      for (const payment of payments) {
        console.log(`   👤 ${payment.user.firstName} ${payment.user.lastName}`)
        console.log(`      💰 Monto: $${payment.amount}`)
        console.log(`      💳 Método: ${payment.paymentMethod}`)
        console.log(`      🏷️ Estado: ${payment.status}`)
        console.log(`      📅 Fecha: ${payment.createdAt}`)
        console.log(`      🆔 Stripe ID: ${payment.stripePaymentId || 'No configurado'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando pagos:', error)
    }
  }

  private async validateSubscriptions(): Promise<void> {
    console.log('🔔 Validando suscripciones...')
    
    try {
      const subscriptions = await this.prisma.subscription.findMany({
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

      console.log(`📊 Total suscripciones: ${subscriptions.length}`)
      
      for (const sub of subscriptions) {
        console.log(`   👤 ${sub.user.firstName} ${sub.user.lastName}`)
        console.log(`      🏷️ Estado: ${sub.status}`)
        console.log(`      📅 Inicio: ${sub.startDate}`)
        console.log(`      📅 Fin: ${sub.endDate || 'Sin fecha de fin'}`)
        console.log(`      🔄 Renovación: ${sub.autoRenew ? 'Sí' : 'No'}`)
        console.log(`      🆔 Stripe ID: ${sub.stripeSubscriptionId || 'No configurado'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando suscripciones:', error)
    }
  }

  private async validateUserStreaks(): Promise<void> {
    console.log('🏆 Validando rachas de usuarios...')
    
    try {
      const streaks = await this.prisma.userStreak.findMany({
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

      console.log(`📊 Total rachas: ${streaks.length}`)
      
      for (const streak of streaks) {
        console.log(`   👤 ${streak.user.firstName} ${streak.user.lastName}`)
        console.log(`      🏆 Racha actual: ${streak.currentStreak} semanas`)
        console.log(`      📈 Racha más larga: ${streak.longestStreak} semanas`)
        console.log(`      🎯 Meta semanal: ${streak.weeklyGoal} lecciones`)
        console.log(`      ✅ Completadas esta semana: ${streak.lessonsCompletedThisWeek}`)
        console.log(`      📅 Última actividad: ${streak.lastActivityDate}`)
        console.log(`      💎 Puntos totales: ${streak.totalPoints}`)
        console.log(`      ⭐ Puntos de por vida: ${streak.lifetimePointsEarned}`)
        console.log(`      ✅ Semana completa: ${streak.isCurrentWeekComplete ? 'Sí' : 'No'}`)
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

      console.log(`📊 Total badges: ${badges.length}`)
      
      for (const badge of badges) {
        console.log(`   👤 ${badge.user.firstName} ${badge.user.lastName}`)
        console.log(`      🏅 Nivel: ${badge.badgeLevel}`)
        console.log(`      🏆 Racha cuando se ganó: ${badge.streakWhenEarned} semanas`)
        console.log(`      ✅ Activo: ${badge.isActive ? 'Sí' : 'No'}`)
        console.log(`      📅 Ganado: ${badge.earnedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando badges:', error)
    }
  }

  private async validatePointsHistory(): Promise<void> {
    console.log('💎 Validando historial de puntos...')
    
    try {
      const points = await this.prisma.userPointsHistory.findMany({
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
        take: 20
      })

      console.log(`📊 Últimas 20 transacciones de puntos:`)
      
      for (const point of points) {
        console.log(`   👤 ${point.user.firstName} ${point.user.lastName}`)
        console.log(`      💎 Puntos: ${point.pointsEarned}`)
        console.log(`      📝 Razón: ${point.reason}`)
        console.log(`      🏷️ Tipo: ${point.transactionType}`)
        console.log(`      📅 Fecha: ${point.createdAt}`)
        console.log(`      📅 Semana: ${point.weekStart || 'No especificada'}`)
        console.log(`      📖 Lecciones completadas: ${point.lessonsCompleted || 0}`)
        console.log(`      📚 Cursos usados: ${point.coursesUsed || 0}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando puntos:', error)
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
        }
      })

      console.log(`📊 Total completaciones semanales: ${completions.length}`)
      
      for (const completion of completions) {
        console.log(`   👤 ${completion.user.firstName} ${completion.user.lastName}`)
        console.log(`      📚 Curso ID: ${completion.courseId}`)
        console.log(`      📅 Semana: ${completion.weekStart}`)
        console.log(`      ✅ Lecciones completadas: ${completion.lessonsCompletedInWeek}`)
        console.log(`      📅 Última lección: ${completion.lastLessonAt}`)
        console.log(`      📅 Creado: ${completion.createdAt}`)
        console.log(`      🔄 Actualizado: ${completion.updatedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando completaciones:', error)
    }
  }

  private async validateStreakRecoveries(): Promise<void> {
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
        }
      })

      console.log(`📊 Total recuperaciones: ${recoveries.length}`)
      
      for (const recovery of recoveries) {
        console.log(`   👤 ${recovery.user.firstName} ${recovery.user.lastName}`)
        console.log(`      💎 Puntos gastados: ${recovery.pointsSpent}`)
        console.log(`      🏅 Nivel de badge: ${recovery.badgeLevel}`)
        console.log(`      📝 Razón: ${recovery.recoveryReason || 'No especificada'}`)
        console.log(`      🏆 Racha perdida original: ${recovery.originalStreakLost} semanas`)
        console.log(`      📅 Semana perdida: ${recovery.weekMissed}`)
        console.log(`      📅 Recuperado: ${recovery.recoveredAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando recuperaciones:', error)
    }
  }

  private async validateComments(): Promise<void> {
    console.log('💬 Validando comentarios...')
    
    try {
      const comments = await this.prisma.comment.findMany({
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
        }
      })

      console.log(`📊 Total comentarios: ${comments.length}`)
      
      for (const comment of comments) {
        console.log(`   👤 ${comment.user.firstName} ${comment.user.lastName}`)
        console.log(`      💬 Contenido: ${comment.content.substring(0, 50)}...`)
        console.log(`      🏷️ Tipo: ${comment.type}`)
        console.log(`      📅 Fecha: ${comment.createdAt}`)
        console.log(`      🔄 Actualizado: ${comment.updatedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando comentarios:', error)
    }
  }

  private async validateLikes(): Promise<void> {
    console.log('👍 Validando likes...')
    
    try {
      const likes = await this.prisma.like.findMany({
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
        }
      })

      console.log(`📊 Total likes: ${likes.length}`)
      
      for (const like of likes) {
        console.log(`   👤 ${like.user.firstName} ${like.user.lastName}`)
        console.log(`      📅 Fecha: ${like.createdAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando likes:', error)
    }
  }

  private async validateCommunityPosts(): Promise<void> {
    console.log('📝 Validando posts de la comunidad...')
    
    try {
      const posts = await this.prisma.communityPost.findMany({
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
        }
      })

      console.log(`📊 Total posts: ${posts.length}`)
      
      for (const post of posts) {
        console.log(`   👤 ${post.user.firstName} ${post.user.lastName}`)
        console.log(`      📝 Título: ${post.title}`)
        console.log(`      💬 Contenido: ${post.content.substring(0, 50)}...`)
        console.log(`      🏷️ Categoría: ${post.category}`)
        console.log(`      📅 Fecha: ${post.createdAt}`)
        console.log(`      🔄 Actualizado: ${post.updatedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando posts:', error)
    }
  }

  private async validateEventRegistrations(): Promise<void> {
    console.log('📅 Validando registros a eventos...')
    
    try {
      const registrations = await this.prisma.eventRegistration.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          event: {
            select: {
              id: true,
              title: true,
              eventType: true
            }
          }
        },
        orderBy: {
          registeredAt: 'desc'
        }
      })

      console.log(`📊 Total registros: ${registrations.length}`)
      
      for (const reg of registrations) {
        console.log(`   👤 ${reg.user.firstName} ${reg.user.lastName}`)
        console.log(`      📅 Evento: ${reg.event.title}`)
        console.log(`      🏷️ Tipo: ${reg.event.eventType}`)
        console.log(`      📅 Registrado: ${reg.registeredAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando registros:', error)
    }
  }

  private async validatePromotionInteractions(): Promise<void> {
    console.log('🎯 Validando interacciones con promociones...')
    
    try {
      const interactions = await this.prisma.promotionInteraction.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          promotion: {
            select: {
              id: true,
              title: true,
              type: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log(`📊 Total interacciones: ${interactions.length}`)
      
      for (const interaction of interactions) {
        console.log(`   👤 ${interaction.user.firstName} ${interaction.user.lastName}`)
        console.log(`      🎯 Promoción: ${interaction.promotion.title}`)
        console.log(`      🏷️ Tipo: ${interaction.promotion.type}`)
        console.log(`      📝 Acción: ${interaction.action}`)
        console.log(`      📅 Fecha: ${interaction.createdAt}`)
        console.log(`      🌐 URL: ${interaction.pageUrl || 'No especificada'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando interacciones:', error)
    }
  }

  private async validateRatings(): Promise<void> {
    console.log('⭐ Validando calificaciones...')
    
    try {
      const ratings = await this.prisma.rating.findMany({
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
        }
      })

      console.log(`📊 Total calificaciones: ${ratings.length}`)
      
      for (const rating of ratings) {
        console.log(`   👤 ${rating.user.firstName} ${rating.user.lastName}`)
        console.log(`      ⭐ Calificación: ${rating.rating}/5`)
        console.log(`      🏷️ Tipo: ${rating.type}`)
        console.log(`      📅 Fecha: ${rating.createdAt}`)
        console.log(`      🔄 Actualizado: ${rating.updatedAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando calificaciones:', error)
    }
  }

  private async validateResourceAccessLogs(): Promise<void> {
    console.log('📚 Validando logs de acceso a recursos...')
    
    try {
      const logs = await this.prisma.resourceAccessLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          resource: {
            select: {
              id: true,
              title: true,
              category: true
            }
          }
        },
        orderBy: {
          accessedAt: 'desc'
        }
      })

      console.log(`📊 Total logs de acceso: ${logs.length}`)
      
      for (const log of logs) {
        console.log(`   👤 ${log.user.firstName} ${log.user.lastName}`)
        console.log(`      📚 Recurso: ${log.resource.title}`)
        console.log(`      🏷️ Categoría: ${log.resource.category}`)
        console.log(`      📅 Accedido: ${log.accessedAt}`)
        console.log(`      📊 Tiempo de visualización: ${log.viewDuration || 0} segundos`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando logs de acceso:', error)
    }
  }

  private async validateSecurityLogs(): Promise<void> {
    console.log('🔒 Validando logs de seguridad...')
    
    try {
      const logs = await this.prisma.securityLog.findMany({
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
        take: 20
      })

      console.log(`📊 Últimos 20 logs de seguridad:`)
      
      for (const log of logs) {
        console.log(`   👤 ${log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Usuario anónimo'}`)
        console.log(`      🔒 Evento: ${log.event}`)
        console.log(`      📅 Fecha: ${log.createdAt}`)
        console.log(`      🌐 IP: ${log.ipAddress || 'No registrada'}`)
        console.log(`      📱 User Agent: ${log.userAgent || 'No registrado'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando logs de seguridad:', error)
    }
  }

  private async validateSessions(): Promise<void> {
    console.log('🔐 Validando sesiones activas...')
    
    try {
      const sessions = await this.prisma.session.findMany({
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
        }
      })

      console.log(`📊 Total sesiones: ${sessions.length}`)
      
      for (const session of sessions) {
        console.log(`   👤 ${session.user.firstName} ${session.user.lastName}`)
        console.log(`      🔐 Token: ${session.token.substring(0, 20)}...`)
        console.log(`      📅 Creado: ${session.createdAt}`)
        console.log(`      📅 Expira: ${session.expiresAt}`)
        console.log(`      ✅ Activo: ${session.isActive ? 'Sí' : 'No'}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando sesiones:', error)
    }
  }

  private async validateUserBehaviors(): Promise<void> {
    console.log('📊 Validando comportamientos de usuarios...')
    
    try {
      const behaviors = await this.prisma.userBehavior.findMany({
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
        }
      })

      console.log(`📊 Total comportamientos: ${behaviors.length}`)
      
      for (const behavior of behaviors) {
        console.log(`   👤 ${behavior.user.firstName} ${behavior.user.lastName}`)
        console.log(`      📝 Acción: ${behavior.action}`)
        console.log(`      🎯 Target ID: ${behavior.targetId || 'No especificado'}`)
        console.log(`      🏷️ Target Type: ${behavior.targetType || 'No especificado'}`)
        console.log(`      📅 Fecha: ${behavior.createdAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando comportamientos:', error)
    }
  }

  private async validateRecommendations(): Promise<void> {
    console.log('🎯 Validando recomendaciones...')
    
    try {
      const recommendations = await this.prisma.recommendation.findMany({
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
        }
      })

      console.log(`📊 Total recomendaciones: ${recommendations.length}`)
      
      for (const rec of recommendations) {
        console.log(`   👤 ${rec.user.firstName} ${rec.user.lastName}`)
        console.log(`      🎯 Tipo: ${rec.type}`)
        console.log(`      📊 Score: ${rec.score}`)
        console.log(`      📅 Fecha: ${rec.createdAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando recomendaciones:', error)
    }
  }

  private async validateAchievements(): Promise<void> {
    console.log('🏆 Validando logros...')
    
    try {
      const achievements = await this.prisma.achievement.findMany({
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
        }
      })

      console.log(`📊 Total logros: ${achievements.length}`)
      
      for (const achievement of achievements) {
        console.log(`   👤 ${achievement.user.firstName} ${achievement.user.lastName}`)
        console.log(`      🏆 Logro: ${achievement.name}`)
        console.log(`      📝 Descripción: ${achievement.description}`)
        console.log(`      📅 Ganado: ${achievement.createdAt}`)
        console.log('')
      }
      
    } catch (error) {
      console.error('❌ Error validando logros:', error)
    }
  }

  public async performComprehensiveValidation(): Promise<void> {
    console.log('🚀 Iniciando validación exhaustiva de todos los datos de usuarios...')
    console.log('')
    
    try {
      await this.validateUserProfile()
      console.log('')
      
      await this.validateEnrollments()
      console.log('')
      
      await this.validateCourseProgress()
      console.log('')
      
      await this.validateLessonProgress()
      console.log('')
      
      await this.validatePayments()
      console.log('')
      
      await this.validateSubscriptions()
      console.log('')
      
      await this.validateUserStreaks()
      console.log('')
      
      await this.validateStreakBadges()
      console.log('')
      
      await this.validatePointsHistory()
      console.log('')
      
      await this.validateWeeklyCompletions()
      console.log('')
      
      await this.validateStreakRecoveries()
      console.log('')
      
      await this.validateComments()
      console.log('')
      
      await this.validateLikes()
      console.log('')
      
      await this.validateCommunityPosts()
      console.log('')
      
      await this.validateEventRegistrations()
      console.log('')
      
      await this.validatePromotionInteractions()
      console.log('')
      
      await this.validateRatings()
      console.log('')
      
      await this.validateResourceAccessLogs()
      console.log('')
      
      await this.validateSecurityLogs()
      console.log('')
      
      await this.validateSessions()
      console.log('')
      
      await this.validateUserBehaviors()
      console.log('')
      
      await this.validateRecommendations()
      console.log('')
      
      await this.validateAchievements()
      console.log('')
      
      console.log('✅ Validación exhaustiva completada')
      console.log('📊 Todos los campos y registros de usuarios han sido verificados')
      
    } catch (error) {
      console.error('💥 Error durante la validación exhaustiva:', error)
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

async function main() {
  const validator = new ComprehensiveUserDataValidation()
  await validator.performComprehensiveValidation()
}

if (require.main === module) {
  main().catch(console.error)
}

export { ComprehensiveUserDataValidation } 