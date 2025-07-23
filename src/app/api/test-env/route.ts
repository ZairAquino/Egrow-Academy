import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔍 [TEST-ENV] Verificando variables de entorno en el servidor...')
  
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Configurada' : '❌ No configurada',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Configurada' : '❌ No configurada'
  }
  
  console.log('📋 [TEST-ENV] Variables de entorno:', envVars)
  
  if (process.env.RESEND_API_KEY) {
    console.log('🔑 [TEST-ENV] API Key (primeros 10 chars):', process.env.RESEND_API_KEY.substring(0, 10) + '...')
  }
  
  return NextResponse.json({
    message: 'Variables de entorno del servidor',
    envVars,
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : null
  })
} 