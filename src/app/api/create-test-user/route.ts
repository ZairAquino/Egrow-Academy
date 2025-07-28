import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    console.log('🔍 [CREATE-USER] Creando usuario de prueba...')
    
    // Hash de la contraseña "password123"
    const hashedPassword = await hashPassword('password123')
    
    // Crear o actualizar usuario de prueba
    const testUser = await prisma.user.upsert({
      where: { email: 'test@egrowacademy.com' },
      update: {
        passwordHash: hashedPassword,
        emailVerified: true,
        isActive: true,
        membershipLevel: 'PREMIUM'
      },
      create: {
        email: 'test@egrowacademy.com',
        firstName: 'Usuario',
        lastName: 'Prueba',
        passwordHash: hashedPassword,
        emailVerified: true,
        isActive: true,
        membershipLevel: 'PREMIUM'
      }
    })
    
    console.log('✅ [CREATE-USER] Usuario creado:', testUser.id)
    
    return NextResponse.json({
      success: true,
      message: 'Usuario de prueba creado exitosamente',
      user: {
        id: testUser.id,
        email: testUser.email,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        membershipLevel: testUser.membershipLevel
      },
      credentials: {
        email: 'test@egrowacademy.com',
        password: 'password123'
      }
    })
    
  } catch (error) {
    console.error('❌ [CREATE-USER] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error creando usuario de prueba',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}