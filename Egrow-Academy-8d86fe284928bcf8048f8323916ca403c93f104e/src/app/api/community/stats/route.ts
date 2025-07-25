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
      }
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