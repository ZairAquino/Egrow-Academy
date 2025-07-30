#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('🚀 Creando usuario de prueba...')

    const testEmail = 'test@egrow.academy'
    const testPassword = 'Test123456'
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (existingUser) {
      console.log('⚠️  El usuario de prueba ya existe. Actualizando...')
      
      // Actualizar usuario existente con acceso premium
      const hashedPassword = await hashPassword(testPassword)
      
      const updatedUser = await prisma.user.update({
        where: { email: testEmail },
        data: {
          passwordHash: hashedPassword,
          membershipLevel: 'PREMIUM',
          emailVerified: true,
          isActive: true,
          hasBeenPremium: true,
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      })

      console.log('✅ Usuario de prueba actualizado:')
      console.log('📧 Email:', updatedUser.email)
      console.log('🔐 Password:', testPassword)
      console.log('💎 Membership:', updatedUser.membershipLevel)
      console.log('📅 Updated at:', updatedUser.updatedAt)
    } else {
      // Crear nuevo usuario
      const hashedPassword = await hashPassword(testPassword)
      
      const testUser = await prisma.user.create({
        data: {
          email: testEmail,
          passwordHash: hashedPassword,
          firstName: 'Usuario',
          lastName: 'Prueba',
          username: 'test-user',
          membershipLevel: 'PREMIUM',
          emailVerified: true,
          isActive: true,
          hasBeenPremium: true,
          country: 'ES',
          bio: 'Usuario de prueba para desarrollo local'
        }
      })

      console.log('✅ Usuario de prueba creado exitosamente:')
      console.log('📧 Email:', testUser.email)
      console.log('🔐 Password:', testPassword)
      console.log('💎 Membership:', testUser.membershipLevel)
      console.log('🆔 ID:', testUser.id)
      console.log('📅 Created at:', testUser.createdAt)
    }

    // Crear enrollments para todos los cursos existentes
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' }
    })

    const user = await prisma.user.findUnique({
      where: { email: testEmail }
    })

    if (user && courses.length > 0) {
      console.log(`🎓 Inscribiendo usuario en ${courses.length} cursos...`)
      
      for (const course of courses) {
        // Verificar si ya está inscrito
        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id
            }
          }
        })

        if (!existingEnrollment) {
          await prisma.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              status: 'ACTIVE',
              progressPercentage: 0
            }
          })
          console.log(`✅ Inscrito en: ${course.title}`)
        } else {
          console.log(`⚠️  Ya inscrito en: ${course.title}`)
        }
      }
    }

    console.log('\n🎉 ¡Usuario de prueba listo!')
    console.log('📝 Puedes usar estos datos para hacer login:')
    console.log('   Email: test@egrow.academy')
    console.log('   Password: Test123456')
    console.log('   Membership: PREMIUM (acceso completo)')

  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()