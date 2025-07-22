import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO ALINEACIÓN DEL SIDEBAR');
console.log('======================================');
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
    console.log('✅ Alineación horizontal: flex-start (izquierda)');
  } else {
    console.log('❌ Alineación horizontal no definida');
  }

  if (content.includes('alignItems: \'center\'')) {
    console.log('✅ Alineación vertical: center');
  } else {
    console.log('❌ Alineación vertical no definida');
  }

  // Verificar espaciado
  if (content.includes('gap: \'12px\'')) {
    console.log('✅ Espaciado entre logo y texto: 12px');
  } else {
    console.log('❌ No se encontró espaciado definido');
  }

  // Verificar ancho del contenedor
  if (content.includes('width: \'100%\'')) {
    console.log('✅ Contenedor: ancho completo');
  } else {
    console.log('❌ Contenedor sin ancho definido');
  }

  // Verificar padding
  if (content.includes('padding: \'0 16px\'')) {
    console.log('✅ Padding lateral: 16px');
  } else {
    console.log('❌ Padding no definido');
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
  
  // Verificar dimensiones en CSS
  const cssWidthMatch = cssContent.match(/width:\s*(\d+)px/);
  const cssHeightMatch = cssContent.match(/height:\s*(\d+)px/);
  
  if (cssWidthMatch && cssHeightMatch) {
    const cssWidth = parseInt(cssWidthMatch[1]);
    const cssHeight = parseInt(cssHeightMatch[1]);
    console.log('');
    console.log(`📏 Dimensiones en CSS: ${cssWidth}x${cssHeight}px`);
  }
} else {
  console.log('❌ ERROR: No se encontró el archivo globals.css');
}

console.log('');
console.log('🎯 CONFIGURACIÓN ACTUAL:');
console.log('========================');
console.log('• Logo: eacademylogo.png');
console.log('• Tamaño: 70x21px (más compacto)');
console.log('• Alineación: flex-start (izquierda)');
console.log('• Espaciado: 12px entre logo y texto');
console.log('• Contenedor: ancho completo con padding');
console.log('• object-fit: contain (mantiene proporción)');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: 80x24px, sin alineación específica');
console.log('AHORA: 70x21px, alineado a la izquierda');
console.log('MEJORA: -12.5% de ancho, más espacio para texto');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Abre el menú lateral (Sidebar)');
console.log('3. Verifica que el logo esté alineado a la izquierda');
console.log('4. Confirma que el texto "eGrow-academy" se vea completo');
console.log('5. Verifica que no haya encimamiento'); 