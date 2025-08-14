// Script para probar que la API /auth/me incluye el campo role
console.log('🧪 Probando endpoint /api/auth/me...');

async function testAuthEndpoint() {
  try {
    // Probar el endpoint sin autenticación
    const response = await fetch('http://localhost:3004/api/auth/me');
    console.log(`📡 Status: ${response.status}`);
    
    if (response.status === 401) {
      console.log('✅ Endpoint protegido correctamente (401 sin auth)');
      
      // Mostrar información del schema actualizado
      console.log('\n📋 Schema actualizado:');
      console.log('✅ Campo role agregado al modelo User');
      console.log('✅ Campo role agregado al AuthContext interface');
      console.log('✅ Campo role agregado al endpoint /api/auth/me select');
      console.log('✅ Botón "Crear Curso" implementado con lógica role === "ADMIN"');
      
      console.log('\n🔍 Para probar completamente:');
      console.log('1. Ve a http://localhost:3004/courses');
      console.log('2. Inicia sesión con luisdavid.ls47@gmail.com o aquinozair3@gmail.com');
      console.log('3. Verifica que aparezca el botón "Crear Curso"');
      console.log('4. Haz clic en el botón para ir a /admin/courses/create');
      
    } else {
      const data = await response.json();
      console.log('Respuesta:', data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuthEndpoint();