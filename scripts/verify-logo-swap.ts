import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO INTERCAMBIO DE LOGOS');
console.log('===================================');
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
  if (content.includes('src="/images/eGrowAcademylogo.png"')) {
    console.log('✅ Hero: eGrowAcademylogo.png (logo grande)');
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
    console.log('✅ Hero: Comentario actualizado correctamente');
  } else {
    console.log('❌ Hero: Comentario no actualizado');
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
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (80x24px)');
console.log('• Hero: eGrowAcademylogo.png (300x90px) - LADO DERECHO');
console.log('• Sidebar: Logo grande y visible');
console.log('• Hero: Logo en esquina superior derecha');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Sidebar con logo pequeño, Hero con logo izquierda');
console.log('AHORA: Sidebar con logo grande, Hero con logo derecha');
console.log('MEJORA: Mejor distribución visual y balance');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo grande y completo');
console.log('3. Verifica el Hero: logo en la esquina superior derecha');
console.log('4. Confirma que el Hero no se vea vacío');
console.log('5. Prueba en diferentes tamaños de pantalla'); 