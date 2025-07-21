import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCourses() {
  try {
    console.log('🔍 Verificando cursos en la base de datos...\n');

    // Obtener todos los cursos
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        status: true,
        isFree: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📚 Total de cursos encontrados: ${courses.length}\n`);

    if (courses.length === 0) {
      console.log('❌ No hay cursos en la base de datos');
      return;
    }

    console.log('📋 Lista de cursos:');
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ID: ${course.id}`);
      console.log(`   Título: ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Dificultad: ${course.difficulty || 'No especificada'}`);
      console.log(`   Estado: ${course.status}`);
      console.log(`   Gratuito: ${course.isFree ? 'SÍ' : 'NO'}`);
      console.log(`   Creado: ${course.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Buscar específicamente el curso desarrollo-web-fullstack
    const fullstackCourse = await prisma.course.findUnique({
      where: {
        slug: 'desarrollo-web-fullstack'
      }
    });

    if (fullstackCourse) {
      console.log('✅ Curso "desarrollo-web-fullstack" encontrado:');
      console.log(`   ID: ${fullstackCourse.id}`);
      console.log(`   Título: ${fullstackCourse.title}`);
      console.log(`   Slug: ${fullstackCourse.slug}`);
    } else {
      console.log('❌ Curso "desarrollo-web-fullstack" NO encontrado');
      console.log('   Necesitamos crear este curso');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
checkCourses()
  .then(() => {
    console.log('✅ Verificación completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 