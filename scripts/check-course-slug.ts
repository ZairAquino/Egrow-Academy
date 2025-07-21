import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndFixCourseSlug() {
  try {
    console.log('🔍 Verificando curso de LLMs...');
    
    // Buscar el curso por título
    const course = await prisma.course.findFirst({
      where: {
        title: {
          contains: 'Large Language Models'
        }
      }
    });

    if (!course) {
      console.log('❌ No se encontró el curso de LLMs');
      return;
    }

    console.log('📋 Curso encontrado:');
    console.log(`   ID: ${course.id}`);
    console.log(`   Título: ${course.title}`);
    console.log(`   Slug actual: ${course.slug}`);
    console.log(`   Slug esperado: introduccion-llms`);

    // Verificar si el slug es correcto
    if (course.slug !== 'introduccion-llms') {
      console.log('🔄 Actualizando slug...');
      
      await prisma.course.update({
        where: { id: course.id },
        data: { slug: 'introduccion-llms' }
      });

      console.log('✅ Slug actualizado correctamente');
    } else {
      console.log('✅ El slug ya es correcto');
    }

    // Verificar enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { user: true }
    });

    console.log(`📊 Enrollments encontrados: ${enrollments.length}`);
    
    enrollments.forEach((enrollment, index) => {
      console.log(`   ${index + 1}. Usuario: ${enrollment.user.firstName} ${enrollment.user.lastName}`);
      console.log(`      Estado: ${enrollment.status}`);
      console.log(`      Progreso: ${enrollment.progressPercentage}%`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixCourseSlug(); 