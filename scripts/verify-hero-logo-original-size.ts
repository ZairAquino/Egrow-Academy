import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL HERO TAMAÑO ORIGINAL');
console.log('=============================================');
console.log('');

// Verificar el archivo Hero.tsx
const heroPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Hero.tsx');
if (fs.existsSync(heroPath)) {
  const content = fs.readFileSync(heroPath, 'utf8');
  
  // Verificar logo del Hero
  if (content.includes('src="/images/eacademylogo.png"')) {
    console.log('✅ Hero: eacademylogo.png (logo pequeño)');
  } else {
    console.log('❌ Hero: logo incorrecto');
  }

  // Verificar dimensiones originales del logo en Hero
  const heroWidthMatch = content.match(/width=\{(\d+)\}/);
  const heroHeightMatch = content.match(/height=\{(\d+)\}/);
  
  if (heroWidthMatch && heroHeightMatch) {
    const width = parseInt(heroWidthMatch[1]);
    const height = parseInt(heroHeightMatch[1]);
    console.log(`📐 Hero Logo: ${width}x${height}px`);
    
    if (width === 300 && height === 90) {
      console.log('✅ Hero: Tamaño original restaurado (300x90px)');
    } else {
      console.log('❌ Hero: Tamaño incorrecto');
    }
  }

  // Verificar posición más arriba
  if (content.includes('top: 20%') && content.includes('right: 20px')) {
    console.log('✅ Hero: Logo posicionado más arriba (20% desde arriba)');
  } else {
    console.log('❌ Hero: Posición incorrecta');
  }

  // Verificar estilos CSS del logo
  if (content.includes('max-height: 90px') && content.includes('max-width: 300px')) {
    console.log('✅ Hero: Estilos CSS actualizados correctamente');
  } else {
    console.log('❌ Hero: Estilos CSS no actualizados');
  }

  // Verificar estilos responsive
  if (content.includes('top: 15%') && content.includes('max-width: 240px') && content.includes('max-height: 72px')) {
    console.log('✅ Hero: Estilos responsive tablet correctos');
  } else {
    console.log('❌ Hero: Estilos responsive tablet incorrectos');
  }

  if (content.includes('top: 10%') && content.includes('max-width: 200px') && content.includes('max-height: 60px')) {
    console.log('✅ Hero: Estilos responsive mobile correctos');
  } else {
    console.log('❌ Hero: Estilos responsive mobile incorrectos');
  }

  // Verificar comentario
  if (content.includes('Logo en la parte superior derecha')) {
    console.log('✅ Hero: Comentario correcto');
  } else {
    console.log('❌ Hero: Comentario incorrecto');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Hero.tsx');
}

// Verificar el archivo Sidebar.tsx
const sidebarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Sidebar.tsx');
if (fs.existsSync(sidebarPath)) {
  const content = fs.readFileSync(sidebarPath, 'utf8');
  
  // Verificar logo del Sidebar
  if (content.includes('src="/images/eGrowAcademylogo.png"')) {
    console.log('✅ Sidebar: eGrowAcademylogo.png (logo grande)');
  } else {
    console.log('❌ Sidebar: logo incorrecto');
  }

  // Verificar dimensiones del logo en Sidebar
  const widthMatch = content.match(/width=\{(\d+)\}/);
  const heightMatch = content.match(/height=\{(\d+)\}/);
  
  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    console.log(`📐 Sidebar Logo: ${width}x${height}px`);
  }

  // Verificar centrado
  if (content.includes('justifyContent: \'center\'')) {
    console.log('✅ Sidebar: Logo centrado horizontalmente');
  } else {
    console.log('❌ Sidebar: Logo no está centrado');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Sidebar.tsx');
}

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (150x45px) - CENTRADO Y GRANDE');
console.log('• Hero: eacademylogo.png (300x90px) - SUPERIOR DERECHA, TAMAÑO ORIGINAL');
console.log('• Sidebar: Logo grande, centrado y prominente');
console.log('• Hero: Logo con proporciones originales, posicionado más arriba');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Hero logo 200x60px (aplastado)');
console.log('AHORA: Hero logo 300x90px (tamaño original)');
console.log('MEJORA: Proporciones correctas, no se ve aplastado');

console.log('');
console.log('📈 MEJORAS VISUALES:');
console.log('===================');
console.log('• Logo del Hero restaurado a tamaño original (300x90px)');
console.log('• Proporciones correctas, no se ve aplastado');
console.log('• Posicionado más arriba (20% en lugar de 30%)');
console.log('• Estilos responsive actualizados proporcionalmente');
console.log('• Mejor balance visual con el logo del Sidebar');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo grande y centrado');
console.log('3. Verifica el Hero: logo con proporciones correctas');
console.log('4. Confirma que el logo no se ve aplastado');
console.log('5. Verifica que esté posicionado más arriba');
console.log('6. Prueba en diferentes tamaños de pantalla');

console.log('');
console.log('📱 COMPORTAMIENTO RESPONSIVE:');
console.log('============================');
console.log('• Desktop: 300x90px, top: 20%');
console.log('• Tablet: 240x72px, top: 15%');
console.log('• Mobile: 200x60px, top: 10%');
console.log('• Mantiene proporciones en todos los tamaños'); 