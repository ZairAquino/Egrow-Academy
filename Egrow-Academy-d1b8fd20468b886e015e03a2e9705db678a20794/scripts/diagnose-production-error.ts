#!/usr/bin/env tsx

/**
 * Script para diagnosticar errores de producción
 * Verifica la configuración completa para el checkout de Stripe
 */

import { config } from 'dotenv';
config();

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function diagnoseProdError() {
  console.log('🔍 Diagnosticando errores de producción en eGrow Academy...\n');

  // 1. Verificar variables de entorno críticas
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '🔧 VERIFICACIÓN DE VARIABLES DE ENTORNO');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const criticalVars = {
    'DATABASE_URL': process.env.DATABASE_URL,
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET,
    'RESEND_API_KEY': process.env.RESEND_API_KEY,
    'RESEND_FROM_EMAIL': process.env.RESEND_FROM_EMAIL, // ⚠️ CRÍTICA FALTANTE
    'JWT_SECRET': process.env.JWT_SECRET,
    'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
    'NEXT_PUBLIC_BASE_URL': process.env.NEXT_PUBLIC_BASE_URL,
  };

  let missingVars = [];
  let hasStripeVars = true;

  for (const [key, value] of Object.entries(criticalVars)) {
    if (!value) {
      log('red', `❌ ${key}: FALTANTE`);
      missingVars.push(key);
      if (key.includes('STRIPE')) hasStripeVars = false;
    } else {
      const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
      log('green', `✅ ${key}: ${displayValue}`);
    }
  }

  // 2. Análisis específico del error
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '🚨 ANÁLISIS DEL ERROR DE SUSCRIPCIÓN');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (missingVars.includes('RESEND_FROM_EMAIL')) {
    log('red', '🎯 PROBLEMA IDENTIFICADO:');
    log('red', '   Variable RESEND_FROM_EMAIL faltante');
    log('red', '   Esto causa errores en el checkout de Stripe');
    log('red', '   Solución: Agregar RESEND_FROM_EMAIL=noreply@egrowacademy.com');
  }

  // 3. Verificar configuración de Stripe
  if (hasStripeVars) {
    log('cyan', '\n🔄 Probando conexión con Stripe...');
    try {
      const stripe = await import('@/lib/stripe');
      const account = await stripe.stripe.accounts.retrieve();
      log('green', `✅ Stripe conectado: ${account.email} (${account.country})`);
      
      // Verificar productos
      const products = await stripe.stripe.products.list({ limit: 10 });
      log('green', `✅ Productos encontrados: ${products.data.length}`);
      
      products.data.forEach(product => {
        log('blue', `   - ${product.name} (${product.id})`);
      });
      
    } catch (error) {
      log('red', `❌ Error de Stripe: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  // 4. Soluciones recomendadas
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '🛠️  SOLUCIONES RECOMENDADAS');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (missingVars.length > 0) {
    log('yellow', '1. Agregar variables faltantes en Vercel:');
    log('white', '   → Ve a https://vercel.com/dashboard');
    log('white', '   → Selecciona tu proyecto eGrow Academy');
    log('white', '   → Settings → Environment Variables');
    log('white', '   → Agrega las variables faltantes:');
    
    missingVars.forEach(varName => {
      if (varName === 'RESEND_FROM_EMAIL') {
        log('white', `      ${varName}=noreply@egrowacademy.com`);
      } else {
        log('white', `      ${varName}=[valor-requerido]`);
      }
    });
  }

  log('yellow', '\n2. Hacer redeploy después de agregar variables:');
  log('white', '   vercel --prod');

  log('yellow', '\n3. Verificar logs de error en Vercel:');
  log('white', '   → Functions tab en el dashboard');
  log('white', '   → Buscar errores en /api/stripe/create-checkout-session');

  log('yellow', '\n4. Probar el flujo completo:');
  log('white', '   → Ir a https://egrowacademy.com/subscription');
  log('white', '   → Iniciar sesión como usuario válido');
  log('white', '   → Intentar seleccionar plan mensual');
  log('white', '   → Verificar redirección a Stripe');

  // 5. Resumen
  log('cyan', '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('cyan', '📊 RESUMEN DEL DIAGNÓSTICO');
  log('cyan', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (missingVars.length === 0) {
    log('green', '✅ Todas las variables están configuradas');
    log('green', '✅ El error puede ser temporal o relacionado con cache');
    log('white', '💡 Intenta hacer un hard refresh o limpiar cache del navegador');
  } else {
    log('red', `❌ ${missingVars.length} variable(s) faltante(s)`);
    log('red', '❌ Esto es la causa más probable del error');
    log('white', '💡 Configurar las variables faltantes debería resolver el problema');
  }

  log('cyan', '\n🎯 Próximo paso: Agregar RESEND_FROM_EMAIL y hacer redeploy');
  log('white', '\n📋 Documentación completa en: docs/VERCEL-ENV-SETUP.md');
}

// Ejecutar diagnóstico
diagnoseProdError().catch(console.error);