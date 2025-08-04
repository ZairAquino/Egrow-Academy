import { NextRequest, NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    // Simular usuario premium para testing
    const mockUser = {
      id: 'mock-user-id',
      email: email || 'luisdavid.ls47@gmail.com',
      firstName: 'Luis David',
      lastName: 'Test',
      username: 'luisdavid',
      bio: null,
      profileImage: null,
      emailVerified: true,
      isActive: true,
      membershipLevel: 'PREMIUM', // Usuario premium para probar el logo
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationCode: null,
      stripeCustomerId: null,
      verificationCodeExpires: null,
      country: null,
      hasBeenPremium: true
    }
    
    // Generar token
    const token = generateToken(mockUser.id)
    
    // Crear respuesta con cookie
    const response = NextResponse.json({
      user: mockUser,
      token,
      message: '¡Mock login exitoso!',
      logoToUse: mockUser.membershipLevel === 'PREMIUM' ? 'logop.png' : 'logog.png'
    })
    
    // Establecer cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })
    
    console.log('✅ [MOCK-LOGIN] Login simulado completado para usuario premium')
    return response
    
  } catch (error) {
    console.error('💥 [MOCK-LOGIN] Error:', error)
    return NextResponse.json(
      { error: 'Error en mock login' },
      { status: 500 }
    )
  }
}