import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';
import { generateToken } from '../src/lib/auth';

async function testAuth() {
  try {
    console.log('🔍 [TEST] Iniciando prueba de autenticación...');
    
    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      }
    });
    
    if (!user) {
      console.log('❌ [TEST] No se encontró ningún usuario');
      return;
    }
    
    console.log('✅ [TEST] Usuario encontrado:', user.email);
    
    // Generar token
    const token = generateToken(user.id);
    console.log('✅ [TEST] Token generado:', token.substring(0, 50) + '...');
    
    // Buscar un curso
    const course = await prisma.course.findFirst({
      where: {
        slug: 'desarrollo-web-fullstack'
      }
    });
    
    if (!course) {
      console.log('❌ [TEST] No se encontró el curso desarrollo-web-fullstack');
      return;
    }
    
    console.log('✅ [TEST] Curso encontrado:', course.title);
    
    // Verificar inscripción
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: course.id
      }
    });
    
    if (!enrollment) {
      console.log('⚠️ [TEST] Usuario no está inscrito en el curso');
      
      // Crear inscripción de prueba
      const newEnrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          enrolledAt: new Date(),
          status: 'ACTIVE',
          progressPercentage: 0
        }
      });
      
      console.log('✅ [TEST] Inscripción creada:', newEnrollment.id);
    } else {
      console.log('✅ [TEST] Usuario ya está inscrito en el curso');
    }
    
    // Verificar progreso
    const progress = await prisma.courseProgress.findFirst({
      where: {
        enrollmentId: enrollment?.id || ''
      }
    });
    
    if (!progress) {
      console.log('⚠️ [TEST] No hay progreso registrado');
      
      if (enrollment) {
        const newProgress = await prisma.courseProgress.create({
          data: {
            enrollmentId: enrollment.id,
            currentLesson: 0,
            completedLessons: [],
            progressPercentage: 0,
            status: 'NOT_STARTED',
            lastAccessed: new Date()
          }
        });
        
        console.log('✅ [TEST] Progreso creado:', newProgress.id);
      }
    } else {
      console.log('✅ [TEST] Progreso encontrado:', progress.id);
    }
    
    console.log('✅ [TEST] Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ [TEST] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth(); 