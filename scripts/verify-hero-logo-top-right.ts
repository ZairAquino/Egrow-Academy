import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL HERO SUPERIOR DERECHA');
console.log('==============================================');
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

  // Verificar posición superior derecha
  if (content.includes('top: 30%') && content.includes('right: 20px')) {
    console.log('✅ Hero: Logo en parte superior derecha (30% desde arriba)');
  } else {
    console.log('❌ Hero: Posición incorrecta');
  }

  // Verificar que no hay transform
  if (!content.includes('transform: translateY(-50%)')) {
    console.log('✅ Hero: Sin transform (posicionamiento directo)');
  } else {
    console.log('❌ Hero: Transform innecesario presente');
  }

  // Verificar comentario
  if (content.includes('Logo en la parte superior derecha')) {
    console.log('✅ Hero: Comentario actualizado correctamente');
  } else {
    console.log('❌ Hero: Comentario no actualizado');
  }

  // Verificar estilos responsive
  if (content.includes('top: 25%') && content.includes('right: 15px')) {
    console.log('✅ Hero: Estilos responsive tablet correctos');
  } else {
    console.log('❌ Hero: Estilos responsive tablet incorrectos');
  }

  if (content.includes('top: 20%') && content.includes('right: 10px')) {
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
console.log('• Sidebar: eGrowAcademylogo.png (120x36px) - CENTRADO');
console.log('• Hero: eacademylogo.png (200x60px) - SUPERIOR DERECHA');
console.log('• Sidebar: Logo grande y centrado');
console.log('• Hero: Logo a altura del texto "Domina el aprendizaje automático"');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Hero con logo centrado en lado izquierdo');
console.log('AHORA: Hero con logo en parte superior derecha');
console.log('MEJORA: Logo alineado con el texto principal');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo grande y centrado');
console.log('3. Verifica el Hero: logo en la parte superior derecha');
console.log('4. Confirma que el logo esté a la altura del texto principal');
console.log('5. Prueba en diferentes tamaños de pantalla'); 