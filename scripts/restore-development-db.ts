#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Cargar variables de entorno de desarrollo
dotenv.config()

interface BackupData {
  timestamp: string
  environment: string
  tables: {
    users: any[]
    courses: any[]
    lessons: any[]
    resources: any[]
    events: any[]
    promotions: any[]
    enrollments: any[]
    payments: any[]
  }
}

class DevelopmentRestore {
  private prisma: PrismaClient
  private backupData: BackupData

  constructor(backupFile: string) {
    this.prisma = new PrismaClient()
    
    // Leer archivo de backup
    const backupPath = path.join(process.cwd(), 'backups', backupFile)
    const backupContent = fs.readFileSync(backupPath, 'utf-8')
    this.backupData = JSON.parse(backupContent)
    
    console.log(`📁 Backup cargado: ${backupFile}`)
    console.log(`📅 Fecha del backup: ${this.backupData.timestamp}`)
    console.log(`🌍 Entorno: ${this.backupData.environment}`)
  }

  private async clearTables(): Promise<void> {
    console.log('🗑️ Limpiando tablas de desarrollo...')
    
    // Limpiar tablas en orden correcto (respetando foreign keys)
    await this.prisma.payment.deleteMany()
    await this.prisma.enrollment.deleteMany()
    await this.prisma.lesson.deleteMany()
    await this.prisma.course.deleteMany()
    await this.prisma.resource.deleteMany()
    await this.prisma.event.deleteMany()
    await this.prisma.promotion.deleteMany()
    await this.prisma.user.deleteMany()
    
    console.log('✅ Tablas limpiadas')
  }

