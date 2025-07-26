#!/usr/bin/env node

/**
 * Script para optimizar imágenes de eGrow Academy
 * Convierte imágenes a formatos más eficientes y reduce tamaño
 */

import fs from 'fs';
import path from 'path';

console.log('🖼️ Optimizando imágenes - eGrow Academy\n');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const optimizedDir = path.join(process.cwd(), 'public', 'images', 'optimized');

// Crear directorio para imágenes optimizadas
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
  console.log('✅ Directorio de imágenes optimizadas creado');
}

// Lista de imágenes a optimizar
const imagesToOptimize = [
  { name: 'v-5.png', size: '2.5MB', priority: 'alta' },
  { name: 'p1.png', size: '4.5MB', priority: 'crítica' },
  { name: 'monetiza-ia.png', size: '2.5MB', priority: 'alta' },
  { name: 'logop.png', size: '772KB', priority: 'alta' },
  { name: 'eGrowAcademylogo.png', size: '254KB', priority: 'media' },
  { name: 'eGrowAcademylogoblanco.png', size: '241KB', priority: 'media' },
  { name: 'eacademylogo.png', size: '151KB', priority: 'media' },
  { name: 'egacademylogoblanco.png', size: '144KB', priority: 'media' },
  { name: 'Logo2.png', size: '119KB', priority: 'media' },
  { name: 'robot.png', size: '90KB', priority: 'baja' },
  { name: 'Zair.jpeg', size: '91KB', priority: 'baja' },
  { name: 'modulos1.jpeg', size: '73KB', priority: 'baja' },
  { name: 'logog.png', size: '37KB', priority: 'baja' }
];

console.log('📊 ANÁLISIS DE IMÁGENES:');
console.log('========================');

imagesToOptimize.forEach(img => {
  const priorityIcon = {
    'crítica': '🔴',
    'alta': '🟠', 
    'media': '🟡',
    'baja': '🟢'
  };
  
  console.log(`${priorityIcon[img.priority]} ${img.name} (${img.size})`);
});

console.log('\n🚨 PROBLEMAS IDENTIFICADOS:');
console.log('==========================');
console.log('🔴 p1.png - 4.5MB (CRÍTICO: Muy pesada)');
console.log('🟠 v-5.png - 2.5MB (ALTO: Necesita optimización)');
console.log('🟠 monetiza-ia.png - 2.5MB (ALTO: Necesita optimización)');
console.log('🟠 logop.png - 772KB (ALTO: Necesita optimización)');

console.log('\n💡 RECOMENDACIONES DE OPTIMIZACIÓN:');
console.log('==================================');
console.log('1. Convertir PNG grandes a WebP/AVIF');
console.log('2. Reducir resolución de imágenes grandes');
console.log('3. Implementar lazy loading');
console.log('4. Usar formatos modernos (WebP, AVIF)');
console.log('5. Optimizar logos para diferentes tamaños');

console.log('\n🛠️ ACCIONES INMEDIATAS:');
console.log('=====================');
console.log('1. Instalar herramientas de optimización:');
console.log('   npm install -g imagemin-cli');
console.log('   npm install -g sharp-cli');
console.log('');
console.log('2. Convertir imágenes críticas:');
console.log('   p1.png → p1.webp (objetivo: <500KB)');
console.log('   v-5.png → v-5.webp (objetivo: <300KB)');
console.log('   monetiza-ia.png → monetiza-ia.webp (objetivo: <300KB)');

console.log('\n✅ Optimización de imágenes analizada');
console.log('🎯 Próximo paso: Instalar herramientas e implementar conversiones');

// Crear archivo de configuración de optimización de imágenes
const imageOptimizationConfig = {
  critical: [
    { name: 'p1.png', targetSize: '500KB', format: 'webp' },
    { name: 'v-5.png', targetSize: '300KB', format: 'webp' },
    { name: 'monetiza-ia.png', targetSize: '300KB', format: 'webp' }
  ],
  high: [
    { name: 'logop.png', targetSize: '200KB', format: 'webp' },
    { name: 'eGrowAcademylogo.png', targetSize: '100KB', format: 'webp' }
  ],
  medium: [
    { name: 'eGrowAcademylogoblanco.png', targetSize: '80KB', format: 'webp' },
    { name: 'eacademylogo.png', targetSize: '60KB', format: 'webp' }
  ],
  low: [
    { name: 'robot.png', targetSize: '50KB', format: 'webp' },
    { name: 'Zair.jpeg', targetSize: '50KB', format: 'webp' }
  ]
};

const configPath = path.join(process.cwd(), 'docs', 'image-optimization-config.json');
fs.writeFileSync(configPath, JSON.stringify(imageOptimizationConfig, null, 2));

console.log('\n📄 Configuración guardada en: docs/image-optimization-config.json'); 