import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Verificar autenticación usando cookies
    const token = request.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.json(
        { hasAccess: false, error: 'No autenticado' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { hasAccess: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const { slug: courseSlug } = await params;

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: {
        id: true,
        isFree: true,
        requiresAuth: true,
        status: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { hasAccess: false, error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Si el curso no está publicado, no hay acceso
    if (course.status !== 'PUBLISHED') {
      return NextResponse.json(
        { hasAccess: false, error: 'Curso no disponible' },
        { status: 403 }
      );
    }

    // Si el curso es gratuito, siempre hay acceso
    if (course.isFree) {
      return NextResponse.json({ hasAccess: true });
    }

    // Para cursos premium, verificar acceso premium
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        membershipLevel: true,
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
          include: {
            price: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { hasAccess: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Lógica mejorada: considerar tanto suscripción activa como membershipLevel
    const hasActiveSubscription = user.subscriptions.length > 0;
    const hasPremiumAccess = hasActiveSubscription || user.membershipLevel === 'PREMIUM';

    if (!hasPremiumAccess) {
      return NextResponse.json({
        hasAccess: false,
        error: 'Se requiere suscripción premium',
        requiresSubscription: true,
      });
    }

    // Verificar si ya está inscrito en el curso
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: course.id,
        status: {
          in: ['ACTIVE', 'COMPLETED'],
        },
      },
    });

    // Si no está inscrito, inscribirlo automáticamente
    if (!enrollment) {
      await prisma.enrollment.create({
        data: {
          userId: userId,
          courseId: course.id,
          status: 'ACTIVE',
          enrolledAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      hasAccess: true,
      subscriptionType: user.subscriptions[0]?.price?.interval?.toLowerCase(),
      currentPeriodEnd: user.subscriptions[0]?.currentPeriodEnd,
    });

  } catch (error) {
    console.error('Error checking course access:', error);
    return NextResponse.json(
      { hasAccess: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 