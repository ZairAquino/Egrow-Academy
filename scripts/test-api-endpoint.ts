async function testApiEndpoint() {
  try {
    console.log('🧪 PROBANDO ENDPOINT /api/courses...');
    console.log('🌐 URL:', 'http://localhost:3000/api/courses');
    console.log('📅 Fecha:', new Date().toISOString());
    
    const response = await fetch('http://localhost:3000/api/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('\n============================================================');
    console.log('📊 RESPUESTA DEL ENDPOINT:');
    console.log(`📡 Status: ${response.status}`);
    console.log(`📡 OK: ${response.ok}`);
    console.log(`📡 Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📚 Cursos encontrados: ${data.courses?.length || 0}`);
      console.log(`📊 Total: ${data.total || 0}`);
      
      if (data.courses && data.courses.length > 0) {
        console.log('\n📖 LISTA DE CURSOS:');
        data.courses.forEach((course: any, index: number) => {
          console.log(`${index + 1}. ${course.title}`);
          console.log(`   🔗 Slug: ${course.slug}`);
          console.log(`   📊 Status: ${course.status}`);
          console.log(`   🆓 Gratis: ${course.isFree}`);
          console.log(`   🔒 Requiere Auth: ${course.requiresAuth}`);
          console.log(`   📂 Categoría: ${course.category}`);
          console.log('');
        });
        
        // Buscar específicamente el curso de monetiza voz
        const monetizaVozCourse = data.courses.find((course: any) => 
          course.slug === 'monetiza-voz-ia-elevenlabs'
        );
        
        if (monetizaVozCourse) {
          console.log('✅ CURSO MONETIZA VOZ ENCONTRADO EN API:');
          console.log(`📚 Título: ${monetizaVozCourse.title}`);
          console.log(`🔗 Slug: ${monetizaVozCourse.slug}`);
          console.log(`📊 Status: ${monetizaVozCourse.status}`);
          console.log(`💰 Precio: $${monetizaVozCourse.price}`);
        } else {
          console.log('❌ CURSO MONETIZA VOZ NO ENCONTRADO EN API');
        }
      } else {
        console.log('⚠️ No se encontraron cursos en la respuesta');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta:');
      console.log('Error text:', errorText);
    }
    
    console.log('============================================================\n');
    
  } catch (error) {
    console.error('❌ Error al probar endpoint:', error);
  }
}

testApiEndpoint();
