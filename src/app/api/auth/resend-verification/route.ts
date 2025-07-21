import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  // API TEMPORALMENTE DESHABILITADA PARA DEMO
  // Los usuarios se verifican automáticamente al registrarse
  return NextResponse.json(
    { 
      error: 'El reenvío de verificación está temporalmente deshabilitado para la presentación a inversionistas.',
      message: 'Los usuarios se verifican automáticamente al registrarse.'
    },
    { status: 503 }
  )
} 