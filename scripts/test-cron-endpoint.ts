// Script para probar el endpoint de cron localmente
async function testCronEndpoint() {
  try {
    console.log('🧪 Probando endpoint de cron de recordatorios...\n');

    // URL del endpoint local
    const url = 'http://localhost:3000/api/cron/webinar-reminders';
    
    // Probar con método POST (solo funciona en desarrollo)
    console.log('📡 Enviando petición POST de prueba...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:', JSON.stringify(data, null, 2));
      
      if (data.results && data.results.length > 0) {
        console.log('\n📧 Resumen de emails enviados:');
        data.results.forEach((result: any) => {
          console.log(`  - ${result.webinar}: ${result.success} enviados, ${result.failed} fallidos`);
        });
      } else {
        console.log('\n📭 No hay webinars próximos para enviar recordatorios');
      }
    } else {
      console.error('❌ Error en la respuesta:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Detalles:', errorData);
    }

    console.log('\n💡 Nota: Este endpoint POST solo funciona en desarrollo.');
    console.log('💡 En producción, Vercel ejecutará el endpoint GET cada minuto automáticamente.');
    
  } catch (error) {
    console.error('❌ Error al probar el endpoint:', error);
  }
}

// Ejecutar la prueba
testCronEndpoint();