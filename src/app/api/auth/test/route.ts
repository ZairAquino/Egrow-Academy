import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
  }

  return NextResponse.json({
    message: 'Configuración de NextAuth',
    environment: process.env.NODE_ENV,
    config: envCheck,
    timestamp: new Date().toISOString()
  })
} 