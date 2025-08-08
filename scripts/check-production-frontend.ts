async function checkProductionFrontend() {
  try {
    console.log('🌐 VERIFICANDO FRONTEND DE PRODUCCIÓN...');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Verificar la página principal de cursos
    const coursesPageUrl = 'https://egrowacademy.com/courses';
    console.log('🔍 Verificando:', coursesPageUrl);
    
    const response = await fetch(coursesPageUrl);
    console.log('📡 Status:', response.status);
    console.log('📡 OK:', response.ok);
    
    if (response.ok) {
      const html = await response.text();
      
      // Buscar el curso específico en el HTML
      const hasMonetizaVoz = html.includes('monetiza-voz-ia-elevenlabs');
      const hasMonetizaVozTitle = html.includes('Monetiza tu Voz con IA');
      
      console.log('\n============================================================');
      console.log('📊 RESULTADOS DE BÚSQUEDA EN FRONTEND:');
      console.log(`🔍 Incluye slug: ${hasMonetizaVoz ? '✅ SÍ' : '❌ NO'}`);
      console.log(`🔍 Incluye título: ${hasMonetizaVozTitle ? '✅ SÍ' : '❌ NO'}`);
      
      if (hasMonetizaVoz && hasMonetizaVozTitle) {
        console.log('✅ CURSO ENCONTRADO EN FRONTEND DE PRODUCCIÓN');
      } else {
        console.log('❌ CURSO NO ENCONTRADO EN FRONTEND DE PRODUCCIÓN');
        console.log('💡 Posibles causas:');
        console.log('   - Error en la conexión a la base de datos');
        console.log('   - Problema con variables de entorno');
        console.log('   - Error en el mapeo de cursos');
        console.log('   - Uso de cursos de fallback');
      }
      
      // Verificar si hay otros cursos
      const hasOtherCourses = html.includes('curso/');
      console.log(`📚 Otros cursos detectados: ${hasOtherCourses ? '✅ SÍ' : '❌ NO'}`);
      
      console.log('============================================================\n');
    } else {
      console.log('❌ Error al acceder a la página de cursos');
    }
    
    // Verificar directamente la página del curso
    const coursePageUrl = 'https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs';
    console.log('🔍 Verificando página del curso:', coursePageUrl);
    
    const courseResponse = await fetch(coursePageUrl);
    console.log('📡 Status del curso:', courseResponse.status);
    console.log('📡 OK del curso:', courseResponse.ok);
    
    if (courseResponse.ok) {
      console.log('✅ PÁGINA DEL CURSO ACCESIBLE');
    } else {
      console.log('❌ PÁGINA DEL CURSO NO ACCESIBLE');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar frontend:', error);
  }
}

checkProductionFrontend();
