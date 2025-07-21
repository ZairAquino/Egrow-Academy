import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugEnrollmentIssue() {
  try {
    console.log('🔍 [DEBUG] Iniciando debug de problema de inscripción...\n');

    // 1. Verificar si el usuario existe
    const userId = 'cmdaqz7xn0000lb04edu7763y';
    console.log('1️⃣ Verificando usuario:', userId);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    console.log('✅ Usuario encontrado:', user.email, `${user.firstName} ${user.lastName}`);

    // 2. Verificar si el curso existe
    console.log('\n2️⃣ Verificando curso: desarrollo-web-fullstack');
    
    const course = await prisma.course.findFirst({
      where: { slug: 'desarrollo-web-fullstack' },
      select: { id: true, title: true, slug: true }
    });
    
    if (!course) {
      console.log('❌ Curso no encontrado');
      return;
    }
    console.log('✅ Curso encontrado:', course.title, 'ID:', course.id);

    // 3. Verificar inscripción
    console.log('\n3️⃣ Verificando inscripción...');
    
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: course.id
      },
      select: { id: true, enrolledAt: true, status: true, progressPercentage: true }
    });
    
    if (!enrollment) {
      console.log('❌ Usuario NO está inscrito en el curso');
      console.log('💡 Creando inscripción automática...');
      
      try {
        const newEnrollment = await prisma.enrollment.create({
          data: {
            userId: userId,
            courseId: course.id,
            enrolledAt: new Date(),
            status: 'ACTIVE',
            progressPercentage: 0
          }
        });
        console.log('✅ Inscripción creada exitosamente:', newEnrollment.id);
      } catch (error) {
        console.error('❌ Error creando inscripción:', error);
      }
    } else {
      console.log('✅ Usuario SÍ está inscrito:', enrollment);
    }

    // 4. Verificar progreso
    console.log('\n4️⃣ Verificando progreso...');
    
    const progress = await prisma.courseProgress.findFirst({
      where: {
        enrollment: {
          userId: userId,
          courseId: course.id
        }
      },
      include: {
        lessonProgress: true
      }
    });
    
    if (!progress) {
      console.log('❌ No hay progreso registrado');
    } else {
      console.log('✅ Progreso encontrado:', {
        currentLesson: progress.currentLesson,
        progressPercentage: progress.progressPercentage,
        status: progress.status,
        lessonProgressCount: progress.lessonProgress.length
      });
    }

    // 5. Listar todas las inscripciones del usuario
    console.log('\n5️⃣ Todas las inscripciones del usuario:');
    
    const allEnrollments = await prisma.enrollment.findMany({
      where: { userId: userId },
      include: {
        course: {
          select: { title: true, slug: true }
        }
      }
    });
    
    allEnrollments.forEach(enrollment => {
      console.log(`- ${enrollment.course.title} (${enrollment.course.slug}): ${enrollment.status}`);
    });

  } catch (error) {
    console.error('💥 Error en debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugEnrollmentIssue(); 