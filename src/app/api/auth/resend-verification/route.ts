import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EmailService } from '@/lib/email';
import { VerificationService } from '@/lib/verification';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el email ya está verificado
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'El email ya está verificado' },
        { status: 400 }
      );
    }

    // Generar nuevo token de verificación
    const verificationToken = VerificationService.generateVerificationToken();

    // Actualizar usuario con nuevo token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken.token,
        emailVerificationExpires: verificationToken.expiresAt
      }
    });

    // Enviar email de verificación
    const emailSent = await EmailService.sendVerificationEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      verificationToken: verificationToken.token
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Error enviando email de verificación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email de verificación reenviado exitosamente',
      email: user.email
    });

  } catch (error) {
    console.error('Error reenviando email de verificación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el email ya está verificado
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'El email ya está verificado' },
        { status: 400 }
      );
    }

    // Verificar si ya hay un token válido (no expirado)
    if (user.emailVerificationToken && user.emailVerificationExpires) {
      const isExpired = VerificationService.isTokenExpired(user.emailVerificationExpires);
      
      if (!isExpired) {
        return NextResponse.json(
          { error: 'Ya tienes un email de verificación válido. Revisa tu bandeja de entrada.' },
          { status: 400 }
        );
      }
    }

    // Generar nuevo token de verificación
    const verificationToken = VerificationService.generateVerificationToken();

    // Actualizar usuario con nuevo token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken.token,
        emailVerificationExpires: verificationToken.expiresAt
      }
    });

    // Enviar email de verificación
    const emailSent = await EmailService.sendVerificationEmail({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      verificationToken: verificationToken.token
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Error enviando email de verificación' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Email de verificación reenviado exitosamente',
      email: user.email
    });

  } catch (error) {
    console.error('Error reenviando email de verificación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 