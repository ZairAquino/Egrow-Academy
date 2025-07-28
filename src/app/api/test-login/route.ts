import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 [TEST-LOGIN] Probando acceso a tabla users...')
    
    // Intentar acceder a la tabla users
    const userCount = await prisma.user.count()
    console.log('✅ [TEST-LOGIN] Conteo de usuarios:', userCount)
    
    return NextResponse.json({
      success: true,
      message: 'Tabla users accesible',
      userCount
    })
    
  } catch (error) {
    console.error('❌ [TEST-LOGIN] Error accediendo tabla users:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error accediendo tabla users',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🔍 [TEST-LOGIN] Simulando proceso de login...')
    
    // Intentar buscar usuario ficticio
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    console.log('✅ [TEST-LOGIN] Búsqueda completada, usuario:', user ? 'encontrado' : 'no encontrado')
    
    return NextResponse.json({
      success: true,
      message: 'Proceso de login simulado exitoso',
      userFound: !!user
    })
    
  } catch (error) {
    console.error('❌ [TEST-LOGIN] Error en proceso de login:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error en proceso de login',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}