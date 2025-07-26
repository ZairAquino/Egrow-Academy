#!/usr/bin/env node

/**
 * Script para convertir imágenes críticas a WebP
 * Optimiza las imágenes más pesadas sin cambiar el diseño
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

console.log('🔄 Convirtiendo imágenes críticas a WebP...\n');

const imagesDir = path.join(process.cwd(), 'public', 'images');
const optimizedDir = path.join(process.cwd(), 'public', 'images', 'optimized');

// Imágenes críticas a convertir
const criticalImages = [
  { 
    input: 'p1.png', 
    output: 'p1.webp', 
    quality: 80,
    targetSize: '500KB'
  },
  { 
    input: 'v-5.png', 
    output: 'v-5.webp', 
    quality: 85,
    targetSize: '300KB'
  },
  { 
    input: 'monetiza-ia.png', 
    output: 'monetiza-ia.webp', 
    quality: 85,
    targetSize: '300KB'
  },
  { 
    input: 'logop.png', 
    output: 'logop.webp', 
    quality: 90,
    targetSize: '200KB'
  }
];

async function convertImage(inputFile, outputFile, quality) {
  const inputPath = path.join(imagesDir, inputFile);
  const outputPath = path.join(optimizedDir, outputFile);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️ No se encontró: ${inputFile}`);
    return;
  }
  
  try {
    console.log(`🔄 Convirtiendo: ${inputFile} → ${outputFile}`);
    
    await sharp(inputPath)
      .webp({ quality: quality })
      .toFile(outputPath);
    
    // Obtener tamaño del archivo original y optimizado
    const originalStats = fs.statSync(inputPath);
    const optimizedStats = fs.statSync(outputPath);
    
    const originalSize = (originalStats.size / 1024).toFixed(1);
    const optimizedSize = (optimizedStats.size / 1024).toFixed(1);
    const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`✅ ${inputFile}: ${originalSize}KB → ${optimizedSize}KB (${reduction}% reducción)`);
    
  } catch (error) {
    console.log(`❌ Error convirtiendo ${inputFile}:`, error.message);
  }
}

async function convertAllImages() {
  console.log('🚀 Iniciando conversión de imágenes críticas...\n');
  
  for (const image of criticalImages) {
    await convertImage(image.input, image.output, image.quality);
  }
  
  console.log('\n✅ Conversión completada');
  console.log('📁 Imágenes optimizadas guardadas en: public/images/optimized/');
  console.log('💡 Próximo paso: Actualizar componentes para usar imágenes WebP');
}

convertAllImages().catch(console.error); 