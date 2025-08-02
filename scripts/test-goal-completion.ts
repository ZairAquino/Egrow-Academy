import { PrismaClient } from '@prisma/client';
import { recordLessonCompletion } from '../src/lib/streaks';

const prisma = new PrismaClient();

async function testGoalCompletion() {
  try {
    const user = await prisma.user.findFirst();
    const course = await prisma.course.findFirst();
    
    if (!user || !course) {
      throw new Error('No user or course found');
    }
    
    console.log('🎯 Completando lección 5 para activar la racha...');
    const result = await recordLessonCompletion(user.id, course.id, 5, 'Lección 5 - Meta Semanal Completada');
    
    console.log('✅ Resultado:', result);
    
    if (result.goalMet) {
      console.log('🎉 ¡META SEMANAL COMPLETADA!');
      console.log('🔥 Racha actual:', result.currentStreak, 'semanas');
      console.log('💰 Puntos ganados: 10 puntos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testGoalCompletion();