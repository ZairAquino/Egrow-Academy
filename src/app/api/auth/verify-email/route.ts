import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VerificationService } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario con el token de verificación
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o ya verificado' },
        { status: 400 }
      );
    }

    // Verificar si el token ha expirado
    if (user.emailVerificationExpires && VerificationService.isTokenExpired(user.emailVerificationExpires)) {
      return NextResponse.json(
        { error: 'Token de verificación expirado' },
        { status: 400 }
      );
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    return NextResponse.json({
      message: 'Email verificado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario con el token de verificación
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerified: false
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token de verificación inválido o ya verificado' },
        { status: 400 }
      );
    }

    // Verificar si el token ha expirado
    if (user.emailVerificationExpires && VerificationService.isTokenExpired(user.emailVerificationExpires)) {
      return NextResponse.json(
        { error: 'Token de verificación expirado' },
        { status: 400 }
      );
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    });

    return NextResponse.json({
      message: 'Email verificado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Error verificando email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 