const fs = require('fs');
const path = require('path');

// Configuración
const SITE_URL = process.env.SITE_URL || 'https://egrow-academy.com';

// Palabras clave objetivo
const TARGET_KEYWORDS = [
  'cursos de inteligencia artificial',
  'cursos de IA',
  'machine learning México',
  'deep learning México',
  'inteligencia artificial México',
  'cursos de IA en español',
  'formación en inteligencia artificial',
  'aprender IA',
  'cursos online de inteligencia artificial',
  'especialización en IA',
  'inteligencia artificial Latinoamérica',
  'cursos de programación IA',
  'formación profesional IA',
  'certificación en inteligencia artificial',
  'cursos de Python para IA',
  'aprendizaje automático',
  'redes neuronales',
  'procesamiento de lenguaje natural',
  'visión por computadora',
  'robótica e IA'
];

// Función para verificar archivos SEO
function checkSEOFiles() {
  console.log('🔍 Verificando archivos SEO...\n');
  
  const publicDir = path.join(process.cwd(), 'public');
  const requiredFiles = [
    'sitemap.xml',
    'robots.txt',
    'manifest.json'
  ];

  const results = {
    sitemap: false,
    robots: false,
    manifest: false,
    sitemaps: []
  };

  requiredFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`✅ ${file} - ${(stats.size / 1024).toFixed(2)} KB`);
      
      if (file === 'sitemap.xml') {
        results.sitemap = true;
        const urlCount = (content.match(/<url>/g) || []).length;
        console.log(`   📊 URLs encontradas: ${urlCount}`);
      }
      
      if (file === 'robots.txt') {
        results.robots = true;
        const sitemapCount = (content.match(/Sitemap:/g) || []).length;
        console.log(`   📊 Sitemaps referenciados: ${sitemapCount}`);
      }
      
      if (file === 'manifest.json') {
        results.manifest = true;
        try {
          const manifest = JSON.parse(content);
          console.log(`   📱 Nombre: ${manifest.name}`);
          console.log(`   🎨 Tema: ${manifest.theme_color}`);
        } catch (e) {
          console.log(`   ❌ Error parsing manifest: ${e.message}`);
        }
      }
    } else {
      console.log(`❌ ${file} - NO ENCONTRADO`);
    }
  });

  return results;
}

// Función para analizar palabras clave
function analyzeKeywords() {
  console.log('\n🎯 Analizando palabras clave...\n');
  
  const results = {
    totalKeywords: TARGET_KEYWORDS.length,
    foundInSitemap: 0,
    foundInRobots: 0,
    foundInManifest: 0,
    missingKeywords: []
  };

  // Leer archivos
  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const robotsPath = path.join(publicDir, 'robots.txt');
  const manifestPath = path.join(publicDir, 'manifest.json');

  let sitemapContent = '';
  let robotsContent = '';
  let manifestContent = '';

  if (fs.existsSync(sitemapPath)) {
    sitemapContent = fs.readFileSync(sitemapPath, 'utf8').toLowerCase();
  }
  if (fs.existsSync(robotsPath)) {
    robotsContent = fs.readFileSync(robotsPath, 'utf8').toLowerCase();
  }
  if (fs.existsSync(manifestPath)) {
    manifestContent = fs.readFileSync(manifestPath, 'utf8').toLowerCase();
  }

  TARGET_KEYWORDS.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    let found = false;

    // Buscar en sitemap (incluyendo descripciones y títulos)
    if (sitemapContent.includes(keywordLower)) {
      results.foundInSitemap++;
      found = true;
    }
    
    // Buscar variaciones de la palabra clave
    const keywordParts = keywordLower.split(' ');
    const hasPartialMatch = keywordParts.some(part => 
      sitemapContent.includes(part) && part.length > 3
    );
    
    if (hasPartialMatch && !found) {
      results.foundInSitemap++;
      found = true;
    }

    if (robotsContent.includes(keywordLower)) {
      results.foundInRobots++;
      found = true;
    }
    if (manifestContent.includes(keywordLower)) {
      results.foundInManifest++;
      found = true;
    }

    if (!found) {
      results.missingKeywords.push(keyword);
    }
  });

  console.log(`📊 Total de palabras clave: ${results.totalKeywords}`);
  console.log(`📄 Encontradas en sitemap: ${results.foundInSitemap}`);
  console.log(`🤖 Encontradas en robots.txt: ${results.foundInRobots}`);
  console.log(`📱 Encontradas en manifest: ${results.foundInManifest}`);
  
  if (results.missingKeywords.length > 0) {
    console.log(`\n⚠️  Palabras clave faltantes:`);
    results.missingKeywords.forEach(keyword => {
      console.log(`   - ${keyword}`);
    });
  }

  return results;
}