  private async restoreUsers(): Promise<void> {
    console.log(`👥 Restaurando ${this.backupData.tables.users.length} usuarios...`)
    
    for (const user of this.backupData.tables.users) {
      await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          passwordHash: user.passwordHash,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          profileImage: user.profileImage,
          bio: user.bio,
          membershipLevel: user.membershipLevel,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          verificationCode: user.verificationCode,
          stripeCustomerId: user.stripeCustomerId,
          verificationCodeExpires: user.verificationCodeExpires ? new Date(user.verificationCodeExpires) : null,
          country: user.country,
          hasBeenPremium: user.hasBeenPremium
        }
      })
    }
    
    console.log('✅ Usuarios restaurados')
  }

  private async restoreCourses(): Promise<void> {
    console.log(`📚 Restaurando ${this.backupData.tables.courses.length} cursos...`)
    
    for (const course of this.backupData.tables.courses) {
      await this.prisma.course.create({
        data: {
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          imageUrl: course.imageUrl,
          price: course.price,
          isFree: course.isFree,
          requiresAuth: course.requiresAuth,
          difficulty: course.difficulty,
          durationHours: course.durationHours,
          lessonsCount: course.lessonsCount,
          studentsCount: course.studentsCount,
          rating: course.rating,
          status: course.status,
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt),
          instructorId: course.instructorId,
          category: course.category
        }
      })
    }
    
    console.log('✅ Cursos restaurados')
  }

  private async restoreLessons(): Promise<void> {
    console.log(`📖 Restaurando ${this.backupData.tables.lessons.length} lecciones...`)
    
    for (const lesson of this.backupData.tables.lessons) {
      await this.prisma.lesson.create({
        data: {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          order: lesson.order,
          isFree: lesson.isFree,
          courseId: lesson.courseId,
          createdAt: new Date(lesson.createdAt),
          updatedAt: new Date(lesson.updatedAt)
        }
      })
    }
    
    console.log('✅ Lecciones restauradas')
  }

  private async restoreResources(): Promise<void> {
    console.log(`📁 Restaurando ${this.backupData.tables.resources.length} recursos...`)
    
    for (const resource of this.backupData.tables.resources) {
      await this.prisma.resource.create({
        data: {
          id: resource.id,
          title: resource.title,
          description: resource.description,
          fileUrl: resource.fileUrl,
          fileSize: resource.fileSize,
          fileType: resource.fileType,
          category: resource.category,
          type: resource.type,
          status: resource.status,
          downloads: resource.downloads,
          createdAt: new Date(resource.createdAt),
          updatedAt: new Date(resource.updatedAt)
        }
      })
    }
    
    console.log('✅ Recursos restaurados')
  }

  private async restoreEvents(): Promise<void> {
    console.log(`📅 Restaurando ${this.backupData.tables.events.length} eventos...`)
    
    for (const event of this.backupData.tables.events) {
      await this.prisma.event.create({
        data: {
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          location: event.location,
          type: event.type,
          maxAttendees: event.maxAttendees,
          currentAttendees: event.currentAttendees,
          isActive: event.isActive,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }
      })
    }
    
    console.log('✅ Eventos restaurados')
  }

  private async restorePromotions(): Promise<void> {
    console.log(`🎯 Restaurando ${this.backupData.tables.promotions.length} promociones...`)
    
    for (const promotion of this.backupData.tables.promotions) {
      await this.prisma.promotion.create({
        data: {
          id: promotion.id,
          title: promotion.title,
          description: promotion.description,
          discountPercentage: promotion.discountPercentage,
          discountAmount: promotion.discountAmount,
          type: promotion.type,
          targetAudience: promotion.targetAudience,
          startDate: new Date(promotion.startDate),
          endDate: new Date(promotion.endDate),
          isActive: promotion.isActive,
          maxUses: promotion.maxUses,
          currentUses: promotion.currentUses,
          createdAt: new Date(promotion.createdAt),
          updatedAt: new Date(promotion.updatedAt)
        }
      })
    }
    
    console.log('✅ Promociones restauradas')
  }

  private async restoreEnrollments(): Promise<void> {
    console.log(`📝 Restaurando ${this.backupData.tables.enrollments.length} inscripciones...`)
    
    for (const enrollment of this.backupData.tables.enrollments) {
      await this.prisma.enrollment.create({
        data: {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          status: enrollment.status,
          enrolledAt: new Date(enrollment.enrolledAt),
          completedAt: enrollment.completedAt ? new Date(enrollment.completedAt) : null,
          progress: enrollment.progress
        }
      })
    }
    
    console.log('✅ Inscripciones restauradas')
  }

  private async restorePayments(): Promise<void> {
    console.log(`💳 Restaurando ${this.backupData.tables.payments.length} pagos...`)
    
    for (const payment of this.backupData.tables.payments) {
      await this.prisma.payment.create({
        data: {
          id: payment.id,
          userId: payment.userId,
          courseId: payment.courseId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          stripePaymentIntentId: payment.stripePaymentIntentId,
          stripeSessionId: payment.stripeSessionId,
          createdAt: new Date(payment.createdAt),
          updatedAt: new Date(payment.updatedAt)
        }
      })
    }
    
    console.log('✅ Pagos restaurados')
  }

  public async restore(): Promise<void> {
    console.log('🚀 Iniciando restauración de base de datos de desarrollo...')
    
    try {
      // Limpiar tablas
      await this.clearTables()
      
      // Restaurar datos en orden correcto
      await this.restoreUsers()
      await this.restoreCourses()
      await this.restoreLessons()
      await this.restoreResources()
      await this.restoreEvents()
      await this.restorePromotions()
      await this.restoreEnrollments()
      await this.restorePayments()
      
      console.log('✅ Restauración completada exitosamente')
      
    } catch (error) {
      console.error('❌ Error durante la restauración:', error)
      throw error
    } finally {
      await this.prisma.$disconnect()
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Uso: npx tsx scripts/restore-development-db.ts <archivo-backup>')
    console.log('Ejemplo: npx tsx scripts/restore-development-db.ts egrow-academy-desarrollo-2025-08-02T18-54-05.json')
    process.exit(1)
  }
  
  const backupFile = args[0]
  
  try {
    const restorer = new DevelopmentRestore(backupFile)
    await restorer.restore()
  } catch (error) {
    console.error('💥 Error:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { DevelopmentRestore } 