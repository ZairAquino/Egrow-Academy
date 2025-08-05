import { PrismaClient } from '@prisma/client';

async function correctDatabaseCheck() {
  console.log('🔍 Verificación corregida de la base de datos de desarrollo...\n');

  const prisma = new PrismaClient();

  try {
    // Verificar conexión
    console.log('🔌 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Verificar usuarios
    console.log('👥 Verificando usuarios:');
    const users = await prisma.user.findMany();
    console.log(`Usuarios encontrados: ${users.length}`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.firstName} ${user.lastName}`);
    });

    // Verificar inscripciones
    console.log('\n📚 Verificando inscripciones:');
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: true,
        course: true
      }
    });
    console.log(`Inscripciones encontradas: ${enrollments.length}`);
    enrollments.forEach((enrollment, index) => {
      console.log(`${index + 1}. ${enrollment.user?.email || 'Usuario no encontrado'} - ${enrollment.course?.title || 'Curso no encontrado'}`);
    });

    // Verificar progreso de cursos
    console.log('\n📊 Verificando progreso de cursos:');
    const courseProgress = await prisma.courseProgress.findMany({
      include: {
        enrollment: {
          include: {
            user: true,
            course: true
          }
        }
      }
    });
    console.log(`Progreso de cursos encontrado: ${courseProgress.length}`);
    courseProgress.forEach((progress, index) => {
      const user = progress.enrollment?.user;
      const course = progress.enrollment?.course;
      console.log(`${index + 1}. ${user?.email || 'Usuario no encontrado'} - ${course?.title || 'Curso no encontrado'} - ${progress.progressPercentage}%`);
    });

    // Verificar progreso de lecciones
    console.log('\n📖 Verificando progreso de lecciones:');
    const lessonProgress = await prisma.lessonProgress.findMany({
      include: {
        courseProgress: {
          include: {
            enrollment: {
              include: {
                user: true,
                course: true
              }
            }
          }
        }
      }
    });
    console.log(`Progreso de lecciones encontrado: ${lessonProgress.length}`);
    lessonProgress.forEach((progress, index) => {
      const user = progress.courseProgress?.enrollment?.user;
      const course = progress.courseProgress?.enrollment?.course;
      console.log(`${index + 1}. ${user?.email || 'Usuario no encontrado'} - ${course?.title || 'Curso no encontrado'} - Lección ${progress.lessonNumber}: ${progress.lessonTitle} - ${progress.isCompleted ? 'Completada' : 'En progreso'}`);
    });

    // Verificar webinars y registros
    console.log('\n🎥 Verificando webinars:');
    const webinars = await prisma.webinar.findMany();
    console.log(`Webinars encontrados: ${webinars.length}`);
    webinars.forEach((webinar, index) => {
      console.log(`${index + 1}. ${webinar.title} - ${webinar.dateTime}`);
    });

    console.log('\n📝 Verificando registros de webinars:');
    const webinarRegistrations = await prisma.webinarRegistration.findMany({
      include: {
        user: true,
        webinar: true
      }
    });
    console.log(`Registros de webinars encontrados: ${webinarRegistrations.length}`);
    webinarRegistrations.forEach((registration, index) => {
      console.log(`${index + 1}. ${registration.email} - ${registration.firstName} ${registration.lastName} - ${registration.webinar?.title || 'Webinar no encontrado'}`);
    });

    // Verificar cursos y lecciones
    console.log('\n📚 Verificando cursos:');
    const courses = await prisma.course.findMany();
    console.log(`Cursos encontrados: ${courses.length}`);
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - ${course.lessonsCount} lecciones`);
    });

    console.log('\n📖 Verificando lecciones:');
    const lessons = await prisma.lesson.findMany({
      include: {
        course: true
      }
    });
    console.log(`Lecciones encontradas: ${lessons.length}`);
    lessons.forEach((lesson, index) => {
      console.log(`${index + 1}. ${lesson.title} - Curso: ${lesson.course?.title || 'Curso no encontrado'}`);
    });

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

correctDatabaseCheck().catch(console.error); 