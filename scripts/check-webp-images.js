#!/usr/bin/env node

/**
 * Script para verificar que las imágenes WebP estén disponibles en producción
 */

import https from 'https';

const domain = 'https://egrowacademy.com';
const webpImages = [
  '/images/optimized/p1.webp',
  '/images/optimized/v-5.webp',
  '/images/optimized/monetiza-ia.webp',
  '/images/optimized/logop.webp'
];

function checkImage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      const status = res.statusCode;
      const contentType = res.headers['content-type'];
      const contentLength = res.headers['content-length'];
      
      resolve({
        url,
        status,
        contentType,
        contentLength,
        available: status === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message,
        available: false
      });
    });
  });
}

async function checkAllImages() {
  console.log('🔍 Verificando imágenes WebP en producción...\n');
  
  const results = await Promise.all(
    webpImages.map(img => checkImage(domain + img))
  );
  
  console.log('📊 RESULTADOS:');
  console.log('==============');
  
  let allAvailable = true;
  
  results.forEach(result => {
    const status = result.available ? '✅' : '❌';
    const size = result.contentLength ? `(${(result.contentLength / 1024).toFixed(1)}KB)` : '';
    
    console.log(`${status} ${result.url} - ${result.status} ${size}`);
    
    if (!result.available) {
      allAvailable = false;
    }
  });
  
  console.log('\n📈 ANÁLISIS:');
  console.log('=============');
  
  if (allAvailable) {
    console.log('🎉 ¡Todas las imágenes WebP están disponibles!');
    console.log('💡 Las optimizaciones deberían mejorar significativamente el LCP');
  } else {
    console.log('⚠️ Algunas imágenes WebP no están disponibles');
    console.log('💡 Esto puede indicar que:');
    console.log('   - El deploy aún está en progreso');
    console.log('   - Las rutas no son correctas');
    console.log('   - Vercel no está configurado para WebP');
  }
  
  return allAvailable;
}

// Ejecutar verificación
checkAllImages().then(available => {
  if (available) {
    console.log('\n🚀 Próximo paso: Ejecutar nueva medición de Core Web Vitals');
  } else {
    console.log('\n⏳ Esperar a que el deploy se complete y verificar nuevamente');
  }
}); 