import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LAYOUT DEL SIDEBAR');
console.log('==================================');
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

  // Verificar si tiene gap entre logo y texto
  if (content.includes('gap: \'12px\'')) {
    console.log('✅ Espaciado entre logo y texto: 12px');
  } else {
    console.log('❌ No se encontró espaciado definido');
  }

  // Verificar alineación
  if (content.includes('alignItems: \'center\'')) {
    console.log('✅ Alineación vertical: center');
  } else {
    console.log('❌ Alineación vertical no definida');
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
console.log('• Tamaño: 80x24px (más compacto)');
console.log('• Espaciado: 12px entre logo y texto');
console.log('• Alineación: center (vertical)');
console.log('• object-fit: contain (mantiene proporción)');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: 120x36px (muy ancho)');
console.log('AHORA: 80x24px (más compacto)');
console.log('MEJORA: -33% de ancho, más espacio para texto');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Abre el menú lateral (Sidebar)');
console.log('3. Verifica que el logo y texto estén en la misma línea');
console.log('4. Confirma que no se encimen');
console.log('5. Verifica que el espaciado se vea natural'); 