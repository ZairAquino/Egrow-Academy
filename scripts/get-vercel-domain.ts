import { execSync } from 'child_process';

async function getVercelDomain() {
  try {
    console.log('🔍 Obteniendo información del dominio de Vercel...\n');

    // Intentar obtener el dominio desde Vercel CLI
    try {
      const output = execSync('vercel ls', { encoding: 'utf8' });
      console.log('📋 Proyectos de Vercel:');
      console.log(output);
    } catch (error) {
      console.log('⚠️  No se pudo obtener información de Vercel CLI');
      console.log('   Asegúrate de tener Vercel CLI instalado: npm i -g vercel');
    }

    console.log('\n🔗 URLs comunes para webhooks:');
    console.log('');
    console.log('Si tu proyecto se llama "egrow-academy":');
    console.log('   https://egrow-academy.vercel.app/api/webhooks/stripe');
    console.log('');
    console.log('Si tienes un dominio personalizado:');
    console.log('   https://tu-dominio.com/api/webhooks/stripe');
    console.log('');
    console.log('Para desarrollo local (solo pruebas):');
    console.log('   https://tu-ip-publica.ngrok.io/api/webhooks/stripe');
    console.log('   (Usa ngrok para exponer localhost)');
    console.log('');

    console.log('📝 Pasos para encontrar tu dominio:');
    console.log('1. Ve a https://vercel.com/dashboard');
    console.log('2. Selecciona tu proyecto "Egrow-Academy"');
    console.log('3. En la pestaña "Domains", verás tu URL');
    console.log('4. Usa esa URL + /api/webhooks/stripe');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getVercelDomain()
  .then(() => {
    console.log('✅ Información obtenida!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 