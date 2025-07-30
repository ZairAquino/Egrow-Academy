import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourses() {
  console.log('🔍 Verificando cursos en la base de datos...');
  
  try {
    await prisma.$connect();
    
    // Verificar cursos
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        lessonsCount: true,
        studentsCount: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📚 Total de cursos: ${courses.length}`);
    
    if (courses.length === 0) {
      console.log('✅ No hay cursos en la base de datos');
    } else {
      console.log('\n📋 Lista de cursos:');
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.title}`);
        console.log(`   Slug: ${course.slug}`);
        console.log(`   Status: ${course.status}`);
        console.log(`   Lecciones: ${course.lessonsCount}`);
        console.log(`   Estudiantes: ${course.studentsCount}`);
        console.log(`   Creado: ${course.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

    // Verificar lecciones
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        courseId: true
      }
    });

    console.log(`📖 Total de lecciones: ${lessons.length}`);
    
    if (lessons.length > 0) {
      console.log('\n📝 Lecciones encontradas:');
      lessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.title} (Course ID: ${lesson.courseId})`);
      });
    }

    // Verificar inscripciones
    const enrollments = await prisma.enrollment.findMany({
      select: {
        id: true,
        courseId: true,
        userId: true,
        status: true
      }
    });

    console.log(`\n👥 Total de inscripciones: ${enrollments.length}`);

    // Verificar comentarios
    try {
      const comments = await prisma.comment.findMany({
        select: {
          id: true,
          courseId: true,
          content: true,
          type: true
        }
      });
      console.log(`💬 Total de comentarios: ${comments.length}`);
    } catch (error) {
      console.log('💬 Comentarios: Tabla no disponible');
    }

    // Verificar pagos relacionados con cursos
    try {
      const coursePayments = await prisma.payment.findMany({
        where: {
          courseId: {
            not: null
          }
        },
        select: {
          id: true,
          courseId: true,
          amount: true,
          status: true
        }
      });
      console.log(`💳 Pagos de cursos: ${coursePayments.length}`);
    } catch (error) {
      console.log('💳 Pagos: Tabla no disponible');
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error al verificar cursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCourses(); 