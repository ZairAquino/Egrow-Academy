#!/usr/bin/env tsx

console.log('🔍 Verificando configuración de producción...\n');

// Verificar variables de entorno críticas
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY'
];

console.log('📋 Variables de entorno requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Ocultar valores sensibles
    const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
      ? `${value.substring(0, 10)}...` 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
  }
});

console.log('\n🔑 Verificación de claves Stripe:');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (stripeSecretKey) {
  if (stripeSecretKey.startsWith('sk_test_')) {
    console.log('⚠️  STRIPE_SECRET_KEY: Usando claves de TEST (desarrollo)');
  } else if (stripeSecretKey.startsWith('sk_live_')) {
    console.log('✅ STRIPE_SECRET_KEY: Usando claves de LIVE (producción)');
  } else {
    console.log('❌ STRIPE_SECRET_KEY: Formato de clave inválido');
  }
}

if (stripePublishableKey) {
  if (stripePublishableKey.startsWith('pk_test_')) {
    console.log('⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Usando claves de TEST (desarrollo)');
  } else if (stripePublishableKey.startsWith('pk_live_')) {
    console.log('✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Usando claves de LIVE (producción)');
  } else {
    console.log('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Formato de clave inválido');
  }
}

console.log('\n🌐 Verificación de dominio:');
const domain = process.env.NEXTAUTH_URL || 'No configurado';
console.log(`Dominio: ${domain}`);

console.log('\n📋 Checklist para producción:');
console.log('1. ✅ Variables de entorno configuradas en Vercel');
console.log('2. 🔄 Webhook de Stripe apunta al dominio de producción');
console.log('3. 🔑 Claves de Stripe LIVE configuradas');
console.log('4. 🗄️ Base de datos PostgreSQL conectada');
console.log('5. 📧 Resend configurado para emails');

console.log('\n🚨 Si hay problemas:');
console.log('- Verifica que las claves de Stripe sean LIVE, no TEST');
console.log('- Actualiza el webhook en Stripe Dashboard');
console.log('- Revisa los logs de Vercel para errores específicos'); 