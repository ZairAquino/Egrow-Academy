import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.id;

    // Obtener cursos en los que está inscrito el usuario
    const userEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId
      },
      include: {
        course: {
          select: {
            id: true,
            category: true,
            level: true,
            tags: true
          }
        }
      }
    });

    // Extraer categorías de cursos del usuario
    const userCategories = new Set<string>();

    userEnrollments.forEach(enrollment => {
      if (enrollment.course.category) {
        userCategories.add(enrollment.course.category);
      }
    });

    // IDs de cursos que ya tiene el usuario
    const enrolledCourseIds = userEnrollments.map(e => e.courseId);

    // Obtener cursos recomendados basados en las preferencias del usuario
    const recommendedCourses = await prisma.course.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: enrolledCourseIds // Excluir cursos ya inscritos
            }
          },
          {
            status: 'PUBLISHED'
          },
          userCategories.size > 0 ? {
            category: {
              in: Array.from(userCategories)
            }
          } : {}
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        category: true,
        difficulty: true,
        price: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: [
        {
          enrollments: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ],
      take: 6
    });

    // Si no hay suficientes recomendaciones basadas en preferencias, agregar cursos populares
    let finalRecommendations = recommendedCourses;
    
    if (finalRecommendations.length < 3) {
      const popularCourses = await prisma.course.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: [
                  ...enrolledCourseIds,
                  ...finalRecommendations.map(c => c.id)
                ]
              }
            },
            {
              status: 'PUBLISHED'
            }
          ]
        },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          imageUrl: true,
          category: true,
          difficulty: true,
          price: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true
            }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        },
        take: 3 - finalRecommendations.length
      });

      finalRecommendations = [...finalRecommendations, ...popularCourses];
    }

    // Calcular match score y razón de recomendación
    const coursesWithRecommendations = finalRecommendations.map(course => {
      let matchScore = 70; // Base score
      let recommendationReason = 'Popular entre estudiantes como tú';

      // Aumentar score por categoría coincidente
      if (course.category && userCategories.has(course.category)) {
        matchScore += 15;
        recommendationReason = 'Basado en tu progreso en cursos de ' + course.category;
      }

      // Cap at 100
      matchScore = Math.min(matchScore, 100);

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description || 'Curso de alta calidad en nuestra plataforma',
        imageUrl: course.imageUrl,
        category: course.category,
        level: course.difficulty || 'BEGINNER',
        duration: '4-6 horas', // Valor mock, deberías calcularlo basado en lecciones
        price: Number(course.price),
        rating: 4.5 + Math.random() * 0.5, // Rating mock
        studentsCount: course._count.enrollments,
        tags: [], // No hay tags en el schema actual
        recommendationReason,
        matchScore
      };
    });

    // Ordenar por match score descendente
    coursesWithRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    const response = {
      courses: coursesWithRecommendations.slice(0, 3), // Máximo 3 recomendaciones
      reasons: {
        basedOnProgress: Array.from(userCategories),
        basedOnInterests: [],
        trending: ['IA', 'Marketing Digital', 'Emprendimiento']
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}