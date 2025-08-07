import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeCoursePremium() {
  try {
    console.log('🔍 Haciendo curso premium...');
    
    // Actualizar el curso para que sea premium
    const updatedCourse = await prisma.course.update({
      where: { slug: 'vibe-coding-claude-cursor' },
      data: {
        isFree: false,
        price: 99.99
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

makeCoursePremium();
