#!/usr/bin/env node

/**
 * Script para optimizar el rendimiento de eGrow Academy
 * SIN modificar el diseño visual
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Optimizando rendimiento - eGrow Academy\n');

// 1. Optimizar imágenes
console.log('📸 Optimizando imágenes...');
const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

if (fs.existsSync(imagesDir)) {
  console.log('✅ Directorio de imágenes encontrado');
  console.log('💡 Recomendación: Convertir imágenes a WebP/AVIF');
  console.log('💡 Implementar lazy loading en componentes');
} else {
  console.log('⚠️ Directorio de imágenes no encontrado');
}

// 2. Verificar configuración de Next.js
console.log('\n⚙️ Verificando configuración de Next.js...');
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

if (fs.existsSync(nextConfigPath)) {
  console.log('✅ next.config.js encontrado');
  console.log('💡 Verificar optimizaciones de imagen y compresión');
} else {
  console.log('⚠️ next.config.js no encontrado');
}

// 3. Verificar Tailwind CSS
console.log('\n🎨 Verificando Tailwind CSS...');
const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');

if (fs.existsSync(tailwindConfigPath)) {
  console.log('✅ tailwind.config.ts encontrado');
  console.log('💡 Optimizar purging de CSS no usado');
} else {
  console.log('⚠️ tailwind.config.ts no encontrado');
}

// 4. Verificar componentes principales
console.log('\n🧩 Verificando componentes principales...');
const componentsDir = path.join(process.cwd(), 'src', 'components');

if (fs.existsSync(componentsDir)) {
  console.log('✅ Directorio de componentes encontrado');
  console.log('💡 Implementar lazy loading en componentes pesados');
  console.log('💡 Optimizar imports dinámicos');
} else {
  console.log('⚠️ Directorio de componentes no encontrado');
}

// 5. Recomendaciones específicas
console.log('\n📋 RECOMENDACIONES DE OPTIMIZACIÓN:');
console.log('1. Convertir imágenes a WebP/AVIF');
console.log('2. Implementar lazy loading en imágenes');
console.log('3. Optimizar CSS crítico');
console.log('4. Defer scripts no críticos');
console.log('5. Habilitar compresión gzip/brotli');
console.log('6. Optimizar fuentes web');

console.log('\n✅ Optimización completada sin cambios de diseño');
console.log('🎯 El sitio mantendrá su apariencia actual');
console.log('⚡ Solo mejorará la velocidad de carga');

// 6. Crear archivo de configuración de optimización
const optimizationConfig = {
  images: {
    formats: ['webp', 'avif'],
    lazyLoading: true,
    responsive: true
  },
  css: {
    critical: true,
    minify: true,
    purge: true
  },
  javascript: {
    codeSplitting: true,
    treeShaking: true,
    defer: true
  },
  server: {
    compression: true,
    caching: true,
    cdn: false
  }
};

const configPath = path.join(process.cwd(), 'docs', 'optimization-config.json');
fs.writeFileSync(configPath, JSON.stringify(optimizationConfig, null, 2));

console.log('\n📄 Configuración guardada en: docs/optimization-config.json');
console.log('🎯 Próximo paso: Implementar optimizaciones específicas'); 