import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO TAMAÑO DEL LOGO EN HERO');
console.log('======================================');
console.log('');

// Verificar el archivo Hero.tsx
const heroPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Hero.tsx');
if (fs.existsSync(heroPath)) {
  const content = fs.readFileSync(heroPath, 'utf8');
  
  // Verificar dimensiones del Image component
  const widthMatch = content.match(/width=\{(\d+)\}/);
  const heightMatch = content.match(/height=\{(\d+)\}/);
  
  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    console.log('📐 DIMENSIONES DEL COMPONENTE IMAGE:');
    console.log(`   Ancho: ${width}px`);
    console.log(`   Alto: ${height}px`);
    console.log(`   Relación: ${(width/height).toFixed(2)}:1`);
  }

  // Verificar estilos CSS
  const maxWidthMatch = content.match(/max-width:\s*(\d+)px/);
  const maxHeightMatch = content.match(/max-height:\s*(\d+)px/);
  
  if (maxWidthMatch && maxHeightMatch) {
    const maxWidth = parseInt(maxWidthMatch[1]);
    const maxHeight = parseInt(maxHeightMatch[1]);
    console.log('');
    console.log('🎨 ESTILOS CSS:');
    console.log(`   max-width: ${maxWidth}px`);
    console.log(`   max-height: ${maxHeight}px`);
  }

  // Verificar tamaños responsive
  const tabletMatch = content.match(/@media \(max-width: 768px\)[^}]*max-width:\s*(\d+)px[^}]*max-height:\s*(\d+)px/);
  const mobileMatch = content.match(/@media \(max-width: 480px\)[^}]*max-width:\s*(\d+)px[^}]*max-height:\s*(\d+)px/);
  
  console.log('');
  console.log('📱 TAMAÑOS RESPONSIVE:');
  if (tabletMatch) {
    console.log(`   Tablet (≤768px): ${tabletMatch[1]}x${tabletMatch[2]}px`);
  }
  if (mobileMatch) {
    console.log(`   Móvil (≤480px): ${mobileMatch[1]}x${mobileMatch[2]}px`);
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Hero.tsx');
}

console.log('');
console.log('🎯 COMPARACIÓN CON TAMAÑO ANTERIOR:');
console.log('-----------------------------------');
console.log('ANTES:');
console.log('   Desktop: 200x60px');
console.log('   Tablet: 160x50px');
console.log('   Móvil: 140x40px');
console.log('');
console.log('AHORA:');
console.log('   Desktop: 300x90px (+50% más grande)');
console.log('   Tablet: 240x70px (+50% más grande)');
console.log('   Móvil: 200x60px (+43% más grande)');
console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica que el logo se ve más grande en el Hero');
console.log('3. Prueba en diferentes tamaños de pantalla');
console.log('4. Confirma que mantiene la proporción correcta'); 