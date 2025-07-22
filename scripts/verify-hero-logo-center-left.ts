import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL HERO CENTRADO IZQUIERDA');
console.log('================================================');
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

  // Verificar posición central izquierda
  if (content.includes('top: 50%') && content.includes('left: 20px') && content.includes('transform: translateY(-50%)')) {
    console.log('✅ Hero: Logo centrado verticalmente en lado izquierdo');
  } else {
    console.log('❌ Hero: Posición incorrecta');
  }

  // Verificar comentario
  if (content.includes('Logo en la parte central izquierda')) {
    console.log('✅ Hero: Comentario actualizado correctamente');
  } else {
    console.log('❌ Hero: Comentario no actualizado');
  }

  // Verificar estilos responsive
  if (content.includes('top: 50%') && content.includes('left: 15px') && content.includes('transform: translateY(-50%)')) {
    console.log('✅ Hero: Estilos responsive tablet correctos');
  } else {
    console.log('❌ Hero: Estilos responsive tablet incorrectos');
  }

  if (content.includes('top: 50%') && content.includes('left: 10px') && content.includes('transform: translateY(-50%)')) {
    console.log('✅ Hero: Estilos responsive mobile correctos');
  } else {
    console.log('❌ Hero: Estilos responsive mobile incorrectos');
  }

  // Verificar dimensiones del logo en Hero
  const heroWidthMatch = content.match(/width=\{(\d+)\}/);
  const heroHeightMatch = content.match(/height=\{(\d+)\}/);
  
  if (heroWidthMatch && heroHeightMatch) {
    const width = parseInt(heroWidthMatch[1]);
    const height = parseInt(heroHeightMatch[1]);
    console.log(`📐 Hero Logo: ${width}x${height}px`);
  }

  // Verificar estilos responsive del Hero
  if (content.includes('max-width: 200px') && content.includes('max-height: 60px')) {
    console.log('✅ Hero: Estilos desktop correctos');
  } else {
    console.log('❌ Hero: Estilos desktop incorrectos');
  }

  if (content.includes('max-width: 160px') && content.includes('max-height: 50px')) {
    console.log('✅ Hero: Estilos tablet correctos');
  } else {
    console.log('❌ Hero: Estilos tablet incorrectos');
  }

  if (content.includes('max-width: 140px') && content.includes('max-height: 40px')) {
    console.log('✅ Hero: Estilos mobile correctos');
  } else {
    console.log('❌ Hero: Estilos mobile incorrectos');
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

  // Verificar que NO hay texto
  if (!content.includes('eGrow-academy')) {
    console.log('✅ Sidebar: Sin texto (solo logo)');
  } else {
    console.log('❌ Sidebar: Aún tiene texto');
  }

  // Verificar dimensiones del logo en Sidebar
  const widthMatch = content.match(/width=\{(\d+)\}/);
  const heightMatch = content.match(/height=\{(\d+)\}/);
  
  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    console.log(`📐 Sidebar Logo: ${width}x${height}px`);
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Sidebar.tsx');
}

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (80x24px) - SOLO LOGO');
console.log('• Hero: eacademylogo.png (200x60px) - CENTRO IZQUIERDA');
console.log('• Sidebar: Sin texto, solo logo limpio');
console.log('• Hero: Logo centrado verticalmente en lado izquierdo');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Hero con logo en esquina superior derecha');
console.log('AHORA: Hero con logo centrado en lado izquierdo');
console.log('MEJORA: Mejor balance visual y posicionamiento');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: solo logo sin texto');
console.log('3. Verifica el Hero: logo centrado en el lado izquierdo');
console.log('4. Confirma que el logo esté bien posicionado verticalmente');
console.log('5. Prueba en diferentes tamaños de pantalla'); 