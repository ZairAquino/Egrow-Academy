import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { rating, comment, type, courseId, postId } = await request.json();

    // Validar que la valoración esté entre 1 y 5
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'La valoración debe estar entre 1 y 5' }, { status: 400 });
    }

    // Validar que se proporcione al menos un ID
    if (!courseId && !postId) {
      return NextResponse.json({ error: 'Se requiere courseId o postId' }, { status: 400 });
    }

    // Crear o actualizar la valoración
    const ratingData = await prisma.rating.upsert({
      where: {
        userId_courseId_type: courseId ? {
          userId: session.user.id,
          courseId,
          type
        } : undefined,
        userId_postId_type: postId ? {
          userId: session.user.id,
          postId,
          type
        } : undefined
      },
      update: {
        rating,
        comment,
        updatedAt: new Date()
      },
      create: {
        rating,
        comment,
        type,
        userId: session.user.id,
        courseId,
        postId
      }
    });

    // Si es una valoración de curso, actualizar el rating promedio del curso
    if (courseId && type === 'COURSE_COMPLETION') {
      const courseRatings = await prisma.rating.findMany({
        where: {
          courseId,
          type: 'COURSE_COMPLETION'
        }
      });

      const averageRating = courseRatings.reduce((acc, r) => acc + r.rating, 0) / courseRatings.length;

      await prisma.course.update({
        where: { id: courseId },
        data: { rating: averageRating }
      });
    }

    return NextResponse.json({ 
      success: true, 
      rating: ratingData,
      message: 'Valoración guardada exitosamente' 
    });

  } catch (error) {
    console.error('Error al guardar valoración:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const postId = searchParams.get('postId');
    const type = searchParams.get('type');

    if (!courseId && !postId) {
      return NextResponse.json({ error: 'Se requiere courseId o postId' }, { status: 400 });
    }

    const whereClause: any = { type };
    if (courseId) whereClause.courseId = courseId;
    if (postId) whereClause.postId = postId;

    const ratings = await prisma.rating.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular estadísticas
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings 
      : 0;

    const ratingDistribution = {
      1: ratings.filter(r => r.rating === 1).length,
      2: ratings.filter(r => r.rating === 2).length,
      3: ratings.filter(r => r.rating === 3).length,
      4: ratings.filter(r => r.rating === 4).length,
      5: ratings.filter(r => r.rating === 5).length
    };

    return NextResponse.json({
      ratings,
      stats: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Error al obtener valoraciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 