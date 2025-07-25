// Script para probar la API de recursos
async function testResourcesAPI() {
  try {
    console.log('🔍 [TEST-API] Probando la API de recursos...');
    
    const response = await fetch('http://localhost:3000/api/resources');
    console.log(`📡 [TEST-API] Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ [TEST-API] Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log('❌ [TEST-API] Error en respuesta:');
      console.log(text);
    }
  } catch (error) {
    console.error('❌ [TEST-API] Error de conexión:', error);
  }
}

testResourcesAPI();