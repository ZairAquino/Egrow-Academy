import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function testCronEndpoint() {
  console.log('🧪 Probando endpoint de cron manualmente\n');
  console.log('Simulando llamada de Vercel Cron...');
  
  const CRON_SECRET = process.env.CRON_SECRET;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://egrowacademy.com';
  
  console.log('CRON_SECRET:', CRON_SECRET ? 'Configurada' : 'NO CONFIGURADA');
  console.log('BASE_URL:', BASE_URL);
  
  try {
    const response = await fetch(`${BASE_URL}/api/cron/webinar-reminders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Cron/1.0'
      }
    });
    
    console.log('\n📡 Respuesta del endpoint:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);
    
    if (response.ok) {
      try {
        const json = JSON.parse(responseText);
        console.log('\n✅ Respuesta JSON:', JSON.stringify(json, null, 2));
      } catch (e) {
        console.log('⚠️ Respuesta no es JSON válido');
      }
    } else {
      console.log('❌ Error en la respuesta:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.log('🔐 Error de autenticación - CRON_SECRET podría estar mal configurado en Vercel');
      }
    }
    
  } catch (error) {
    console.error('❌ Error haciendo la petición:', error);
  }
}

testCronEndpoint().catch(console.error);