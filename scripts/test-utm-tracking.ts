#!/usr/bin/env tsx

/**
 * Script de Prueba para Tracking UTM
 * 
 * Este script simula el uso de URLs UTM y verifica que el tracking funcione correctamente
 */

import { getAllCourseLaunchUrls } from '../src/lib/social-tracking';

console.log('🧪 Iniciando pruebas del sistema de tracking UTM...\n');

// Obtener todas las URLs UTM
const utmUrls = getAllCourseLaunchUrls();

console.log('📊 URLs UTM Generadas:');
console.log('========================');

Object.entries(utmUrls).forEach(([platform, contentTypes]) => {
  console.log(`\n📱 ${platform.toUpperCase()}:`);
  console.log('─'.repeat(platform.length + 3));
  
  Object.entries(contentTypes).forEach(([contentType, url]) => {
    const medium = platform === 'linkedin' || platform === 'google' ? 'CPC' : 'Paid Social';
    console.log(`  • ${contentType.replace('_', ' ')} (${medium}):`);
    console.log(`    ${url}`);
  });
});

console.log('\n🔍 Verificación de Parámetros UTM:');
console.log('==================================');

// Verificar que todas las URLs tengan los parámetros correctos
let totalUrls = 0;
let validUrls = 0;
let errors: string[] = [];

Object.entries(utmUrls).forEach(([platform, contentTypes]) => {
  Object.entries(contentTypes).forEach(([contentType, url]) => {
    totalUrls++;
    
    try {
      const urlObj = new URL(url, 'https://egrowacademy.com');
      const params = urlObj.searchParams;
      
      // Verificar parámetros obligatorios
      const utm_source = params.get('utm_source');
      const utm_medium = params.get('utm_medium');
      const utm_campaign = params.get('utm_campaign');
      
      if (!utm_source || !utm_medium || !utm_campaign) {
        errors.push(`${platform}/${contentType}: Faltan parámetros UTM obligatorios`);
        return;
      }
      
      // Verificar que utm_source coincida con la plataforma
      if (utm_source !== platform) {
        errors.push(`${platform}/${contentType}: utm_source incorrecto (${utm_source} vs ${platform})`);
        return;
      }
      
      // Verificar que utm_campaign sea correcto
      if (utm_campaign !== 'curso_lanzamiento_2025') {
        errors.push(`${platform}/${contentType}: utm_campaign incorrecto (${utm_campaign})`);
        return;
      }
      
      // Verificar que utm_medium sea correcto según la plataforma
      const expectedMedium = platform === 'linkedin' || platform === 'google' ? 'cpc' : 'paid_social';
      if (utm_medium !== expectedMedium) {
        errors.push(`${platform}/${contentType}: utm_medium incorrecto (${utm_medium} vs ${expectedMedium})`);
        return;
      }
      
      validUrls++;
      console.log(`  ✅ ${platform}/${contentType}: Parámetros UTM válidos`);
      
    } catch (error) {
      errors.push(`${platform}/${contentType}: Error al parsear URL (${error})`);
    }
  });
});

console.log(`\n📈 Resumen de Verificación:`);
console.log(`   Total URLs: ${totalUrls}`);
console.log(`   URLs válidas: ${validUrls}`);
console.log(`   Errores: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errores encontrados:');
  errors.forEach(error => console.log(`   • ${error}`));
} else {
  console.log('\n🎉 ¡Todas las URLs UTM son válidas!');
}

console.log('\n🚀 Instrucciones para Testing:');
console.log('==============================');
console.log('1. Copia una URL UTM del listado anterior');
console.log('2. Abre la URL en tu navegador');
console.log('3. Verifica que aparezca el panel de tracking UTM (esquina inferior derecha)');
console.log('4. Revisa la consola del navegador para ver eventos de tracking');
console.log('5. Verifica en Google Analytics 4 (Debug View) que lleguen los eventos');

console.log('\n🔧 URLs de Testing Recomendadas:');
console.log('=================================');
console.log('• LinkedIn CPC: Curso principal');
console.log('• Meta Paid Social: Landing page');
console.log('• Google CPC: Checkout');
console.log('• TikTok Paid Social: Cualquiera');

console.log('\n📱 Panel de Debug:');
console.log('===================');
console.log('• El panel UTM aparece automáticamente cuando hay parámetros UTM');
console.log('• Muestra todos los parámetros detectados en tiempo real');
console.log('• Incluye botón para copiar la URL actual con UTMs');

console.log('\n✨ Sistema listo para campaña de lanzamiento!');