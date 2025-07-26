#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Optimizando CSS crítico - eGrow Academy');

// Función para extraer CSS crítico
function extractCriticalCSS(cssContent) {
  const criticalSelectors = [
    // Reset y base
    '*', 'html', 'body', ':root',
    
    // Layout principal
    '.container', '.main-content', '.hero', '.hero-content', '.hero-title', '.hero-description',
    
    // Componentes críticos
    '.user-profile-fixed', '.sidebar', '.course-card-new', '.course-image-new',
    
    // Utilidades críticas
    '.btn', '.btn-primary', '.section', '.section-header', '.section-title',
    
    // Responsive crítico
    '@media (max-width: 768px)', '@media (max-width: 480px)'
  ];

  const lines = cssContent.split('\n');
  const criticalCSS = [];
  let inCriticalBlock = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Verificar si la línea contiene selectores críticos
    const isCritical = criticalSelectors.some(selector => 
      line.includes(selector) && !line.startsWith('/*')
    );

    if (isCritical || inCriticalBlock) {
      criticalCSS.push(lines[i]);
      
      // Contar llaves para detectar bloques CSS
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;
      
      inCriticalBlock = braceCount > 0;
    }
  }

  return criticalCSS.join('\n');
}

// Función para minificar CSS
function minifyCSS(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios
    .replace(/\s+/g, ' ') // Remover espacios múltiples
    .replace(/\s*{\s*/g, '{') // Remover espacios alrededor de llaves
    .replace(/\s*}\s*/g, '}') // Remover espacios alrededor de llaves
    .replace(/\s*:\s*/g, ':') // Remover espacios alrededor de dos puntos
    .replace(/\s*;\s*/g, ';') // Remover espacios alrededor de punto y coma
    .replace(/\s*,\s*/g, ',') // Remover espacios alrededor de comas
    .trim();
}

// Función para optimizar fuentes
function optimizeFonts(cssContent) {
  // Agregar font-display: swap para fuentes web
  return cssContent.replace(
    /@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=([^']+)'\);/g,
    `@import url('https://fonts.googleapis.com/css2?family=$1&display=swap');`
  );
}

// Función para agregar preload de fuentes críticas
function addFontPreload() {
  return `
/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`;
}

// Función principal
function optimizeCSS() {
  try {
    const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    console.log('📊 Tamaño original CSS:', (cssContent.length / 1024).toFixed(2), 'KB');
    
    // Extraer CSS crítico
    const criticalCSS = extractCriticalCSS(cssContent);
    console.log('📊 Tamaño CSS crítico:', (criticalCSS.length / 1024).toFixed(2), 'KB');
    
    // Optimizar fuentes
    const optimizedCSS = optimizeFonts(cssContent);
    
    // Agregar preload de fuentes
    const finalCSS = addFontPreload() + optimizedCSS;
    
    // Crear versión minificada
    const minifiedCSS = minifyCSS(finalCSS);
    console.log('📊 Tamaño CSS minificado:', (minifiedCSS.length / 1024).toFixed(2), 'KB');
    
    // Guardar archivo optimizado
    const optimizedPath = path.join(process.cwd(), 'src', 'app', 'globals.optimized.css');
    fs.writeFileSync(optimizedPath, finalCSS);
    
    // Guardar versión minificada
    const minifiedPath = path.join(process.cwd(), 'src', 'app', 'globals.min.css');
    fs.writeFileSync(minifiedPath, minifiedCSS);
    
    // Crear archivo de configuración
    const config = {
      originalSize: cssContent.length,
      criticalSize: criticalCSS.length,
      optimizedSize: finalCSS.length,
      minifiedSize: minifiedCSS.length,
      reduction: ((cssContent.length - minifiedCSS.length) / cssContent.length * 100).toFixed(2),
      timestamp: new Date().toISOString()
    };
    
    const configPath = path.join(process.cwd(), 'docs', 'css-optimization-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('✅ CSS optimizado exitosamente!');
    console.log(`📁 Archivo optimizado: src/app/globals.optimized.css`);
    console.log(`📁 Archivo minificado: src/app/globals.min.css`);
    console.log(`📁 Configuración: docs/css-optimization-config.json`);
    console.log(`📊 Reducción: ${config.reduction}%`);
    
    return config;
    
  } catch (error) {
    console.error('❌ Error optimizando CSS:', error.message);
    return null;
  }
}

// Ejecutar optimización
if (require.main === module) {
  optimizeCSS();
}

module.exports = { optimizeCSS, extractCriticalCSS, minifyCSS }; 