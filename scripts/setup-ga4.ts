#!/usr/bin/env node

/**
 * Script para configurar Google Analytics 4 en eGrow Academy
 * 
 * Pasos para configurar GA4:
 * 1. Ir a https://analytics.google.com/
 * 2. Crear cuenta "eGrow Academy"
 * 3. Crear propiedad "eGrow Academy Website"
 * 4. Obtener ID de medición (G-XXXXXXXXXX)
 * 5. Configurar eventos personalizados
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Configuración de Google Analytics 4 para eGrow Academy\n');

console.log('📋 Pasos para configurar GA4:');
console.log('1. Ve a https://analytics.google.com/');
console.log('2. Crea una cuenta llamada "eGrow Academy"');
console.log('3. Crea una propiedad llamada "eGrow Academy Website"');
console.log('4. Selecciona "Web" como plataforma');
console.log('5. Configura la URL del sitio: https://egrow-academy.com');
console.log('6. Selecciona tu zona horaria: America/Mexico_City');
console.log('7. Selecciona tu moneda: MXN (Peso Mexicano)');
console.log('8. Obtén el ID de medición (formato: G-XXXXXXXXXX)\n');

console.log('📊 Eventos personalizados recomendados:');
console.log('- view_course: Cuando un usuario ve un curso');
console.log('- enroll_course: Cuando un usuario se inscribe');
console.log('- start_subscription: Cuando un usuario inicia suscripción');
console.log('- view_resource: Cuando un usuario ve un recurso');
console.log('- register_user: Cuando un usuario se registra');
console.log('- contact_form: Cuando se envía formulario de contacto\n');

console.log('🔧 Configuración de variables de entorno:');
console.log('Una vez que tengas el ID de medición, agrega estas variables a tu archivo .env.local:\n');

const envExample = `# Google Analytics 4
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Google Tag Manager (opcional)
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
GOOGLE_TAG_MANAGER_ID="GTM-XXXXXXX"

# Facebook Pixel (opcional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID="XXXXXXXXXX"
FACEBOOK_PIXEL_ID="XXXXXXXXXX"

# Hotjar (opcional)
NEXT_PUBLIC_HOTJAR_ID="XXXXXXXXXX"
HOTJAR_ID="XXXXXXXXXX"`;

console.log(envExample);
console.log('\n📝 Notas importantes:');
console.log('- Reemplaza G-XXXXXXXXXX con tu ID real de GA4');
console.log('- El archivo .env.local debe estar en la raíz del proyecto');
console.log('- No subas el archivo .env.local a Git (ya está en .gitignore)');
console.log('- Después de configurar, ejecuta: npm run test-ga4\n');

console.log('✅ Una vez configurado, podrás:');
console.log('- Ver métricas de tráfico en tiempo real');
console.log('- Trackear conversiones de cursos');
console.log('- Analizar comportamiento de usuarios');
console.log('- Medir Core Web Vitals');
console.log('- Optimizar SEO basado en datos');

// Verificar si existe archivo .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('\n📁 Archivo .env.local encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('GA_ID')) {
    console.log('✅ Variables de GA4 ya configuradas');
  } else {
    console.log('⚠️  Variables de GA4 no encontradas');
  }
} else {
  console.log('\n📁 Archivo .env.local no encontrado');
  console.log('💡 Crea el archivo .env.local en la raíz del proyecto');
}

console.log('\n🎯 Próximo paso: Configurar GA4 y agregar variables de entorno'); 