import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyProgress() {
  console.log('🔍 Verificando sistema de guardado de progreso...');

  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar estructura de la base de datos
    console.log('\n📊 Verificando tablas de progreso...');
    
    // Contar enrollments
    const enrollmentsCount = await prisma.enrollment.count();
    console.log(`📚 Inscripciones totales: ${enrollmentsCount}`);
    
    // Contar progresos
    const progressCount = await prisma.courseProgress.count();
    console.log(`📈 Progresos totales: ${progressCount}`);
    
    // Contar lecciones completadas
    const lessonProgressCount = await prisma.lessonProgress.count();
    console.log(`✅ Progresos de lecciones: ${lessonProgressCount}`);

    // Verificar un ejemplo de progreso
    const sampleProgress = await prisma.courseProgress.findFirst({
      include: {
        enrollment: {
          include: {
            course: true,
            user: true
          }
        }
      }
    });

    if (sampleProgress) {
      console.log('\n📋 Ejemplo de progreso:');
      console.log(`   - Usuario: ${sampleProgress.enrollment.user.name}`);
      console.log(`   - Curso: ${sampleProgress.enrollment.course.title}`);
      console.log(`   - Lección actual: ${sampleProgress.currentLesson}`);
      console.log(`   - Lecciones completadas: ${sampleProgress.completedLessons.length}`);
      console.log(`   - Porcentaje: ${sampleProgress.progressPercentage}%`);
      console.log(`   - Estado: ${sampleProgress.status}`);
      console.log(`   - Último acceso: ${sampleProgress.lastAccessed}`);
    } else {
      console.log('\n⚠️  No hay progresos registrados');
    }

    // Verificar configuración del hook
    console.log('\n🔧 Verificando configuración del hook useCourseProgress...');
    
    // Verificar que el hook esté configurado correctamente
    const hookFile = await import('fs').then(fs => 
      fs.readFileSync('src/hooks/useCourseProgress.ts', 'utf8')
    );
    
    if (hookFile.includes('saveProgress')) {
      console.log('✅ Función saveProgress encontrada en el hook');
    } else {
      console.log('❌ Función saveProgress no encontrada');
    }
    
    if (hookFile.includes('markLessonComplete')) {
      console.log('✅ Función markLessonComplete encontrada en el hook');
    } else {
      console.log('❌ Función markLessonComplete no encontrada');
    }

    // Verificar endpoint de la API
    console.log('\n🌐 Verificando endpoint de la API...');
    
    const apiFile = await import('fs').then(fs => 
      fs.readFileSync('src/app/api/courses/progress/route.ts', 'utf8')
    );
    
    if (apiFile.includes('export async function POST')) {
      console.log('✅ Endpoint POST encontrado');
    } else {
      console.log('❌ Endpoint POST no encontrado');
    }
    
    if (apiFile.includes('export async function GET')) {
      console.log('✅ Endpoint GET encontrado');
    } else {
      console.log('❌ Endpoint GET no encontrado');
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  verifyProgress()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { verifyProgress }; 