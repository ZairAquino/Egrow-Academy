async function testFrontendApi() {
  try {
    console.log('🧪 SIMULANDO FRONTEND API CALL...');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Simular exactamente lo que hace el frontend
    const response = await fetch('https://egrowacademy.com/api/courses');
    console.log('📡 Status:', response.status);
    console.log('📡 OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Datos de cursos:', data.courses?.length || 0);
      
      // Simular el mapeo que hace el frontend
      const formattedCourses = (data.courses || []).map((course: any) => {
        console.log('🔄 Procesando curso:', course.title, 'Slug:', course.slug);
        return {
          id: course.id,
          title: course.title,
          description: course.description || '',
          category: course.category || 'OTRO',
          duration: course.durationHours ? `${course.durationHours} horas` : 'N/A',
          level: course.difficulty || 'N/A',
          price: course.isFree ? 'Gratis' : 'Premium',
          image: course.imageUrl || '/images/courses/default.jpg',
          tag: course.isFree ? 'Gratis' : 'Premium',
          isFree: course.isFree || false,
          requiresAuth: course.requiresAuth || true,
          link: `/curso/${course.slug}`
        };
      });
      
      console.log('📋 Cursos formateados:', formattedCourses.length);
      console.log('📋 Lista de cursos formateados:', formattedCourses.map(c => ({ title: c.title, slug: c.link })));
      
      // Buscar específicamente el curso de monetiza voz
      const monetizaVozCourse = formattedCourses.find(course => 
        course.link === '/curso/monetiza-voz-ia-elevenlabs'
      );
      
      if (monetizaVozCourse) {
        console.log('\n✅ CURSO MONETIZA VOZ ENCONTRADO EN FRONTEND:');
        console.log(`📚 Título: ${monetizaVozCourse.title}`);
        console.log(`🔗 Link: ${monetizaVozCourse.link}`);
        console.log(`📂 Categoría: ${monetizaVozCourse.category}`);
        console.log(`💰 Precio: ${monetizaVozCourse.price}`);
        console.log(`🆓 Gratis: ${monetizaVozCourse.isFree}`);
      } else {
        console.log('\n❌ CURSO MONETIZA VOZ NO ENCONTRADO EN FRONTEND');
        console.log('💡 Esto explica por qué no aparece en la página web');
      }
      
      // Verificar si hay suficientes cursos para evitar fallback
      if (formattedCourses.length > 0) {
        console.log('\n✅ Hay suficientes cursos para evitar fallback');
      } else {
        console.log('\n⚠️ No hay cursos, se usaría fallback');
      }
      
    } else {
      console.log('❌ Error en la respuesta');
    }
    
  } catch (error) {
    console.error('❌ Error al simular frontend:', error);
  }
}

testFrontendApi();
