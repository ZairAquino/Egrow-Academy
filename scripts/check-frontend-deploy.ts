async function checkFrontendDeploy() {
  try {
    console.log('🔍 VERIFICANDO DEPLOY DEL FRONTEND...');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Verificar la página principal de cursos
    const coursesPageUrl = 'https://egrowacademy.com/courses';
    console.log('🌐 Verificando:', coursesPageUrl);
    
    const response = await fetch(coursesPageUrl);
    console.log('📡 Status:', response.status);
    console.log('📡 OK:', response.ok);
    
    if (response.ok) {
      const html = await response.text();
      
      // Buscar indicadores de que el frontend está funcionando correctamente
      const hasReactApp = html.includes('__NEXT_DATA__');
      const hasCoursesContent = html.includes('courses');
      const hasMonetizaVoz = html.includes('monetiza-voz-ia-elevenlabs');
      const hasMonetizaVozTitle = html.includes('Monetiza tu Voz con IA');
      
      console.log('\n============================================================');
      console.log('📊 ANÁLISIS DEL FRONTEND:');
      console.log(`🔧 React App detectado: ${hasReactApp ? '✅ SÍ' : '❌ NO'}`);
      console.log(`📚 Contenido de cursos detectado: ${hasCoursesContent ? '✅ SÍ' : '❌ NO'}`);
      console.log(`🔍 Incluye slug: ${hasMonetizaVoz ? '✅ SÍ' : '❌ NO'}`);
      console.log(`🔍 Incluye título: ${hasMonetizaVozTitle ? '✅ SÍ' : '❌ NO'}`);
      
      if (hasMonetizaVoz && hasMonetizaVozTitle) {
        console.log('✅ CURSO ENCONTRADO EN FRONTEND');
      } else {
        console.log('❌ CURSO NO ENCONTRADO EN FRONTEND');
        console.log('💡 Posibles causas:');
        console.log('   - Deploy desactualizado');
        console.log('   - Problema de caché');
        console.log('   - Error en el componente');
        console.log('   - Uso de cursos de fallback');
      }
      
      // Verificar si hay otros cursos
      const hasOtherCourses = html.includes('curso/');
      console.log(`📚 Otros cursos detectados: ${hasOtherCourses ? '✅ SÍ' : '❌ NO'}`);
      
      // Verificar si hay errores de JavaScript
      const hasErrors = html.includes('error') || html.includes('Error');
      console.log(`⚠️ Errores detectados: ${hasErrors ? '❌ SÍ' : '✅ NO'}`);
      
      console.log('============================================================\n');
      
      // Verificar la página específica del curso
      console.log('🔍 VERIFICANDO PÁGINA ESPECÍFICA DEL CURSO...');
      const coursePageUrl = 'https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs';
      
      try {
        const courseResponse = await fetch(coursePageUrl);
        console.log('📡 Status del curso:', courseResponse.status);
        console.log('📡 OK del curso:', courseResponse.ok);
        
        if (courseResponse.ok) {
          console.log('✅ PÁGINA DEL CURSO ACCESIBLE');
        } else {
          console.log('❌ PÁGINA DEL CURSO NO ACCESIBLE');
          console.log('💡 Esto indica un problema con el routing');
        }
      } catch (courseError) {
        console.log('❌ Error al acceder a la página del curso:', courseError);
      }
      
    } else {
      console.log('❌ Error al acceder a la página de cursos');
    }
    
    // Verificar si hay algún problema con el caché
    console.log('\n🔄 VERIFICANDO CACHÉ...');
    console.log('💡 Si el problema es de caché, espera 1-2 minutos y verifica nuevamente');
    console.log('💡 También puedes intentar hacer un nuevo deploy');
    
  } catch (error) {
    console.error('❌ Error al verificar frontend:', error);
  }
}

checkFrontendDeploy();
