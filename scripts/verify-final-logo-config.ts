import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO CONFIGURACIÓN FINAL DE LOGOS');
console.log('===========================================');
console.log('');

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

  // Verificar posición del logo en Hero
  if (content.includes('right: 20px')) {
    console.log('✅ Hero: Logo posicionado a la derecha');
  } else {
    console.log('❌ Hero: Logo no está a la derecha');
  }

  // Verificar comentario
  if (content.includes('Logo en la parte superior derecha')) {
    console.log('✅ Hero: Comentario correcto');
  } else {
    console.log('❌ Hero: Comentario incorrecto');
  }

  // Verificar estilos responsive
  if (content.includes('right: 15px') && content.includes('right: 10px')) {
    console.log('✅ Hero: Estilos responsive actualizados');
  } else {
    console.log('❌ Hero: Estilos responsive no actualizados');
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

// Verificar los estilos CSS
const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Buscar los estilos del logo-image
  const logoImageMatch = cssContent.match(/\.logo-image\s*\{[^}]*\}/);
  if (logoImageMatch) {
    console.log('');
    console.log('🎨 Estilos CSS del logo-image:');
    console.log(logoImageMatch[0]);
  }
} else {
  console.log('❌ ERROR: No se encontró el archivo globals.css');
}

console.log('');
console.log('🎯 CONFIGURACIÓN FINAL:');
console.log('=======================');
console.log('• Sidebar: eGrowAcademylogo.png (80x24px) - SOLO LOGO');
console.log('• Hero: eacademylogo.png (200x60px) - LADO DERECHO');
console.log('• Sidebar: Sin texto, solo logo limpio');
console.log('• Hero: Logo pequeño y elegante en esquina derecha');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Sidebar con texto, Hero con logo grande');
console.log('AHORA: Sidebar solo logo, Hero con logo pequeño');
console.log('MEJORA: Diseño más limpio y minimalista');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: solo logo sin texto');
console.log('3. Verifica el Hero: logo pequeño en la esquina derecha');
console.log('4. Confirma que el diseño se ve más limpio');
console.log('5. Prueba en diferentes tamaños de pantalla'); 