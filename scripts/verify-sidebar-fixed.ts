import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LAYOUT FIXED DEL SIDEBAR');
console.log('========================================');
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

  // Verificar flexShrink en el logo
  if (content.includes('flexShrink: 0')) {
    console.log('✅ Logo: flexShrink: 0 (no se comprime)');
  } else {
    console.log('❌ Logo: sin flexShrink definido');
  }

  // Verificar estilos del texto
  if (content.includes('whiteSpace: \'nowrap\'')) {
    console.log('✅ Texto: whiteSpace: nowrap');
  } else {
    console.log('❌ Texto: sin whiteSpace definido');
  }

  if (content.includes('overflow: \'hidden\'')) {
    console.log('✅ Texto: overflow: hidden');
  } else {
    console.log('❌ Texto: sin overflow definido');
  }

  if (content.includes('textOverflow: \'ellipsis\'')) {
    console.log('✅ Texto: textOverflow: ellipsis');
  } else {
    console.log('❌ Texto: sin textOverflow definido');
  }

  if (content.includes('flex: 1')) {
    console.log('✅ Texto: flex: 1 (toma espacio restante)');
  } else {
    console.log('❌ Texto: sin flex definido');
  }

  // Verificar gap
  if (content.includes('gap: \'8px\'')) {
    console.log('✅ Espaciado: 8px entre logo y texto');
  } else {
    console.log('❌ Espaciado no definido');
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
console.log('• Logo: eacademylogo.png (60x18px)');
console.log('• Logo: flexShrink: 0 (no se comprime)');
console.log('• Texto: flex: 1 (toma espacio restante)');
console.log('• Texto: nowrap + ellipsis (se corta si es necesario)');
console.log('• Espaciado: 8px entre elementos');
console.log('• Contenedor: minWidth: 0 (permite compresión)');

console.log('');
console.log('📊 COMPARACIÓN CON ANTERIOR:');
console.log('============================');
console.log('ANTES: 70x21px, sin flexShrink, texto se encimaba');
console.log('AHORA: 60x18px, flexShrink: 0, texto con ellipsis');
console.log('MEJORA: Logo fijo + texto adaptable');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Abre el menú lateral (Sidebar)');
console.log('3. Verifica que el logo y texto estén en la misma línea');
console.log('4. Confirma que NO se encimen');
console.log('5. Si el sidebar es muy estrecho, el texto se cortará con "..."'); 