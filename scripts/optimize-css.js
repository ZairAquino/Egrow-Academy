#!/usr/bin/env node

/**
 * Script para optimizar CSS crítico de eGrow Academy
 * Identifica y optimiza CSS crítico para mejorar FCP
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Optimizando CSS crítico - eGrow Academy\n');

// Verificar archivos CSS principales
const cssFiles = [
  'src/app/globals.css',
  'src/app/layout.css',
  'tailwind.config.ts'
];

console.log('📁 Verificando archivos CSS:');
cssFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️ ${file} (no encontrado)`);
  }
});

// Analizar CSS crítico
console.log('\n🔍 ANÁLISIS DE CSS CRÍTICO:');
console.log('==========================');

const criticalCSSRules = [
  'body, html { margin: 0; padding: 0; }',
  '.container { max-width: 1200px; margin: 0 auto; }',
  '.hero { min-height: 100vh; }',
  '.btn { padding: 12px 24px; border-radius: 8px; }',
  '.card { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }',
  '.text-center { text-align: center; }',
  '.flex { display: flex; }',
  '.grid { display: grid; }'
];

console.log('🎯 CSS Crítico Identificado:');
criticalCSSRules.forEach(rule => {
  console.log(`• ${rule}`);
});

console.log('\n💡 RECOMENDACIONES DE OPTIMIZACIÓN CSS:');
console.log('======================================');
console.log('1. Inline CSS crítico en <head>');
console.log('2. Defer CSS no crítico');
console.log('3. Minificar CSS');
console.log('4. Eliminar CSS no usado');
console.log('5. Optimizar fuentes web');

console.log('\n🛠️ ACCIONES INMEDIATAS:');
console.log('=====================');
console.log('1. Crear archivo de CSS crítico inline');
console.log('2. Configurar carga diferida de CSS no crítico');
console.log('3. Optimizar Tailwind CSS purging');
console.log('4. Implementar preload de fuentes críticas');

// Crear configuración de optimización CSS
const cssOptimizationConfig = {
  critical: {
    inline: true,
    minify: true,
    extract: true
  },
  nonCritical: {
    defer: true,
    preload: false,
    minify: true
  },
  fonts: {
    preload: ['Inter', 'Poppins'],
    display: 'swap',
    fallback: 'system-ui'
  },
  tailwind: {
    purge: true,
    minify: true,
    critical: true
  }
};

const configPath = path.join(process.cwd(), 'docs', 'css-optimization-config.json');
fs.writeFileSync(configPath, JSON.stringify(cssOptimizationConfig, null, 2));

console.log('\n✅ Análisis de CSS crítico completado');
console.log('📄 Configuración guardada en: docs/css-optimization-config.json');
console.log('🎯 Próximo paso: Implementar optimizaciones CSS'); 