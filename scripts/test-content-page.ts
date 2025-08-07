import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testContentPage() {
  try {
    console.log('🧪 Probando página de contenido del curso...');
    
    // 1. Verificar que el curso existe
    const course = await prisma.course.findUnique({
      where: {
        slug: 'guiones-videos-promocionales-ia'
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
      console.log('❌ Curso no encontrado');
      return;
    }

    console.log('✅ Curso encontrado:', course.title);
    console.log(`📚 Lecciones: ${course.lessons.length}`);

    // 2. Verificar que hay usuarios inscritos
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: course.id
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    console.log(`👥 Usuarios inscritos: ${enrollments.length}`);

    // 3. Verificar que las lecciones están bien ordenadas
    const lessons = course.lessons;
    console.log('\n📋 Verificando orden de lecciones:');
    
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title} (Orden: ${lesson.order}, Duración: ${lesson.duration}min)`);
    });

    // 4. Verificar que no hay lecciones duplicadas
    const orderNumbers = lessons.map(l => l.order);
    const uniqueOrders = new Set(orderNumbers);
    
    if (orderNumbers.length !== uniqueOrders.size) {
      console.log('⚠️ ADVERTENCIA: Hay lecciones con orden duplicado');
    } else {
      console.log('✅ Orden de lecciones correcto');
    }

    // 5. Verificar que todas las lecciones tienen título y duración
    const invalidLessons = lessons.filter(l => !l.title || !l.duration);
    if (invalidLessons.length > 0) {
      console.log('⚠️ ADVERTENCIA: Hay lecciones sin título o duración');
      invalidLessons.forEach(l => {
        console.log(`  - ID: ${l.id}, Título: ${l.title}, Duración: ${l.duration}`);
      });
    } else {
      console.log('✅ Todas las lecciones tienen título y duración');
    }

    // 6. Verificar progreso de usuarios
    console.log('\n📊 Verificando progreso de usuarios:');
    enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. ${enrollment.user.firstName} ${enrollment.user.lastName}`);
      console.log(`   Email: ${enrollment.user.email}`);
      console.log(`   Estado: ${enrollment.status}`);
      console.log(`   Progreso: ${enrollment.progressPercentage}%`);
    });

    console.log('\n🎯 Resumen:');
    console.log(`- Curso: ${course.title}`);
    console.log(`- Estado: ${course.status}`);
    console.log(`- Lecciones: ${lessons.length}`);
    console.log(`- Usuarios inscritos: ${enrollments.length}`);
    console.log(`- Es gratis: ${course.isFree}`);

    if (course.status === 'PUBLISHED' && lessons.length > 0 && enrollments.length > 0) {
      console.log('✅ La página de contenido debería funcionar correctamente');
    } else {
      console.log('⚠️ Puede haber problemas con la página de contenido');
    }

  } catch (error) {
    console.error('❌ Error al probar la página de contenido:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testContentPage();
