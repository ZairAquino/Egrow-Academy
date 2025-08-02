import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testButtonDetector() {
  try {
    console.log('🔘 PROBANDO DETECTOR DE BOTONES DE LECCIONES\n');

    console.log('📋 INSTRUCCIONES PARA PRUEBA MANUAL:');
    console.log('1. Ve a http://localhost:3000');
    console.log('2. Inicia sesión con cualquier usuario');
    console.log('3. Ve a cualquier curso (ej: /curso/monetiza-ia/contenido)');
    console.log('4. Abre la consola del navegador (F12)');
    console.log('5. Busca los logs del detector de botones:');
    console.log('   - "🔘 Inicializando detector de botones de lecciones..."');
    console.log('   - "✅ Detector de botones de lecciones inicializado completamente"');
    console.log('');

    console.log('🎯 MÉTODOS DE DETECCIÓN IMPLEMENTADOS:');
    console.log('   1. Event Delegation: Escucha todos los clicks en botones del documento');
    console.log('   2. Mutation Observer: Detecta nuevos botones cuando se agregan al DOM');
    console.log('   3. Interval Scanner: Busca botones cada 2 segundos');
    console.log('   4. Direct Listeners: Agrega listeners directos a botones encontrados');
    console.log('');

    console.log('🎮 PRUEBAS DISPONIBLES EN LA CONSOLA:');
    console.log('   • testButtonDetector() - Disparar test manual');
    console.log('   • triggerLessonCompleted() - Simular lección completada');
    console.log('');

    console.log('🔍 QUÉ BUSCAR AL HACER CLICK EN "✅ Marcar como completada":');
    console.log('   1. En la consola deberías ver:');
    console.log('      "🎯 [BUTTON-DETECTOR] Botón de completar detectado: ✅ marcar como completada"');
    console.log('      "🏆 [BUTTON-DETECTOR] Botón de lección completada clickeado!"');
    console.log('      "✅ [BUTTON-DETECTOR] Actualización de rachas disparada"');
    console.log('');
    console.log('   2. El dropdown del usuario debería actualizarse mostrando:');
    console.log('      "Lecciones: X/5" con el nuevo número');
    console.log('');
    console.log('   3. Deberían aparecer notificaciones motivacionales en la esquina superior derecha');
    console.log('');

    console.log('❗ IMPORTANTE:');
    console.log('   - El detector funciona con múltiples métodos simultáneos');
    console.log('   - Si un método falla, los otros deberían funcionar');
    console.log('   - Busca el texto "marcar como completada" o "✅" en los botones');
    console.log('   - La actualización sucede después de 1.5 segundos del click');
    console.log('');

    // Verificar que hay datos de prueba
    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count();
    
    console.log(`📊 DATOS DISPONIBLES PARA PRUEBA:`);
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   📚 Cursos: ${courseCount}`);
    
    if (userCount === 0 || courseCount === 0) {
      console.log('⚠️ ADVERTENCIA: Necesitas al menos 1 usuario y 1 curso para probar');
    } else {
      console.log('✅ Datos suficientes para prueba');
    }

    console.log('\n🚀 ¡PRUEBA EL DETECTOR COMPLETANDO UNA LECCIÓN REAL!');

  } catch (error) {
    console.error('❌ ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testButtonDetector();