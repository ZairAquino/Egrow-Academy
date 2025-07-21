import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, createSafeUser } from '@/lib/auth'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  // API TEMPORALMENTE DESHABILITADA PARA DEMO
  // Los usuarios se verifican automáticamente al registrarse
  return NextResponse.json(
    { 
      error: 'La verificación de email está temporalmente deshabilitada para la presentación a inversionistas.',
      message: 'Los usuarios se verifican automáticamente al registrarse.'
    },
    { status: 503 }
  )
} 