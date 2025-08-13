import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('🔄 Obteniendo curso por slug:', slug);
    
    // Buscar el curso publicado con toda su información
    const course = await prisma.course.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        instructor: true,
        enrollments: {
          select: {
            userId: true
          }
        },
        ratings: true,
        comments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Si hay snapshot de plantilla, devolverlo directamente (vista 1:1 del preview)
    const meta: any = (course as any).meta || {};
    if (meta?.pageDataV1) {
      return NextResponse.json(meta.pageDataV1);
    }

    // Fallback: Construcción de respuesta en base a datos del curso
    const formattedCourse = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category,
      level: (course as any).difficulty || 'Todos los niveles',
      language: 'Español',
      duration: course.durationHours,
      price: Number(course.price),
      originalPrice: (course as any).originalPrice ?? (course.price > 0 ? Number(course.price) * 1.5 : null),
      currency: 'USD',
      thumbnail: course.imageUrl || '/images/default-course.jpg',
      introVideo: (course as any).mainVideoUrl || null,
      isFree: course.isFree,
      requiresAuth: course.requiresAuth,
      learningGoals: (course as any).learningGoals || (course as any).whatYouWillLearn || [],
      objectivesLead: (course as any).objectivesLead,
      requirements: (course as any).prerequisites || [],
      targetAudience: [],
      tools: (course as any).tools || [],
      instructor: course.instructor ? {
        id: course.instructor.id,
        name: course.instructor.name,
        email: course.instructor.email,
        title: (course.instructor as any).title || 'Instructor',
        image: course.instructor.image || '/images/default-instructor.jpg',
        bio: course.instructor.bio
      } : {
        id: '1',
        name: 'eGrow Academy',
        email: 'instructor@egrowacademy.com',
        title: 'Especialista en ' + course.category,
        image: '/images/Zair.jpeg',
        bio: 'Experto con más de 5 años de experiencia en el sector.'
      },
      // En ausencia de estructura de módulos en BD, agrupar todas las lecciones en un módulo
      modules: [
        {
          id: 1,
          title: 'Contenido del curso',
          description: '',
          order: 1,
          lessons: course.lessons.map((lesson: any, index: number) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.content?.substring(0, 200) || '',
            type: 'video',
            duration: lesson.duration || 15,
            videoUrl: lesson.videoUrl,
            order: index + 1,
            isFree: index === 0
          }))
        }
      ],
      testimonials: course.comments?.map((comment: any) => ({
        id: comment.id,
        studentName: comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Estudiante',
        content: comment.content,
        rating: 5,
        studentTitle: 'Estudiante del curso'
      })) || [],
      enrollmentCount: course.studentsCount || course.enrollments.length,
      lessonsCount: course.lessons?.length || course.lessonsCount,
      totalDuration: course.lessons?.reduce((sum: number, lesson: any) => 
        sum + (lesson.duration || 0), 0
      ) || (course.durationHours * 60)
    };

    console.log('✅ Curso encontrado:', formattedCourse.title);

    return NextResponse.json(formattedCourse);

  } catch (error) {
    console.error('❌ Error obteniendo curso:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}