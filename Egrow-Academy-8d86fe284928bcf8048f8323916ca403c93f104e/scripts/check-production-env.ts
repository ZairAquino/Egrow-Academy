import 'dotenv/config';

async function checkProductionEnvironment() {
  console.log('🔍 Verificando variables de entorno para producción...\n');

  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'DATABASE_URL',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'UPLOADTHING_SECRET',
    'UPLOADTHING_APP_ID'
  ];

  const optionalVars = [
    'NEXT_PUBLIC_BASE_URL'
  ];

  console.log('📋 Variables requeridas:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  let allRequiredPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Configurada`);
      if (varName.includes('SECRET') || varName.includes('KEY')) {
        console.log(`   Valor: ${value.substring(0, 12)}...`);
      } else {
        console.log(`   Valor: ${value}`);
      }
    } else {
      console.log(`❌ ${varName}: NO CONFIGURADA`);
      allRequiredPresent = false;
    }
    console.log('');
  });

  console.log('📋 Variables opcionales:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  optionalVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value}`);
    } else {
      console.log(`⚠️  ${varName}: No configurada (usará valor por defecto)`);
    }
  });

  console.log('\n🎯 Configuración de Stripe:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const isLive = stripeKey.startsWith('sk_live_');
    console.log(`✅ Modo: ${isLive ? 'LIVE (Producción)' : 'TEST'}`);
    console.log(`✅ Secret Key: ${stripeKey.substring(0, 12)}...`);
  } else {
    console.log('❌ STRIPE_SECRET_KEY no configurada');
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (publishableKey) {
    const isLive = publishableKey.startsWith('pk_live_');
    console.log(`✅ Publishable Key: ${publishableKey.substring(0, 12)}...`);
    console.log(`✅ Modo: ${isLive ? 'LIVE (Producción)' : 'TEST'}`);
  } else {
    console.log('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada');
  }

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log(`✅ Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 12)}...`);
  } else {
    console.log('❌ STRIPE_WEBHOOK_SECRET no configurada');
  }

  console.log('\n🌐 Configuración de URLs:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://egrowacademy.com';
  console.log(`✅ Base URL: ${baseUrl}`);
  console.log(`✅ Success URL: ${baseUrl}/payment/success`);
  console.log(`✅ Cancel URL: ${baseUrl}/subscription`);

  console.log('\n📊 Resumen:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (allRequiredPresent) {
    console.log('✅ Todas las variables requeridas están configuradas');
    console.log('✅ La aplicación debería funcionar correctamente en producción');
  } else {
    console.log('❌ Faltan variables requeridas');
    console.log('💡 Configura las variables faltantes en Vercel Dashboard');
  }

  console.log('\n🔧 Para configurar en Vercel:');
  console.log('1. Ve a https://vercel.com/dashboard');
  console.log('2. Selecciona tu proyecto eGrow Academy');
  console.log('3. Ve a Settings → Environment Variables');
  console.log('4. Agrega las variables faltantes');
  console.log('5. Haz redeploy del proyecto');
}

checkProductionEnvironment(); 