import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recordLessonCompletion } from '@/lib/streaks';

// GET - Obtener progreso del usuario en un curso
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Verificar token del usuario (buscar en cookies y headers)
    const cookieToken = request.cookies.get('session')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (tokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const userId = decoded.userId;

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // ✅ OPTIMIZADO: Buscar curso y enrollment en una sola consulta
    let actualCourseId = courseId;
    
    // Verificar si es un UUID válido
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    
    if (!isUUID) {
      // Si no es un UUID, buscar por slug
      const course = await prisma.course.findFirst({
        where: { slug: courseId },
        select: { id: true } // ✅ Solo necesitamos el ID
      });
      if (course) {
        actualCourseId = course.id;
      } else {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    // ✅ OPTIMIZADO: Una sola consulta para enrollment y progress
    const enrollmentWithProgress = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: actualCourseId
      },
      select: {
        id: true,
        enrolledAt: true,
        progressPercentage: true,
        status: true,
        progress: {
          select: {
            id: true,
            currentLesson: true,
            completedLessons: true,
            progressPercentage: true,
            lastAccessed: true,
            startedAt: true,
            completedAt: true,
            totalTimeSpent: true,
            totalSessions: true,
            averageSessionTime: true,
            longestSession: true,
            status: true,
            lessonProgress: {
              select: {
                id: true,
                lessonNumber: true,
                lessonTitle: true,
                isCompleted: true,
                completedAt: true,
                timeSpent: true,
                firstAccessed: true,
                lastAccessed: true,
                accessCount: true,
                completionAttempts: true
              },
              orderBy: { lessonNumber: 'asc' }
            }
          }
        }
      }
    });

    if (!enrollmentWithProgress) {
      return NextResponse.json({ error: 'User not enrolled in this course' }, { status: 404 });
    }

    // Si no existe progress, crear uno inicial
    let progress = enrollmentWithProgress.progress;
    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          enrollmentId: enrollmentWithProgress.id,
          currentLesson: 0,
          completedLessons: [],
          progressPercentage: 0,
          status: 'NOT_STARTED',
          lastAccessed: new Date()
        },
        select: {
          id: true,
          currentLesson: true,
          completedLessons: true,
          progressPercentage: true,
          lastAccessed: true,
          startedAt: true,
          completedAt: true,
          totalTimeSpent: true,
          totalSessions: true,
          averageSessionTime: true,
          longestSession: true,
          status: true,
          lessonProgress: {
            select: {
              id: true,
              lessonNumber: true,
              lessonTitle: true,
              isCompleted: true,
              completedAt: true,
              timeSpent: true,
              firstAccessed: true,
              lastAccessed: true,
              accessCount: true,
              completionAttempts: true
            },
            orderBy: { lessonNumber: 'asc' }
          }
        }
      });
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
      totalLessons: (() => {
        switch (courseId) {
          case 'asistentes-virtuales-ia': return 21;
          case 'vibe-coding-claude-cursor': return 6;
          case 'videos-profesionales-ia': return 21;
          case 'mockup-cero': return 8;
          case 'monetiza-ia': return 8;
          default: return 18;
        }
      })()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [API-GET] Error loading course progress:', error);
    console.error('❌ [API-GET] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
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

    // Verificar token del usuario (buscar en cookies y headers)
    const cookieToken = request.cookies.get('session')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const userId = decoded.userId;

    // Verificar si es una sesión de base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    // Si es una sesión de BD, verificar que no haya expirado
    if (session && session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // ✅ OPTIMIZADO: Buscar curso por slug si es necesario
    let actualCourseId = courseId;
    
    // Verificar si es un UUID válido
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    
    if (!isUUID) {
      // Si no es un UUID, buscar por slug
      const course = await prisma.course.findFirst({
        where: { slug: courseId },
        select: { id: true } // ✅ Solo necesitamos el ID
      });
      if (course) {
        actualCourseId = course.id;
      } else {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    // ✅ OPTIMIZADO: Buscar enrollment y progress en una sola consulta
    let enrollmentWithProgress = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: actualCourseId
      },
      select: {
        id: true,
        progressPercentage: true,
        progress: {
          select: {
            id: true,
            currentLesson: true,
            completedLessons: true,
            progressPercentage: true,
            totalTimeSpent: true,
            totalSessions: true,
            status: true
          }
        }
      }
    });

    if (!enrollmentWithProgress) {
      console.log('🔍 [API] Usuario no inscrito, creando inscripción automática');
      
      try {
        // Crear inscripción automática
        enrollmentWithProgress = await prisma.enrollment.create({
          data: {
            userId: userId,
            courseId: actualCourseId,
            enrolledAt: new Date(),
            status: 'ACTIVE',
            progressPercentage: 0
          },
          select: {
            id: true,
            progressPercentage: true,
            progress: {
              select: {
                id: true,
                currentLesson: true,
                completedLessons: true,
                progressPercentage: true,
                totalTimeSpent: true,
                totalSessions: true,
                status: true
              }
            }
          }
        });
      } catch (enrollmentError) {
        return NextResponse.json({ error: 'Error creating enrollment' }, { status: 500 });
      }
    }

    // Obtener o crear el progreso del curso
    let progress = enrollmentWithProgress.progress;

    if (!progress) {
      progress = await prisma.courseProgress.create({
        data: {
          enrollmentId: enrollmentWithProgress.id,
          currentLesson: 0,
          completedLessons: [],
          progressPercentage: 0,
          status: 'IN_PROGRESS',
          lastAccessed: new Date()
        },
        select: {
          id: true,
          currentLesson: true,
          completedLessons: true,
          progressPercentage: true,
          totalTimeSpent: true,
          totalSessions: true,
          status: true
        }
      });
    }

    // Calcular nuevo porcentaje de progreso
    const totalLessons = (() => {
      switch (courseId) {
        case 'asistentes-virtuales-ia': return 21;
        case 'vibe-coding-claude-cursor': return 6;
        case 'videos-profesionales-ia': return 21;
        case 'mockup-cero': return 8;
        case 'monetiza-ia': return 8;
        default: return 18;
      }
    })();
    const newProgressPercentage = Math.round((completedLessons?.length || 0) / totalLessons * 100);

    // Determinar el estado del curso
    let newStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';
    if (newProgressPercentage === 0) {
      newStatus = 'NOT_STARTED';
    } else if (newProgressPercentage === 100) {
      newStatus = 'COMPLETED';
    }

    // ✅ OPTIMIZADO: Actualizar progreso general del curso
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
      },
      select: {
        currentLesson: true,
        completedLessons: true,
        progressPercentage: true,
        status: true,
        totalTimeSpent: true
      }
    });

    // Si se proporciona información de lección específica, actualizar o crear
    if (lessonNumber !== undefined && lessonTitle) {
      console.log(`📝 [API] Procesando lección: ${lessonNumber} - ${lessonTitle}`);

      // Determinar si lessonNumber es un ID (string) o un número
      const isLessonId = typeof lessonNumber === 'string' && lessonNumber.length > 10;
      
      if (isLessonId) {
        // Es un ID real de la base de datos, usar un número basado en el índice
        // Para el sistema de racha, usamos el índice + 1 como número de lección
        const lessonIndex = progress.currentLesson;
        const lessonNumberForStreak = lessonIndex + 1;
        
        console.log(`🆔 [API] ID de lección detectado: ${lessonNumber}, usando número: ${lessonNumberForStreak}`);
        
        // Para el sistema de racha, usar el número de lección
        console.log(`🆔 [API] ID de lección detectado: ${lessonNumber}, usando número: ${lessonNumberForStreak}`);
      } else {
        // Es un número tradicional, usar directamente
        const lessonNumberInt = typeof lessonNumber === 'number' ? lessonNumber : parseInt(lessonNumber);
        
        if (isNaN(lessonNumberInt)) {
          console.error('❌ [API] lessonNumber inválido:', lessonNumber);
          return NextResponse.json({ 
            error: 'Invalid lesson number',
            details: `lessonNumber debe ser un número válido, recibido: ${lessonNumber}`
          }, { status: 400 });
        }

        console.log(`📝 [API] Número de lección tradicional: ${lessonNumberInt}`);

        // ✅ OPTIMIZADO: Upsert para lessonProgress
        await prisma.lessonProgress.upsert({
          where: {
            courseProgressId_lessonNumber: {
              courseProgressId: progress.id,
              lessonNumber: lessonNumberInt
            }
          },
          update: {
            isCompleted: action === 'complete' ? true : undefined,
            completedAt: action === 'complete' ? new Date() : undefined,
            timeSpent: {
              increment: timeSpent || 0
            },
            lastAccessed: new Date(),
            accessCount: {
              increment: 1
            },
            completionAttempts: action === 'complete' ? {
              increment: 1
            } : undefined
          },
          create: {
            courseProgressId: progress.id,
            lessonNumber: lessonNumberInt,
            lessonTitle: lessonTitle,
            isCompleted: action === 'complete',
            completedAt: action === 'complete' ? new Date() : null,
            timeSpent: timeSpent || 0,
            accessCount: 1,
            completionAttempts: action === 'complete' ? 1 : 0
          }
        });
      }
    }

    // ✅ OPTIMIZADO: Actualizar el porcentaje de progreso en la inscripción
    await prisma.enrollment.update({
      where: { id: enrollmentWithProgress.id },
      data: { progressPercentage: newProgressPercentage }
    });

    // Crear la respuesta
    const response = NextResponse.json({
      success: true,
      progress: {
        currentLesson: updatedProgress.currentLesson,
        completedLessons: updatedProgress.completedLessons,
        progressPercentage: Number(updatedProgress.progressPercentage),
        status: updatedProgress.status,
        totalTimeSpent: updatedProgress.totalTimeSpent
      },
      // Agregar flag para indicar que se completó una lección
      lessonCompleted: action === 'complete'
    });

    // 🏆 NUEVO: Registrar lección completada en el sistema de rachas
    if (action === 'complete') {
      try {
        // Determinar el número de lección para el sistema de racha
        let lessonNumberForStreak: number;
        
        if (typeof lessonNumber === 'string' && lessonNumber.length > 10) {
          // Es un ID real, usar el índice actual + 1
          lessonNumberForStreak = progress.currentLesson + 1;
        } else {
          // Es un número tradicional
          lessonNumberForStreak = typeof lessonNumber === 'number' ? lessonNumber : parseInt(lessonNumber);
        }
        
        console.log(`🏆 [RACHAS] Registrando lección completada: ${lessonTitle} por usuario ${userId}`);
        console.log(`🏆 [RACHAS] Parámetros: userId=${userId}, courseId=${actualCourseId}, lessonNumber=${lessonNumberForStreak}, lessonTitle=${lessonTitle}`);
        
        // Verificar que todos los parámetros necesarios estén presentes
        if (!userId || !actualCourseId || !lessonNumberForStreak || !lessonTitle) {
          console.error('⚠️ [RACHAS] Parámetros faltantes:', { userId, actualCourseId, lessonNumber: lessonNumberForStreak, lessonTitle });
          throw new Error('Parámetros faltantes para registrar lección');
        }
        
        const streakResult = await recordLessonCompletion(userId, actualCourseId, lessonNumberForStreak, lessonTitle);
        console.log(`✅ [RACHAS] Lección registrada exitosamente:`, streakResult);
        
        // Agregar información de racha a la respuesta
        response.headers.set('X-Streak-Updated', 'true');
        response.headers.set('X-Week-Progress', streakResult.weekProgress);
        response.headers.set('X-Goal-Met', streakResult.goalMet.toString());
        
      } catch (streakError) {
        // No fallar toda la operación si hay error en rachas
        console.error('⚠️ [RACHAS] Error registrando lección en sistema de rachas:', streakError);
        console.error('⚠️ [RACHAS] Error details:', {
          message: streakError instanceof Error ? streakError.message : 'Unknown error',
          stack: streakError instanceof Error ? streakError.stack : undefined,
          userId,
          courseId: actualCourseId,
          lessonNumber,
          lessonTitle
        });
        
        // Agregar header para indicar error en rachas
        response.headers.set('X-Streak-Error', 'true');
      }
    }

    // Agregar header para que el cliente sepa que debe actualizar rachas
    if (action === 'complete') {
      response.headers.set('X-Lesson-Completed', 'true');
    }

    return response;

  } catch (error) {
    console.error('❌ [API] Error saving course progress:', error);
    console.error('❌ [API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
    }, { status: 500 });
  }
} 