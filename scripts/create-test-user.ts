import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Generar hash de la contraseña
    const password = 'test123456'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario de prueba
    const testUser = await prisma.user.create({
      data: {
        email: 'test@egrowacademy.com',
        passwordHash: hashedPassword,
        firstName: 'Usuario',
        lastName: 'Prueba',
        username: 'testuser',
        bio: 'Usuario de prueba para desarrollo',
        membershipLevel: 'FREE',
        isActive: true,
        emailVerified: true,
        country: 'España',
        hasBeenPremium: false
      }
    })

    console.log('✅ Usuario de prueba creado exitosamente:')
    console.log('📧 Email:', testUser.email)
    console.log('🔑 Contraseña:', password)
    console.log('👤 Nombre:', testUser.firstName, testUser.lastName)
    console.log('🆔 ID:', testUser.id)
    console.log('📊 Nivel de membresía:', testUser.membershipLevel)
    console.log('✅ Email verificado:', testUser.emailVerified)
    console.log('🌍 País:', testUser.country)

    // Crear una sesión de prueba
    const session = await prisma.session.create({
      data: {
        token: 'test-session-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        userId: testUser.id
      }
    })

    console.log('\n🔐 Sesión de prueba creada:')
    console.log('🎫 Token:', session.token)
    console.log('⏰ Expira:', session.expiresAt)

    console.log('\n📝 Para usar este usuario:')
    console.log('1. Ve a http://localhost:3000/login')
    console.log('2. Usa el email: test@egrowacademy.com')
    console.log('3. Usa la contraseña: test123456')

  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser() 