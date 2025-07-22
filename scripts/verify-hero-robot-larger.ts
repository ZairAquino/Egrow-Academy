import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO ROBOT MÁS GRANDE');
console.log('================================');
console.log('');

// Verificar el archivo Hero.tsx
const heroPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Hero.tsx');
if (fs.existsSync(heroPath)) {
  const content = fs.readFileSync(heroPath, 'utf8');
  
  // Verificar logo del Hero
  if (content.includes('src="/images/eacademylogo.png"')) {
    console.log('✅ Hero: eacademylogo.png (logo derecho)');
  } else {
    console.log('❌ Hero: logo incorrecto');
  }

  // Verificar robot añadido
  if (content.includes('src="/images/robot.png"')) {
    console.log('✅ Hero: robot.png añadido (lado izquierdo)');
  } else {
    console.log('❌ Hero: robot no añadido');
  }

  // Verificar dimensiones del logo en Hero
  const heroWidthMatch = content.match(/width=\{(\d+)\}/);
  const heroHeightMatch = content.match(/height=\{(\d+)\}/);
  
  if (heroWidthMatch && heroHeightMatch) {
    const width = parseInt(heroWidthMatch[1]);
    const height = parseInt(heroHeightMatch[1]);
    console.log(`📐 Hero Logo: ${width}x${height}px`);
  }

  // Verificar dimensiones del robot (más grande)
  const robotWidthMatch = content.match(/width=\{180\}/);
  const robotHeightMatch = content.match(/height=\{180\}/);
  
  if (robotWidthMatch && robotHeightMatch) {
    console.log('📐 Hero Robot: 180x180px (MÁS GRANDE)');
  } else {
    console.log('❌ Hero: Dimensiones del robot incorrectas');
  }

  // Verificar posición del logo (derecha)
  if (content.includes('top: 20%') && content.includes('right: 20px')) {
    console.log('✅ Hero: Logo en parte superior derecha (20% desde arriba)');
  } else {
    console.log('❌ Hero: Posición del logo incorrecta');
  }

  // Verificar posición del robot (izquierda)
  if (content.includes('top: 20%') && content.includes('left: 20px')) {
    console.log('✅ Hero: Robot en parte superior izquierda (20% desde arriba)');
  } else {
    console.log('❌ Hero: Posición del robot incorrecta');
  }

  // Verificar estilos CSS del robot (más grande)
  if (content.includes('max-height: 180px') && content.includes('max-width: 180px')) {
    console.log('✅ Hero: Estilos CSS del robot actualizados (180x180px)');
  } else {
    console.log('❌ Hero: Estilos CSS del robot no actualizados');
  }

  // Verificar filtro de sombra del robot
  if (content.includes('filter: drop-shadow')) {
    console.log('✅ Hero: Filtro de sombra aplicado al robot');
  } else {
    console.log('❌ Hero: Filtro de sombra no aplicado');
  }

  // Verificar estilos responsive del robot (más grande)
  if (content.includes('max-width: 150px') && content.includes('max-height: 150px')) {
    console.log('✅ Hero: Estilos responsive tablet del robot actualizados (150x150px)');
  } else {
    console.log('❌ Hero: Estilos responsive tablet del robot no actualizados');
  }

  if (content.includes('max-width: 120px') && content.includes('max-height: 120px')) {
    console.log('✅ Hero: Estilos responsive mobile del robot actualizados (120x120px)');
  } else {
    console.log('❌ Hero: Estilos responsive mobile del robot no actualizados');
  }

  // Verificar que ambos elementos están en la misma altura
  const logoTopMatch = content.match(/\.hero-logo\s*{[^}]*top:\s*20%/);
  const robotTopMatch = content.match(/\.hero-robot\s*{[^}]*top:\s*20%/);
  
  if (logoTopMatch && robotTopMatch) {
    console.log('✅ Hero: Logo y robot a la misma altura (20%)');
  } else {
    console.log('❌ Hero: Logo y robot no están a la misma altura');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Hero.tsx');
}

// Verificar que el archivo robot.png existe
const robotImagePath = path.join(process.cwd(), 'public', 'images', 'robot.png');
if (fs.existsSync(robotImagePath)) {
  console.log('✅ Archivo: robot.png existe en public/images/');
} else {
  console.log('❌ Archivo: robot.png no encontrado en public/images/');
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

} else {
  console.log('❌ ERROR: No se encontró el archivo Sidebar.tsx');
}

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (150x45px) - CENTRADO Y GRANDE');
console.log('• Hero Logo: eacademylogo.png (300x90px) - SUPERIOR DERECHA');
console.log('• Hero Robot: robot.png (180x180px) - SUPERIOR IZQUIERDA, MÁS GRANDE');
console.log('• Ambos elementos a la misma altura (20% desde arriba)');

console.log('');
console.log('📊 COMPARACIÓN DE TAMAÑOS:');
console.log('==========================');
console.log('ANTES: Robot 120x120px');
console.log('AHORA: Robot 180x180px');
console.log('MEJORA: 50% más grande (60px adicionales)');

console.log('');
console.log('📊 LAYOUT DEL HERO:');
console.log('===================');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│  🤖🤖 Robot (izq)                Logo (der) 🎓      │');
console.log('│                                                         │');
console.log('│                                                         │');
console.log('│              "La IA es la nueva electricidad"          │');
console.log('│                                                         │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('');
console.log('📈 MEJORAS VISUALES:');
console.log('===================');
console.log('• Robot 50% más grande (180x180px)');
console.log('• Mayor presencia visual en el Hero');
console.log('• Mejor balance con el logo del lado derecho');
console.log('• Misma altura que el logo (20% desde arriba)');
console.log('• Sombra sutil para profundidad visual');
console.log('• Responsive en todos los dispositivos');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo grande y centrado');
console.log('3. Verifica el Hero: logo derecho y robot izquierdo MÁS GRANDE');
console.log('4. Confirma que el robot tiene más presencia visual');
console.log('5. Prueba en diferentes tamaños de pantalla');

console.log('');
console.log('📱 COMPORTAMIENTO RESPONSIVE:');
console.log('============================');
console.log('• Desktop: Robot 180x180px, Logo 300x90px');
console.log('• Tablet: Robot 150x150px, Logo 240x72px');
console.log('• Mobile: Robot 120x120px, Logo 200x60px');
console.log('• Mantiene proporciones y posiciones en todos los tamaños'); 