import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Obtener todas las valoraciones de la comunidad
    const allRatings = await prisma.rating.findMany({
      where: {
        type: {
          in: ['COURSE_COMPLETION', 'COMMUNITY_POST', 'COURSE_COMMENT']
        }
      }
    });

    // Calcular estadísticas generales
    const totalRatings = allRatings.length;
    const averageRating = totalRatings > 0 
      ? allRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings 
      : 0;

    // Distribución de valoraciones
    const ratingDistribution = {
      1: allRatings.filter(r => r.rating === 1).length,
      2: allRatings.filter(r => r.rating === 2).length,
      3: allRatings.filter(r => r.rating === 3).length,
      4: allRatings.filter(r => r.rating === 4).length,
      5: allRatings.filter(r => r.rating === 5).length
    };

    // Porcentaje de valoraciones positivas (4-5 estrellas)
    const positiveRatings = ratingDistribution[4] + ratingDistribution[5];
    const satisfactionPercentage = totalRatings > 0 
      ? Math.round((positiveRatings / totalRatings) * 100) 
      : 0;

    // Valoraciones por tipo
    const courseRatings = allRatings.filter(r => r.type === 'COURSE_COMPLETION');
    const communityRatings = allRatings.filter(r => r.type === 'COMMUNITY_POST');
    const commentRatings = allRatings.filter(r => r.type === 'COURSE_COMMENT');

    const courseAverage = courseRatings.length > 0 
      ? courseRatings.reduce((acc, r) => acc + r.rating, 0) / courseRatings.length 
      : 0;

    const communityAverage = communityRatings.length > 0 
      ? communityRatings.reduce((acc, r) => acc + r.rating, 0) / communityRatings.length 
      : 0;

    return NextResponse.json({
      overall: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        satisfactionPercentage,
        ratingDistribution
      },
      byType: {
        courses: {
          total: courseRatings.length,
          average: Math.round(courseAverage * 10) / 10
        },
        community: {
          total: communityRatings.length,
          average: Math.round(communityAverage * 10) / 10
        },
        comments: {
          total: commentRatings.length
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de valoraciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 