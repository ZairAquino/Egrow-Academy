import { execSync } from 'child_process';

async function configureVercelEnv() {
  try {
    console.log('🔧 Configurando variables de entorno en Vercel...\n');

    console.log('📋 Pasos para configurar STRIPE_WEBHOOK_SECRET:');
    console.log('');
    console.log('1️⃣ Obtén el webhook secret de Stripe:');
    console.log('   - Ve a https://dashboard.stripe.com/webhooks');
    console.log('   - Selecciona tu webhook');
    console.log('   - Copia el "Signing secret" (empieza con whsec_)');
    console.log('');
    console.log('2️⃣ Configura en Vercel:');
    console.log('   - Ve a https://vercel.com/dashboard');
    console.log('   - Selecciona tu proyecto "Egrow-Academy"');
    console.log('   - Ve a Settings > Environment Variables');
    console.log('   - Agrega: STRIPE_WEBHOOK_SECRET = whsec_tu_secret_aqui');
    console.log('');
    console.log('3️⃣ O usa Vercel CLI:');
    console.log('   vercel env add STRIPE_WEBHOOK_SECRET');
    console.log('');

    // Verificar configuración actual
    console.log('🔍 Verificando configuración actual...');
    
    try {
      const envOutput = execSync('vercel env ls', { encoding: 'utf8' });
      console.log('📋 Variables de entorno actuales:');
      console.log(envOutput);
    } catch (error) {
      console.log('⚠️  No se pudo obtener variables de entorno');
      console.log('   Asegúrate de estar logueado en Vercel CLI');
    }

    console.log('\n📝 Comandos útiles de Vercel CLI:');
    console.log('   vercel login                    # Loguearse en Vercel');
    console.log('   vercel env add                  # Agregar variable');
    console.log('   vercel env ls                   # Listar variables');
    console.log('   vercel env rm                   # Remover variable');
    console.log('   vercel --prod                   # Deploy a producción');
    console.log('');

    console.log('🎯 URL del webhook a configurar:');
    console.log('   https://egrow-academy-r3b1rqqh1-egrow.vercel.app/api/webhooks/stripe');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

configureVercelEnv()
  .then(() => {
    console.log('✅ Configuración completada!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  }); 