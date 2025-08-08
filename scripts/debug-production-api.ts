async function debugProductionApi() {
  try {
    console.log('🔍 DEBUGGEANDO API DE PRODUCCIÓN...');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Probar el endpoint de producción
    const productionUrl = 'https://egrowacademy.com/api/courses';
    console.log('🌐 URL de producción:', productionUrl);
    
    const response = await fetch(productionUrl);
    console.log('📡 Status:', response.status);
    console.log('📡 OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n============================================================');
      console.log('📊 RESPUESTA DEL API DE PRODUCCIÓN:');
      console.log(`📚 Total cursos: ${data.total || 0}`);
      console.log(`📚 Cursos en array: ${data.courses?.length || 0}`);
      
      if (data.courses && data.courses.length > 0) {
        console.log('\n📖 LISTA DE CURSOS EN PRODUCCIÓN:');
        data.courses.forEach((course: any, index: number) => {
          console.log(`${index + 1}. ${course.title}`);
          console.log(`   🔗 Slug: ${course.slug}`);
          console.log(`   📊 Status: ${course.status}`);
          console.log(`   🆓 Gratis: ${course.isFree}`);
          console.log(`   🔒 Requiere Auth: ${course.requiresAuth}`);
          console.log(`   📂 Categoría: ${course.category}`);
          console.log(`   📅 Creado: ${course.createdAt}`);
          console.log('');
        });
        
        // Buscar específicamente el curso de monetiza voz
        const monetizaVozCourse = data.courses.find((course: any) => 
          course.slug === 'monetiza-voz-ia-elevenlabs'
        );
        
        if (monetizaVozCourse) {
          console.log('✅ CURSO MONETIZA VOZ ENCONTRADO EN API DE PRODUCCIÓN:');
          console.log(`📚 Título: ${monetizaVozCourse.title}`);
          console.log(`🔗 Slug: ${monetizaVozCourse.slug}`);
          console.log(`📊 Status: ${monetizaVozCourse.status}`);
          console.log(`💰 Precio: $${monetizaVozCourse.price}`);
        } else {
          console.log('❌ CURSO MONETIZA VOZ NO ENCONTRADO EN API DE PRODUCCIÓN');
          console.log('💡 Esto confirma que hay un problema con el deploy');
        }
      } else {
        console.log('⚠️ No se encontraron cursos en la respuesta de producción');
      }
      
      console.log('============================================================\n');
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta de producción:');
      console.log('Error text:', errorText);
    }
    
    // Comparar con desarrollo
    console.log('🔄 COMPARANDO CON DESARROLLO...');
    const developmentUrl = 'http://localhost:3000/api/courses';
    console.log('🌐 URL de desarrollo:', developmentUrl);
    
    try {
      const devResponse = await fetch(developmentUrl);
      if (devResponse.ok) {
        const devData = await devResponse.json();
        console.log(`📚 Cursos en desarrollo: ${devData.courses?.length || 0}`);
        
        const devMonetizaVoz = devData.courses?.find((course: any) => 
          course.slug === 'monetiza-voz-ia-elevenlabs'
        );
        
        if (devMonetizaVoz) {
          console.log('✅ CURSO ENCONTRADO EN DESARROLLO');
        } else {
          console.log('❌ CURSO NO ENCONTRADO EN DESARROLLO');
        }
      }
    } catch (devError) {
      console.log('⚠️ No se pudo conectar a desarrollo (servidor local no activo)');
    }
    
  } catch (error) {
    console.error('❌ Error al debuggear API de producción:', error);
  }
}

debugProductionApi();
