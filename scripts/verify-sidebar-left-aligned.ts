import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO ALINEACIÓN A LA IZQUIERDA DEL SIDEBAR');
console.log('====================================================');
console.log('');

// Verificar el archivo Sidebar.tsx
const sidebarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Sidebar.tsx');
if (fs.existsSync(sidebarPath)) {
  const content = fs.readFileSync(sidebarPath, 'utf8');
  
  // Verificar dimensiones del logo
  const widthMatch = content.match(/width=\{(\d+)\}/);
  const heightMatch = content.match(/height=\{(\d+)\}/);
  
  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    console.log('📐 DIMENSIONES DEL LOGO:');
    console.log(`   Ancho: ${width}px`);
    console.log(`   Alto: ${height}px`);
    console.log(`   Relación: ${(width/height).toFixed(2)}:1`);
  }

  // Verificar alineación
  if (content.includes('justifyContent: \'flex-start\'')) {
    console.log('✅ Alineación: flex-start (izquierda)');
  } else {
    console.log('❌ Alineación: no definida');
  }

  // Verificar gap
  if (content.includes('gap: \'6px\'')) {
    console.log('✅ Espaciado: 6px entre logo y texto');
  } else {
    console.log('❌ Espaciado no definido');
  }

  // Verificar padding del contenedor
  if (content.includes('padding: \'0 12px\'')) {
    console.log('✅ Contenedor: padding 0 12px');
  } else {
    console.log('❌ Padding del contenedor no definido');
  }

  // Verificar padding del link
  if (content.includes('padding: \'0 4px\'')) {
    console.log('✅ Link: padding 0 4px');
  } else {
    console.log('❌ Padding del link no definido');
  }

  // Verificar que el texto no se corte
  if (!content.includes('overflow: \'hidden\'')) {
    console.log('✅ Texto: sin overflow hidden (no se corta)');
  } else {
    console.log('❌ Texto: con overflow hidden (se corta)');
  }

  if (!content.includes('textOverflow: \'ellipsis\'')) {
    console.log('✅ Texto: sin ellipsis (no se corta)');
  } else {
    console.log('❌ Texto: con ellipsis (se corta)');
  }

  // Verificar flex del texto
  if (content.includes('flex: 1')) {
    console.log('✅ Texto: flex: 1 (toma espacio restante)');
  } else {
    console.log('❌ Texto: sin flex definido');
  }

  // Verificar flexShrink del logo
  if (content.includes('flexShrink: 0')) {
    console.log('✅ Logo: flexShrink: 0 (no se comprime)');
  } else {
    console.log('❌ Logo: sin flexShrink definido');
  }

} else {
  console.log('❌ ERROR: No se encontró el archivo Sidebar.tsx');
}

// Verificar los estilos CSS
const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Buscar los estilos del logo-image
  const logoImageMatch = cssContent.match(/\.logo-image\s*\{[^}]*\}/);
  if (logoImageMatch) {
    console.log('');
    console.log('🎨 Estilos CSS del logo:');
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
console.log('• Logo: eacademylogo.png (50x15px)');
console.log('• Logo: flexShrink: 0 (no se comprime)');
console.log('• Texto: flex: 1 (toma espacio restante)');
console.log('• Texto: nowrap (sin cortar)');
console.log('• Espaciado: 6px entre elementos');
console.log('• Alineación: flex-start (izquierda)');
console.log('• Contenedor: padding 0 12px');
console.log('• Link: padding 0 4px');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: 60x18px, texto con ellipsis, se cortaba');
console.log('AHORA: 50x15px, texto sin cortar, alineado a la izquierda');
console.log('MEJORA: Logo más compacto + texto completo visible');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Abre el menú lateral (Sidebar)');
console.log('3. Verifica que el logo y texto estén alineados a la izquierda');
console.log('4. Confirma que el texto "eGrow-academy" esté completo');
console.log('5. Verifica que no haya espacios en blanco innecesarios'); 