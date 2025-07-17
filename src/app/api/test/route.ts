import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar variables de entorno
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const hasJwtSecret = !!process.env.JWT_SECRET
    
    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      hasDatabaseUrl,
      hasJwtSecret,
      databaseUrlPrefix: hasDatabaseUrl ? process.env.DATABASE_URL?.substring(0, 20) + '...' : 'NOT_SET',
      jwtSecretPrefix: hasJwtSecret ? process.env.JWT_SECRET?.substring(0, 10) + '...' : 'NOT_SET'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 