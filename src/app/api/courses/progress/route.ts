import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener progreso del usuario en un curso
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET /api/courses/progress iniciado');
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    console.log('🔍 [API] Course ID:', courseId);
    
    if (!courseId) {
      console.log('🔍 [API] Error: Course ID is required');
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Verificar token del usuario
    const token = request.cookies.get('auth-token')?.value;
    console.log('🔍 [API] Token encontrado:', !!token);
    
    if (!token) {
      console.log('🔍 [API] Error: No auth token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = await verifyToken(token);
      console.log('🔍 [API] Token verificado, userId:', decoded.userId);
    } catch (tokenError) {
      console.error('🔍 [API] Error verificando token:', tokenError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const userId = decoded.userId;

    // Buscar el curso por slug si es necesario
    let actualCourseId = courseId;
    
    // Verificar si es un UUID válido (contiene solo caracteres hexadecimales y guiones)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    
    if (!isUUID) {
      // Si no es un UUID, buscar por slug
      console.log('🔍 [API] Buscando curso por slug:', courseId);
      const course = await prisma.course.findFirst({
        where: { slug: courseId }
      });
      if (course) {
        actualCourseId = course.id;
        console.log('🔍 [API] Curso encontrado por slug:', course.title, 'ID:', actualCourseId);
      } else {
        console.error('🔍 [API] Curso no encontrado con slug:', courseId);
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    } else {
      console.log('🔍 [API] CourseId parece ser un UUID válido:', courseId);
    }

    // Buscar la inscripción del usuario
    console.log('🔍 [API] Buscando inscripción para userId:', userId, 'courseId:', actualCourseId);
    
    let enrollment;
    try {
      enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: userId,
          courseId: actualCourseId
        }
      });
      console.log('🔍 [API] Inscripción encontrada:', !!enrollment);
    } catch (enrollmentError) {
      console.error('🔍 [API] Error buscando inscripción:', enrollmentError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!enrollment) {
      console.log('🔍 [API] Error: Usuario no inscrito en el curso');
      return NextResponse.json({ error: 'User not enrolled in this course' }, { status: 404 });
    }

    // Obtener el progreso guardado
    console.log('🔍 [API] Buscando progreso para enrollmentId:', enrollment.id);
    
    let progress;
    try {
      progress = await prisma.courseProgress.findFirst({
        where: {
          enrollmentId: enrollment.id
        },
        include: {
          lessonProgress: {
            orderBy: {
              lessonNumber: 'asc'
            }
          }
        }
      });
      console.log('🔍 [API] Progreso encontrado:', !!progress);
    } catch (progressError) {
      console.error('🔍 [API] Error buscando progreso:', progressError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Si no existe, crear un registro inicial
    if (!progress) {
      console.log('🔍 [API] Creando nuevo registro de progreso');
      let newProgress;
      try {
        newProgress = await prisma.courseProgress.create({
          data: {
            enrollmentId: enrollment.id,
            currentLesson: 0,
            completedLessons: [],
            progressPercentage: 0,
            status: 'NOT_STARTED',
            lastAccessed: new Date()
          },
          include: {
            lessonProgress: {
              orderBy: {
                lessonNumber: 'asc'
              }
            }
          }
        });
        progress = newProgress;
        console.log('🔍 [API] Nuevo progreso creado exitosamente');
      } catch (createError) {
        console.error('🔍 [API] Error creando progreso:', createError);
        return NextResponse.json({ error: 'Error creating progress' }, { status: 500 });
      }
    }

    // Formatear la respuesta
    const response = {
      currentLesson: progress.currentLesson,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage,
      status: progress.status,
      totalTimeSpent: progress.totalTimeSpent || 0,
      totalSessions: progress.totalSessions || 0,
      averageSessionTime: progress.averageSessionTime || 0,
      longestSession: progress.longestSession || 0,
      startedAt: progress.startedAt?.toISOString() || new Date().toISOString(),
      lastAccessed: progress.lastAccessed?.toISOString() || new Date().toISOString(),
      completedAt: progress.completedAt?.toISOString() || null,
      lessonProgress: progress.lessonProgress || [],
      totalLessons: 5 // Número fijo de lecciones para este curso
    };

    console.log('🔍 [API] Respuesta enviada exitosamente');
    return NextResponse.json(response);

  } catch (error) {
    console.error('🔍 [API] Error general:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Guardar progreso del usuario
export async function POST(request: NextRequest) {
  try {
    const { 
      courseId, 
      currentLesson, 
      completedLessons, 
      lessonNumber,
      lessonTitle,
      action,
      timeSpent 
    } = await request.json();
    
    if (!courseId || currentLesson === undefined) {
      return NextResponse.json({ error: 'Course ID and current lesson are required' }, { status: 400 });
    }

    // Verificar token del usuario
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const userId = decoded.userId;

    // Buscar el curso por slug si es necesario
    let actualCourseId = courseId;
    
    // Verificar si es un UUID válido (contiene solo caracteres hexadecimales y guiones)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    
    if (!isUUID) {
      // Si no es un UUID, buscar por slug
      console.log('🔍 [API] Buscando curso por slug:', courseId);
      const course = await prisma.course.findFirst({
        where: { slug: courseId }
      });
      if (course) {
        actualCourseId = course.id;
        console.log('🔍 [API] Curso encontrado por slug:', course.title, 'ID:', actualCourseId);
      } else {
        console.error('🔍 [API] Curso no encontrado con slug:', courseId);
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    } else {
      console.log('🔍 [API] CourseId parece ser un UUID válido:', courseId);
    }

    // Buscar la inscripción del usuario
    let enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: actualCourseId
      }
    });

    if (!enrollment) {
      console.log('🔍 [API] Usuario no inscrito, creando inscripción automática');
      
      try {
        // Crear inscripción automática
        enrollment = await prisma.enrollment.create({
          data: {
            userId: userId,
            courseId: actualCourseId,
            enrolledAt: new Date(),
            status: 'ACTIVE',
            progressPercentage: 0
          }
        });
        console.log('🔍 [API] Inscripción automática creada exitosamente');
      } catch (enrollmentError) {
        console.error('🔍 [API] Error creando inscripción automática:', enrollmentError);
        return NextResponse.json({ error: 'Error creating enrollment' }, { status: 500 });
      }
    }

    // Obtener o crear el progreso del curso
    let progress = await prisma.courseProgress.findFirst({
      where: {
        enrollmentId: enrollment.id
      }
    });

    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          enrollmentId: enrollment.id,
          currentLesson: 0,
          completedLessons: [],
          progressPercentage: 0,
          status: 'IN_PROGRESS',
          lastAccessed: new Date()
        }
      });
    }

    // Calcular nuevo porcentaje de progreso
    const totalLessons = 10;
    const newProgressPercentage = Math.round((completedLessons?.length || 0) / totalLessons * 100);

    // Determinar el estado del curso
    let newStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';
    if (newProgressPercentage === 0) {
      newStatus = 'NOT_STARTED';
    } else if (newProgressPercentage === 100) {
      newStatus = 'COMPLETED';
    }

    // Actualizar progreso general del curso
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        currentLesson: currentLesson || progress.currentLesson,
        completedLessons: completedLessons || progress.completedLessons,
        progressPercentage: newProgressPercentage,
        status: newStatus,
        lastAccessed: new Date(),
        totalTimeSpent: {
          increment: timeSpent || 0
        },
        totalSessions: {
          increment: 1
        },
        completedAt: newStatus === 'COMPLETED' ? new Date() : null
      }
    });

    // Si se proporciona información de lección específica, actualizar o crear
    if (lessonNumber !== undefined && lessonTitle) {
      let lessonProgress = await prisma.lessonProgress.findFirst({
        where: {
          courseProgressId: progress.id,
          lessonNumber: lessonNumber
        }
      });

      if (!lessonProgress) {
        // Crear nuevo registro de progreso de lección
        lessonProgress = await prisma.lessonProgress.create({
          data: {
            courseProgressId: progress.id,
            lessonNumber: lessonNumber,
            lessonTitle: lessonTitle,
            isCompleted: action === 'complete',
            completedAt: action === 'complete' ? new Date() : null,
            timeSpent: timeSpent || 0,
            accessCount: 1,
            completionAttempts: action === 'complete' ? 1 : 0
          }
        });
      } else {
        // Actualizar progreso existente de lección
        await prisma.lessonProgress.update({
          where: { id: lessonProgress.id },
          data: {
            isCompleted: action === 'complete' ? true : lessonProgress.isCompleted,
            completedAt: action === 'complete' ? new Date() : lessonProgress.completedAt,
            timeSpent: {
              increment: timeSpent || 0
            },
            lastAccessed: new Date(),
            accessCount: {
              increment: 1
            },
            completionAttempts: action === 'complete' ? {
              increment: 1
            } : lessonProgress.completionAttempts
          }
        });
      }
    }

    // Actualizar el porcentaje de progreso en la inscripción general
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progressPercentage: newProgressPercentage }
    });

    return NextResponse.json({
      success: true,
      progress: {
        currentLesson: updatedProgress.currentLesson,
        completedLessons: updatedProgress.completedLessons,
        progressPercentage: Number(updatedProgress.progressPercentage),
        status: updatedProgress.status,
        totalTimeSpent: updatedProgress.totalTimeSpent
      }
    });

  } catch (error) {
    console.error('Error saving course progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 