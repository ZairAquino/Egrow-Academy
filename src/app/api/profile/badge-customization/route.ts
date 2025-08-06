import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'

// Temporary solution using in-memory storage until DB migration is complete
const badgeCustomizations = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const { userId } = verifyToken(token)
    
    const badgeCustomization = badgeCustomizations.get(userId) || {
      preferredBadgeStyle: 'emoji',
      badgeColor: '#3b82f6',
      showBadgeInNavbar: true,
      preferredEmojis: {
        PRINCIPIANTE: '🌱',
        ESTUDIANTE: '📚',
        DEDICADO: '🎯',
        EN_LLAMAS: '🔥',
        IMPARABLE: '⚡',
        MAESTRO: '👑',
        LEYENDA: '🚀'
      }
    };

    return NextResponse.json({ badgeCustomization })
  } catch (error) {
    console.error('Error al obtener badge customization:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get('auth-token')?.value
    const headerToken = extractTokenFromHeader(request)
    const token = cookieToken || headerToken

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 })
    }

    const { userId } = verifyToken(token)
    const body = await request.json()

    console.log('💾 [BADGE CUSTOMIZATION] Saving for user:', userId, body);
    
    // Store in memory temporarily
    badgeCustomizations.set(userId, body);
    
    return NextResponse.json({ 
      message: 'Badge customization actualizado exitosamente',
      badgeCustomization: body
    })
  } catch (error) {
    console.error('Error al actualizar badge customization:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}