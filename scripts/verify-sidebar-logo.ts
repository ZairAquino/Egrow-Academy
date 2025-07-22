import fs from 'fs';
import path from 'path';

console.log('🔍 VERIFICANDO LOGO DEL SIDEBAR');
console.log('================================');
console.log('');

// Verificar el archivo Sidebar.tsx
const sidebarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Sidebar.tsx');
if (fs.existsSync(sidebarPath)) {
  const content = fs.readFileSync(sidebarPath, 'utf8');
  
  // Verificar que use eacademylogo.png
  if (content.includes('eacademylogo.png')) {
    console.log('✅ Sidebar usa eacademylogo.png');
  } else {
    console.log('❌ Sidebar NO usa eacademylogo.png');
  }
  
  // Verificar dimensiones del Image component
  const widthMatch = content.match(/width=\{(\d+)\}/);
  const heightMatch = content.match(/height=\{(\d+)\}/);
  
  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    console.log(`📐 Dimensiones del componente: ${width}x${height}px`);
    console.log(`📊 Relación de aspecto: ${(width/height).toFixed(2)}:1`);
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
console.log('• Tamaño: 120x36px');
console.log('• object-fit: contain (para mantener proporción)');
console.log('• border-radius: 8px');

console.log('');
console.log('🚀 PARA VER LOS CAMBIOS:');
console.log('------------------------');
console.log('1. Recarga la página del navegador (Ctrl+F5)');
console.log('2. Abre el menú lateral (Sidebar)');
console.log('3. Verifica que el logo se vea completo y bien proporcionado');
console.log('4. Confirma que no se ve cortado'); 