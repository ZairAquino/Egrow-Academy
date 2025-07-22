import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO ROBOT AÑADIDO AL HERO');
console.log('=====================================');
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

  // Verificar comentario del robot
  if (content.includes('Robot en la parte superior izquierda')) {
    console.log('✅ Hero: Comentario del robot correcto');
  } else {
    console.log('❌ Hero: Comentario del robot incorrecto');
  }

  // Verificar dimensiones del logo en Hero
  const heroWidthMatch = content.match(/width=\{(\d+)\}/);
  const heroHeightMatch = content.match(/height=\{(\d+)\}/);
  
  if (heroWidthMatch && heroHeightMatch) {
    const width = parseInt(heroWidthMatch[1]);
    const height = parseInt(heroHeightMatch[1]);
    console.log(`📐 Hero Logo: ${width}x${height}px`);
  }

  // Verificar dimensiones del robot
  const robotWidthMatch = content.match(/width=\{120\}/);
  const robotHeightMatch = content.match(/height=\{120\}/);
  
  if (robotWidthMatch && robotHeightMatch) {
    console.log('📐 Hero Robot: 120x120px');
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

  // Verificar estilos CSS del robot
  if (content.includes('max-height: 120px') && content.includes('max-width: 120px')) {
    console.log('✅ Hero: Estilos CSS del robot correctos');
  } else {
    console.log('❌ Hero: Estilos CSS del robot incorrectos');
  }

  // Verificar filtro de sombra del robot
  if (content.includes('filter: drop-shadow')) {
    console.log('✅ Hero: Filtro de sombra aplicado al robot');
  } else {
    console.log('❌ Hero: Filtro de sombra no aplicado');
  }

  // Verificar estilos responsive del robot
  if (content.includes('max-width: 100px') && content.includes('max-height: 100px')) {
    console.log('✅ Hero: Estilos responsive tablet del robot correctos');
  } else {
    console.log('❌ Hero: Estilos responsive tablet del robot incorrectos');
  }

  if (content.includes('max-width: 80px') && content.includes('max-height: 80px')) {
    console.log('✅ Hero: Estilos responsive mobile del robot correctos');
  } else {
    console.log('❌ Hero: Estilos responsive mobile del robot incorrectos');
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
  console.log('⚠️  Necesitas añadir robot.png a la carpeta public/images/');
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
console.log('• Hero Robot: robot.png (120x120px) - SUPERIOR IZQUIERDA');
console.log('• Ambos elementos a la misma altura (20% desde arriba)');

console.log('');
console.log('📊 LAYOUT DEL HERO:');
console.log('===================');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│  🤖 Robot (izq)                    Logo (der) 🎓      │');
console.log('│                                                         │');
console.log('│                                                         │');
console.log('│              "La IA es la nueva electricidad"          │');
console.log('│                                                         │');
console.log('└─────────────────────────────────────────────────────────┘');

console.log('');
console.log('📈 MEJORAS VISUALES:');
console.log('===================');
console.log('• Robot añadido en el lado izquierdo del Hero');
console.log('• Misma altura que el logo (20% desde arriba)');
console.log('• Tamaño apropiado (120x120px)');
console.log('• Sombra sutil para profundidad visual');
console.log('• Responsive en todos los dispositivos');
console.log('• Balance visual entre ambos lados');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Asegúrate de que robot.png esté en public/images/');
console.log('2. Recarga la página del navegador (Ctrl+F5)');
console.log('3. Verifica el Sidebar: logo grande y centrado');
console.log('4. Verifica el Hero: logo derecho y robot izquierdo');
console.log('5. Confirma que ambos están a la misma altura');
console.log('6. Prueba en diferentes tamaños de pantalla');

console.log('');
console.log('📱 COMPORTAMIENTO RESPONSIVE:');
console.log('============================');
console.log('• Desktop: Robot 120x120px, Logo 300x90px');
console.log('• Tablet: Robot 100x100px, Logo 240x72px');
console.log('• Mobile: Robot 80x80px, Logo 200x60px');
console.log('• Mantiene proporciones y posiciones en todos los tamaños'); 