import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [STATS] Iniciando obtención de estadísticas');

    let activeMembers = 0;
    let countriesCount = 0;
    let likesCount = 0;
    let commentsCount = 0;
    let repliesCount = 0;
    let premiumMembers = 0;

    try {
      // Obtener miembros activos (usuarios con isActive = true)
      activeMembers = await prisma.user.count({
        where: {
          isActive: true
        }
      });
      console.log('✅ [STATS] Miembros activos:', activeMembers);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo miembros activos:', error);
    }

    try {
      // Obtener países únicos (excluyendo null/undefined)
      const uniqueCountries = await prisma.user.findMany({
        where: {
          country: {
            not: null
          }
        },
        select: {
          country: true
        },
        distinct: ['country']
      });
      countriesCount = uniqueCountries.length;
      console.log('✅ [STATS] Países únicos:', countriesCount);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo países:', error);
    }

    try {
      // Obtener likes
      likesCount = await prisma.like.count();
      console.log('✅ [STATS] Likes:', likesCount);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo likes:', error);
    }

    try {
      // Obtener comentarios
      commentsCount = await prisma.comment.count();
      console.log('✅ [STATS] Comentarios:', commentsCount);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo comentarios:', error);
    }

    try {
      // Obtener respuestas
      repliesCount = await prisma.comment.count({
        where: {
          parentId: {
            not: null
          }
        }
      });
      console.log('✅ [STATS] Respuestas:', repliesCount);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo respuestas:', error);
    }

    try {
      // Obtener miembros premium
      premiumMembers = await prisma.user.count({
        where: {
          hasBeenPremium: true
        }
      });
      console.log('✅ [STATS] Miembros premium:', premiumMembers);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo miembros premium:', error);
    }

    // Obtener estadísticas de valoraciones
    let ratingStats = null;
    try {
      const allRatings = await prisma.rating.findMany({
        where: {
          type: {
            in: ['COURSE_COMPLETION', 'COMMUNITY_POST', 'COURSE_COMMENT']
          }
        }
      });

      const totalRatings = allRatings.length;
      const averageRating = totalRatings > 0 
        ? allRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings 
        : 0;

      const ratingDistribution = {
        1: allRatings.filter(r => r.rating === 1).length,
        2: allRatings.filter(r => r.rating === 2).length,
        3: allRatings.filter(r => r.rating === 3).length,
        4: allRatings.filter(r => r.rating === 4).length,
        5: allRatings.filter(r => r.rating === 5).length
      };

      const positiveRatings = ratingDistribution[4] + ratingDistribution[5];
      const satisfactionPercentage = totalRatings > 0 
        ? Math.round((positiveRatings / totalRatings) * 100) 
        : 0;

      const courseRatings = allRatings.filter(r => r.type === 'COURSE_COMPLETION');
      const communityRatings = allRatings.filter(r => r.type === 'COMMUNITY_POST');

      const courseAverage = courseRatings.length > 0 
        ? courseRatings.reduce((acc, r) => acc + r.rating, 0) / courseRatings.length 
        : 0;

      const communityAverage = communityRatings.length > 0 
        ? communityRatings.reduce((acc, r) => acc + r.rating, 0) / communityRatings.length 
        : 0;

      ratingStats = {
        overall: {
          totalRatings,
          averageRating: Math.round(averageRating * 10) / 10,
          satisfactionPercentage
        },
        byType: {
          courses: {
            total: courseRatings.length,
            average: Math.round(courseAverage * 10) / 10
          },
          community: {
            total: communityRatings.length,
            average: Math.round(communityAverage * 10) / 10
          }
        }
      };

      console.log('✅ [STATS] Estadísticas de valoraciones:', ratingStats);
    } catch (error) {
      console.error('❌ [STATS] Error obteniendo estadísticas de valoraciones:', error);
    }

    const totalInteractions = likesCount + commentsCount + repliesCount;
    console.log('✅ [STATS] Interacciones totales:', totalInteractions);

    const stats = {
      activeMembers,
      countriesCount,
      totalInteractions,
      premiumMembers,
      breakdown: {
        likes: likesCount,
        comments: commentsCount,
        replies: repliesCount
      },
      ratingStats
    };

    console.log('✅ [STATS] Estadísticas completadas:', stats);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ [STATS] Error al obtener estadísticas de la comunidad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
} 