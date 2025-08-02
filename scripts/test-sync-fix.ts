import { PrismaClient } from '@prisma/client';
import { recordLessonCompletion } from '../src/lib/streaks';

const prisma = new PrismaClient();

async function testSyncFix() {
  try {
    console.log('🧪 PROBANDO FIX DE SINCRONIZACIÓN\n');

    // Obtener usuario y curso de prueba
    const testUser = await prisma.user.findFirst();
    const testCourse = await prisma.course.findFirst();
    
    if (!testUser || !testCourse) {
      throw new Error('No se encontró usuario o curso de prueba');
    }

    console.log(`👤 Usuario: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`📚 Curso: ${testCourse.title}\n`);

    // Simular completar una lección directamente
    console.log('🎯 Simulando completar lección...');
    const result = await recordLessonCompletion(
      testUser.id, 
      testCourse.id, 
      99, 
      'Lección de Prueba Sincronización'
    );

    console.log('✅ Resultado:', result);
    console.log('\n💡 INSTRUCCIONES:');
    console.log('1. Ve a http://localhost:3000');
    console.log('2. Inicia sesión');
    console.log('3. Abre la consola del navegador');
    console.log('4. Ejecuta: triggerLessonCompleted()');
    console.log('5. Deberías ver el dropdown actualizarse automáticamente');
    console.log('6. También deberían aparecer notificaciones\n');

    console.log('🎮 PARA PROBAR REALMENTE:');
    console.log('1. Ve a cualquier curso');
    console.log('2. Completa una lección real');
    console.log('3. Observa si el dropdown se actualiza automáticamente');

  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSyncFix();