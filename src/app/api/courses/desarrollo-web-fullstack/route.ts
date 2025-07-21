import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [COURSE-API] Obteniendo curso desarrollo-web-fullstack...');
    
    const course = await prisma.course.findUnique({
      where: {
        slug: 'desarrollo-web-fullstack'
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!course) {
      console.log('❌ [COURSE-API] Curso no encontrado');
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ [COURSE-API] Curso encontrado:', course.title);
    
    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        difficulty: course.difficulty,
        durationHours: course.durationHours,
        price: course.price,
        imageUrl: course.imageUrl,
        status: course.status,
        lessons: course.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          duration: lesson.duration,
          type: lesson.type
        }))
      }
    });

  } catch (error) {
    console.error('❌ [COURSE-API] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 