import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Por seguridad, no revelar si el email existe o no
      return NextResponse.json(
        { message: 'Si el email existe en nuestra base de datos, recibirás un enlace de restablecimiento' },
        { status: 200 }
      );
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: resetToken,
        verificationCodeExpires: resetTokenExpires
      }
    });

    // Enviar email de restablecimiento
    // Usar siempre el dominio personalizado para los emails
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://egrowacademy.com';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">🔐 Restablecer Contraseña - eGrow Academy</h2>
        
        <p>Hola ${user.firstName},</p>
        
        <p>Has solicitado restablecer tu contraseña en eGrow Academy.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Importante:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Este enlace expira en 1 hora</li>
            <li>Si no solicitaste este cambio, puedes ignorar este email</li>
            <li>El enlace es único y solo puede usarse una vez</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            🔑 Restablecer Contraseña
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
          <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280;">
          Este email fue enviado desde eGrow Academy.<br>
          Si tienes preguntas, contacta a soporte@egrowacademy.com
        </p>
      </div>
    `;

    const emailResult = await sendEmail(
      user.email,
      '🔐 Restablecer Contraseña - eGrow Academy',
      emailContent
    );

    if (!emailResult.success) {
      console.error('Error enviando email:', emailResult.error);
      return NextResponse.json(
        { error: 'Error enviando email de restablecimiento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Si el email existe en nuestra base de datos, recibirás un enlace de restablecimiento'
    });

  } catch (error) {
    console.error('Error en forgot-password:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 