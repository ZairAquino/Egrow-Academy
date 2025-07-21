import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';

async function resetProgress() {
  try {
    console.log('🔍 [RESET] Iniciando reseteo de progreso...');
    
    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      }
    });
    
    if (!user) {
      console.log('❌ [RESET] No se encontró ningún usuario');
      return;
    }
    
    console.log('✅ [RESET] Usuario encontrado:', user.email);
    
    // Buscar el curso
    const course = await prisma.course.findFirst({
      where: {
        slug: 'desarrollo-web-fullstack'
      }
    });
    
    if (!course) {
      console.log('❌ [RESET] No se encontró el curso desarrollo-web-fullstack');
      return;
    }
    
    console.log('✅ [RESET] Curso encontrado:', course.title);
    
    // Buscar la inscripción
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });
    
    if (!enrollment) {
      console.log('❌ [RESET] No se encontró inscripción');
      return;
    }
    
    console.log('✅ [RESET] Inscripción encontrada');
    
    // Buscar el progreso
    const progress = await prisma.courseProgress.findFirst({
      where: {
        enrollmentId: enrollment.id
      }
    });
    
    if (!progress) {
      console.log('❌ [RESET] No se encontró progreso');
      return;
    }
    
    console.log('✅ [RESET] Progreso encontrado, reseteando...');
    
    // Resetear el progreso
    await prisma.courseProgress.update({
      where: {
        id: progress.id
      },
      data: {
        currentLesson: 0,
        completedLessons: [],
        progressPercentage: 0,
        status: 'NOT_STARTED',
        lastAccessed: new Date()
      }
    });
    
    console.log('✅ [RESET] Progreso reseteado exitosamente');
    
  } catch (error) {
    console.error('❌ [RESET] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetProgress(); 