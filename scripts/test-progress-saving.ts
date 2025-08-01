import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProgressSaving() {
  console.log('🧪 Probando guardado de progreso de lecciones...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar un usuario de prueba
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('⚠️  Usuario de prueba no encontrado, creando uno...');
      const newUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Usuario de Prueba',
          password: 'hashedpassword123',
          emailVerified: true
        }
      });
      console.log('✅ Usuario de prueba creado:', newUser.id);
    }

    // Buscar el curso de asistentes
    const course = await prisma.course.findUnique({
      where: { slug: 'asistentes-virtuales-ia' }
    });

    if (!course) {
      console.log('❌ Curso "Asistentes virtuales con IA" no encontrado');
      return;
    }

    console.log(`📋 Curso encontrado: "${course.title}"`);
    console.log(`📊 Lecciones en BD: ${course.lessonsCount}`);

    // Verificar inscripción del usuario
    let enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: testUser?.id || 'test-user-id',
        courseId: course.id
      }
    });

    if (!enrollment) {
      console.log('📝 Creando inscripción de prueba...');
      enrollment = await prisma.enrollment.create({
        data: {
          userId: testUser?.id || 'test-user-id',
          courseId: course.id,
          enrolledAt: new Date(),
          status: 'ACTIVE',
          progressPercentage: 0
        }
      });
      console.log('✅ Inscripción creada:', enrollment.id);
    } else {
      console.log('✅ Inscripción existente:', enrollment.id);
    }

    // Verificar progreso existente
    let progress = await prisma.courseProgress.findFirst({
      where: {
        enrollmentId: enrollment.id
      }
    });

    if (!progress) {
      console.log('📝 Creando progreso de prueba...');
      progress = await prisma.courseProgress.create({
        data: {
          enrollmentId: enrollment.id,
          currentLesson: 0,
          completedLessons: [],
          progressPercentage: 0,
          status: 'NOT_STARTED',
          startedAt: new Date(),
          lastAccessed: new Date(),
          totalTimeSpent: 0,
          totalSessions: 0,
          averageSessionTime: 0,
          longestSession: 0
        }
      });
      console.log('✅ Progreso creado:', progress.id);
    } else {
      console.log('✅ Progreso existente:', progress.id);
      console.log(`   - Lección actual: ${progress.currentLesson}`);
      console.log(`   - Lecciones completadas: ${progress.completedLessons.length}`);
      console.log(`   - Porcentaje: ${progress.progressPercentage}%`);
    }

    // Simular guardado de progreso
    console.log('\n🔄 Simulando guardado de progreso...');
    
    const updatedProgress = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: {
        currentLesson: 5, // Cambiar a lección 5
        completedLessons: [0, 1, 2, 3, 4], // Completar lecciones 0-4
        progressPercentage: Math.round((5 / course.lessonsCount) * 100),
        status: 'IN_PROGRESS',
        lastAccessed: new Date(),
        totalTimeSpent: progress.totalTimeSpent + 300, // +5 minutos
        totalSessions: progress.totalSessions + 1
      }
    });

    console.log('✅ Progreso actualizado:');
    console.log(`   - Lección actual: ${updatedProgress.currentLesson}`);
    console.log(`   - Lecciones completadas: ${updatedProgress.completedLessons.length}`);
    console.log(`   - Porcentaje: ${updatedProgress.progressPercentage}%`);
    console.log(`   - Estado: ${updatedProgress.status}`);

    // Verificar que se guardó correctamente
    const savedProgress = await prisma.courseProgress.findUnique({
      where: { id: progress.id }
    });

    if (savedProgress) {
      console.log('\n✅ Verificación exitosa:');
      console.log(`   - Lección actual guardada: ${savedProgress.currentLesson}`);
      console.log(`   - Lecciones completadas guardadas: ${savedProgress.completedLessons.length}`);
      console.log(`   - Porcentaje guardado: ${savedProgress.progressPercentage}%`);
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  testProgressSaving()
    .then(() => {
      console.log('\n🎉 Prueba completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { testProgressSaving }; 