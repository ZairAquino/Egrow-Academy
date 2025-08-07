import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeCourseFree() {
  try {
    console.log('🔍 Haciendo curso gratuito...');
    
    // Actualizar el curso para que sea gratuito
    const updatedCourse = await prisma.course.update({
      where: { slug: 'vibe-coding-claude-cursor' },
      data: {
        isFree: true,
        price: 0
      }
    });

    console.log('✅ Curso actualizado:', {
      id: updatedCourse.id,
      title: updatedCourse.title,
      slug: updatedCourse.slug,
      isFree: updatedCourse.isFree,
      price: updatedCourse.price
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeCourseFree();
