import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRatings() {
  try {
    console.log('🌱 Iniciando seed de valoraciones...');

    // Obtener algunos usuarios y cursos existentes
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true }
    });

    const courses = await prisma.course.findMany({
      take: 3,
      select: { id: true }
    });

    const posts = await prisma.communityPost.findMany({
      take: 3,
      select: { id: true }
    });

    if (users.length === 0) {
      console.log('❌ No hay usuarios para crear valoraciones');
      return;
    }

    // Crear valoraciones de prueba para cursos
    for (const course of courses) {
      for (let i = 0; i < Math.min(users.length, 3); i++) {
        const rating = Math.floor(Math.random() * 3) + 3; // 3-5 estrellas
        await prisma.rating.create({
          data: {
            rating,
            comment: `Excelente curso, muy útil para aprender ${rating >= 4 ? 'y aplicar' : 'los conceptos básicos'}.`,
            type: 'COURSE_COMPLETION',
            userId: users[i].id,
            courseId: course.id
          }
        });
      }
    }

    // Crear valoraciones de prueba para posts de la comunidad
    for (const post of posts) {
      for (let i = 0; i < Math.min(users.length, 2); i++) {
        const rating = Math.floor(Math.random() * 3) + 3; // 3-5 estrellas
        await prisma.rating.create({
          data: {
            rating,
            comment: `Muy buen post, ${rating >= 4 ? 'muy informativo' : 'interesante'}.`,
            type: 'COMMUNITY_POST',
            userId: users[i].id,
            postId: post.id
          }
        });
      }
    }

    // Crear valoraciones de prueba para comentarios de cursos
    for (const course of courses) {
      for (let i = 0; i < Math.min(users.length, 2); i++) {
        const rating = Math.floor(Math.random() * 3) + 3; // 3-5 estrellas
        await prisma.rating.create({
          data: {
            rating,
            comment: `Comentario muy útil, ${rating >= 4 ? 'excelente explicación' : 'buena aportación'}.`,
            type: 'COURSE_COMMENT',
            userId: users[i].id,
            courseId: course.id
          }
        });
      }
    }

    console.log('✅ Seed de valoraciones completado exitosamente');
    
    // Mostrar estadísticas
    const totalRatings = await prisma.rating.count();
    const courseRatings = await prisma.rating.count({
      where: { type: 'COURSE_COMPLETION' }
    });
    const communityRatings = await prisma.rating.count({
      where: { type: 'COMMUNITY_POST' }
    });
    const commentRatings = await prisma.rating.count({
      where: { type: 'COURSE_COMMENT' }
    });

    console.log('📊 Estadísticas de valoraciones:');
    console.log(`- Total: ${totalRatings}`);
    console.log(`- Cursos: ${courseRatings}`);
    console.log(`- Posts: ${communityRatings}`);
    console.log(`- Comentarios: ${commentRatings}`);

  } catch (error) {
    console.error('❌ Error en seed de valoraciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRatings(); 