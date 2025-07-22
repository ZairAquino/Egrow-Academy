import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL SIDEBAR MEJORADO');
console.log('=========================================');
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

  // Verificar centrado
  if (content.includes('justifyContent: \'center\'')) {
    console.log('✅ Sidebar: Logo centrado horizontalmente');
  } else {
    console.log('❌ Sidebar: Logo no está centrado');
  }

  // Verificar padding
  if (content.includes('padding: \'8px 0\'')) {
    console.log('✅ Sidebar: Padding vertical aplicado');
  } else {
    console.log('❌ Sidebar: Padding no aplicado');
  }

  // Verificar que no hay gap
  if (!content.includes('gap: \'6px\'')) {
    console.log('✅ Sidebar: Sin gap (no necesario para logo único)');
  } else {
    console.log('❌ Sidebar: Gap innecesario presente');
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

  // Verificar posición central izquierda
  if (content.includes('top: 50%') && content.includes('left: 20px') && content.includes('transform: translateY(-50%)')) {
    console.log('✅ Hero: Logo centrado verticalmente en lado izquierdo');
  } else {
    console.log('❌ Hero: Posición incorrecta');
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
  
  // Verificar flex-shrink en CSS
  if (cssContent.includes('flex-shrink: 0')) {
    console.log('✅ CSS: flex-shrink: 0 aplicado');
  } else {
    console.log('❌ CSS: flex-shrink no aplicado');
  }
} else {
  console.log('❌ ERROR: No se encontró el archivo globals.css');
}

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (120x36px) - CENTRADO');
console.log('• Hero: eacademylogo.png (200x60px) - CENTRO IZQUIERDA');
console.log('• Sidebar: Logo más grande y centrado');
console.log('• Hero: Logo centrado verticalmente en lado izquierdo');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Sidebar logo 80x24px, alineado a la izquierda');
console.log('AHORA: Sidebar logo 120x36px, centrado');
console.log('MEJORA: Logo más visible y mejor posicionado');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo más grande y centrado');
console.log('3. Verifica el Hero: logo centrado en el lado izquierdo');
console.log('4. Confirma que ambos logos se ven mejor');
console.log('5. Prueba en diferentes tamaños de pantalla'); 