// Función para verificar estructura de URLs
function checkURLStructure() {
  console.log('\n🔗 Verificando estructura de URLs...\n');
  
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ Sitemap no encontrado');
    return;
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urlMatches = content.match(/<loc>(.*?)<\/loc>/g) || [];
  
  const urls = urlMatches.map(match => {
    return match.replace(/<\/?loc>/g, '').replace(SITE_URL, '');
  });

  console.log(`📊 Total de URLs: ${urls.length}`);
  
  // Categorizar URLs
  const categories = {
    home: urls.filter(url => url === '/'),
    courses: urls.filter(url => url.includes('/curso/')),
    resources: urls.filter(url => url.includes('/resources/')),
    static: urls.filter(url => !url.includes('/curso/') && !url.includes('/resources/') && url !== '/')
  };

  console.log(`🏠 Página principal: ${categories.home.length}`);
  console.log(`📚 Cursos: ${categories.courses.length}`);
  console.log(`📖 Recursos: ${categories.resources.length}`);
  console.log(`📄 Páginas estáticas: ${categories.static.length}`);

  // Verificar URLs importantes
  const importantURLs = [
    '/cursos',
    '/cursos-gratuitos',
    '/community',
    '/resources',
    '/contacto'
  ];

  console.log('\n✅ URLs importantes encontradas:');
  importantURLs.forEach(url => {
    if (urls.includes(url)) {
      console.log(`   ✅ ${url}`);
    } else {
      console.log(`   ❌ ${url} - FALTANTE`);
    }
  });

  return categories;
}

// Función para generar reporte
function generateReport() {
  console.log('📋 Generando reporte SEO...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    seoFiles: checkSEOFiles(),
    keywords: analyzeKeywords(),
    urls: checkURLStructure()
  };

  // Calcular score SEO
  let seoScore = 0;
  let maxScore = 100;

  // Archivos SEO (30 puntos)
  if (report.seoFiles.sitemap) seoScore += 10;
  if (report.seoFiles.robots) seoScore += 10;
  if (report.seoFiles.manifest) seoScore += 10;

  // Palabras clave (40 puntos)
  const keywordScore = (report.keywords.foundInSitemap / report.keywords.totalKeywords) * 40;
  seoScore += keywordScore;

  // URLs (30 puntos)
  if (report.urls && report.urls.courses.length > 0) seoScore += 10;
  if (report.urls && report.urls.resources.length > 0) seoScore += 10;
  if (report.urls && report.urls.static.length >= 5) seoScore += 10;

  report.seoScore = Math.round(seoScore);
  report.maxScore = maxScore;

  console.log(`\n🎯 SCORE SEO: ${seoScore}/${maxScore} (${Math.round((seoScore/maxScore)*100)}%)`);

  if (seoScore >= 80) {
    console.log('🟢 Excelente! El SEO está muy bien configurado.');
  } else if (seoScore >= 60) {
    console.log('🟡 Bueno, pero hay espacio para mejorar.');
  } else {
    console.log('🔴 Necesita mejoras significativas en SEO.');
  }

  // Guardar reporte
  const reportPath = path.join(process.cwd(), 'docs', 'seo-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Reporte guardado en: ${reportPath}`);

  return report;
}

// Función para verificar Core Web Vitals
function checkCoreWebVitals() {
  console.log('\n⚡ Verificando Core Web Vitals...\n');
  
  console.log('📊 Métricas objetivo:');
  console.log('   - LCP (Largest Contentful Paint): < 2.5s');
  console.log('   - FID (First Input Delay): < 100ms');
  console.log('   - CLS (Cumulative Layout Shift): < 0.1');
  
  console.log('\n💡 Para medir Core Web Vitals:');
  console.log('   1. Usa Google PageSpeed Insights');
  console.log('   2. Usa Lighthouse en Chrome DevTools');
  console.log('   3. Usa Google Search Console');
  console.log('   4. Ejecuta: npm run lighthouse');
}

// Función principal
function main() {
  console.log('🚀 Análisis SEO de eGrow Academy\n');
  console.log(`🌐 Sitio: ${SITE_URL}\n`);
  
  try {
    const report = generateReport();
    checkCoreWebVitals();
    
    console.log('\n📝 Recomendaciones:');
    console.log('   1. Configurar Google Search Console');
    console.log('   2. Enviar sitemap a Google');
    console.log('   3. Configurar Google Analytics');
    console.log('   4. Monitorear Core Web Vitals');
    console.log('   5. Crear contenido optimizado');
    console.log('   6. Construir backlinks de calidad');
    console.log('   7. Optimizar velocidad de carga');
    console.log('   8. Mejorar experiencia móvil');
    
    console.log('\n✅ Análisis SEO completado!');
    
  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  checkSEOFiles,
  analyzeKeywords,
  checkURLStructure,
  generateReport,
  checkCoreWebVitals
}; 