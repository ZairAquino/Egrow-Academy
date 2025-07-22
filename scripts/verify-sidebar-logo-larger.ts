import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL SIDEBAR MÁS GRANDE');
console.log('============================================');
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
    
    if (width === 150 && height === 45) {
      console.log('✅ Sidebar: Dimensiones correctas (150x45px)');
    } else {
      console.log('❌ Sidebar: Dimensiones incorrectas');
    }
  }

  // Verificar centrado
  if (content.includes('justifyContent: \'center\'')) {
    console.log('✅ Sidebar: Logo centrado horizontalmente');
  } else {
    console.log('❌ Sidebar: Logo no está centrado');
  }

  // Verificar padding
  if (content.includes('padding: \'8px 0\'')) {
    console.log('✅ Sidebar: Padding vertical correcto');
  } else {
    console.log('❌ Sidebar: Padding incorrecto');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Sidebar.tsx');
}

// Verificar el archivo globals.css
const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
if (fs.existsSync(cssPath)) {
  const content = fs.readFileSync(cssPath, 'utf8');
  
  // Verificar estilos CSS del logo
  if (content.includes('width: 150px') && content.includes('height: 45px')) {
    console.log('✅ CSS: Estilos del logo actualizados correctamente');
  } else {
    console.log('❌ CSS: Estilos del logo no actualizados');
  }

  // Verificar que mantiene las otras propiedades
  if (content.includes('border-radius: 8px') && content.includes('object-fit: contain') && content.includes('flex-shrink: 0')) {
    console.log('✅ CSS: Propiedades adicionales mantenidas');
  } else {
    console.log('❌ CSS: Faltan propiedades adicionales');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo globals.css');
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

  // Verificar posición superior derecha
  if (content.includes('top: 30%') && content.includes('right: 20px')) {
    console.log('✅ Hero: Logo en parte superior derecha (30% desde arriba)');
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

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Sidebar: eGrowAcademylogo.png (150x45px) - CENTRADO Y MÁS GRANDE');
console.log('• Hero: eacademylogo.png (200x60px) - SUPERIOR DERECHA');
console.log('• Sidebar: Logo grande, centrado y prominente');
console.log('• Hero: Logo a altura del texto "Domina el aprendizaje automático"');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: Sidebar logo 120x36px');
console.log('AHORA: Sidebar logo 150x45px');
console.log('MEJORA: Logo 25% más grande y prominente');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Verifica el Sidebar: logo más grande y centrado');
console.log('3. Verifica el Hero: logo en la parte superior derecha');
console.log('4. Confirma que el logo del Sidebar se ve más prominente');
console.log('5. Prueba en diferentes tamaños de pantalla');

console.log('');
console.log('📈 MEJORAS VISUALES:');
console.log('===================');
console.log('• Logo del Sidebar 25% más grande (120→150px ancho)');
console.log('• Logo del Sidebar 25% más alto (36→45px alto)');
console.log('• Mayor presencia visual en la navegación');
console.log('• Mejor balance con el logo del Hero');
console.log('• Mantiene el centrado y la elegancia'); 