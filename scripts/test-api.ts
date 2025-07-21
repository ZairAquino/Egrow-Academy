import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: resolve(__dirname, '../.env.local') });

import { prisma } from '../src/lib/prisma';
import { generateToken } from '../src/lib/auth';

async function testAPI() {
  try {
    console.log('🔍 [API TEST] Iniciando prueba de endpoints...');
    
    // Buscar un usuario de prueba
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      }
    });
    
    if (!user) {
      console.log('❌ [API TEST] No se encontró ningún usuario');
      return;
    }
    
    console.log('✅ [API TEST] Usuario encontrado:', user.email);
    
    // Generar token
    const token = generateToken(user.id);
    console.log('✅ [API TEST] Token generado:', token.substring(0, 50) + '...');
    
    // Probar endpoint /api/auth/me
    console.log('🔍 [API TEST] Probando /api/auth/me...');
    const meResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (meResponse.ok) {
      const meData = await meResponse.json();
      console.log('✅ [API TEST] /api/auth/me exitoso:', meData.user.email);
    } else {
      console.log('❌ [API TEST] /api/auth/me falló:', meResponse.status, meResponse.statusText);
    }
    
    // Probar endpoint /api/courses/user-courses
    console.log('🔍 [API TEST] Probando /api/courses/user-courses...');
    const userCoursesResponse = await fetch('http://localhost:3000/api/courses/user-courses', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (userCoursesResponse.ok) {
      const userCoursesData = await userCoursesResponse.json();
      console.log('✅ [API TEST] /api/courses/user-courses exitoso:', userCoursesData.courses.length, 'cursos');
    } else {
      console.log('❌ [API TEST] /api/courses/user-courses falló:', userCoursesResponse.status, userCoursesResponse.statusText);
    }
    
    // Probar endpoint /api/courses/progress
    console.log('🔍 [API TEST] Probando /api/courses/progress...');
    const progressResponse = await fetch('http://localhost:3000/api/courses/progress?courseId=desarrollo-web-fullstack', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      console.log('✅ [API TEST] /api/courses/progress exitoso:', progressData.currentLesson, 'lección actual');
    } else {
      console.log('❌ [API TEST] /api/courses/progress falló:', progressResponse.status, progressResponse.statusText);
    }
    
    console.log('✅ [API TEST] Prueba completada');
    
  } catch (error) {
    console.error('❌ [API TEST] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI(); 