import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar variables de entorno críticas
    const envCheck = {
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 7) || 'NO_KEY',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET'
    }

    // Intentar conexión a base de datos
    let dbStatus = 'NOT_TESTED'
    try {
      await prisma.$queryRaw`SELECT 1`
      dbStatus = 'CONNECTED'
    } catch (error) {
      dbStatus = 'FAILED: ' + (error as Error).message
    }

    // Intentar inicializar Resend
    let resendStatus = 'NOT_TESTED'
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      resendStatus = 'INITIALIZED'
    } catch (error) {
      resendStatus = 'FAILED: ' + (error as Error).message
    }

    return NextResponse.json({
      status: 'Debug endpoint',
      env: envCheck,
      database: dbStatus,
      resend: resendStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: (error as Error).message
    }, { status: 500 })
  }
}