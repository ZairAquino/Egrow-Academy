#!/usr/bin/env node

/**
 * Script para optimizar keywords SEO en eGrow Academy
 * Agrega las keywords faltantes a los archivos SEO principales
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Optimización de Keywords SEO para eGrow Academy\n');

// Keywords faltantes identificadas en el análisis
const missingKeywords = [
  'machine learning México',
  'deep learning México',
  'inteligencia artificial México',
  'formación en inteligencia artificial',
  'aprender IA',
  'inteligencia artificial Latinoamérica',
  'formación profesional IA',
  'certificación en inteligencia artificial',
  'aprendizaje automático',
  'redes neuronales',
  'procesamiento de lenguaje natural',
  'visión por computadora',
  'robótica e IA'
];

// Keywords ya implementadas
const existingKeywords = [
  'cursos de inteligencia artificial',
  'cursos de IA',
  'machine learning',
  'deep learning',
  'inteligencia artificial',
  'cursos de IA en español'
];

// Todas las keywords
const allKeywords = [...existingKeywords, ...missingKeywords];

console.log('📊 Keywords implementadas:', existingKeywords.length);
console.log('⚠️  Keywords faltantes:', missingKeywords.length);
console.log('🎯 Total de keywords:', allKeywords.length);

// Función para actualizar robots.txt
function updateRobotsTxt() {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  
  if (fs.existsSync(robotsPath)) {
    let content = fs.readFileSync(robotsPath, 'utf8');
    
    // Agregar keywords faltantes como comentarios
    const keywordsComment = `# ${missingKeywords.join(', ')}`;
    
    if (!content.includes(keywordsComment)) {
      // Insertar después del comentario existente
      const insertIndex = content.indexOf('# Especialización en IA, formación profesional y certificación') + 50;
      content = content.slice(0, insertIndex) + '\n' + keywordsComment + content.slice(insertIndex);
      
      fs.writeFileSync(robotsPath, content);
      console.log('✅ robots.txt actualizado con keywords faltantes');
    } else {
      console.log('✅ robots.txt ya contiene las keywords');
    }
  }
}

// Función para actualizar manifest.json
function updateManifestJson() {
  const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Agregar keywords a la descripción
    const keywordsString = missingKeywords.join(', ');
    manifest.description = `${manifest.description} ${keywordsString}.`;
    
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ manifest.json actualizado con keywords faltantes');
  }
}

// Función para actualizar sitemap.xml
function updateSitemapXml() {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  if (fs.existsSync(sitemapPath)) {
    let content = fs.readFileSync(sitemapPath, 'utf8');
    
    // Agregar comentario con keywords
    const keywordsComment = `<!-- Keywords: ${allKeywords.join(', ')} -->`;
    
    if (!content.includes('<!-- Keywords:')) {
      // Insertar al inicio del archivo
      content = keywordsComment + '\n' + content;
      
      fs.writeFileSync(sitemapPath, content);
      console.log('✅ sitemap.xml actualizado con keywords');
    } else {
      console.log('✅ sitemap.xml ya contiene keywords');
    }
  }
}

// Función para generar archivo de keywords
function generateKeywordsFile() {
  const keywordsPath = path.join(process.cwd(), 'docs', 'seo-keywords.md');
  
  const keywordsContent = `# Keywords SEO - eGrow Academy

## 🎯 Palabras Clave Principales

### Keywords Implementadas (${existingKeywords.length})
${existingKeywords.map(kw => `- ${kw}`).join('\n')}

### Keywords Faltantes (${missingKeywords.length})
${missingKeywords.map(kw => `- ${kw}`).join('\n')}

## 📊 Estadísticas
- **Total de keywords**: ${allKeywords.length}
- **Implementadas**: ${existingKeywords.length}
- **Faltantes**: ${missingKeywords.length}
- **Score SEO**: ${Math.round((existingKeywords.length / allKeywords.length) * 100)}%

## 🎯 Objetivos de Posicionamiento

### México
- "cursos de inteligencia artificial México" - Top 3
- "machine learning México" - Top 5
- "deep learning México" - Top 5
- "inteligencia artificial México" - Top 3

### Latinoamérica
- "cursos de IA en español" - Top 3
- "inteligencia artificial Latinoamérica" - Top 5
- "formación en inteligencia artificial" - Top 5

### Términos Específicos
- "aprender IA" - Top 3
- "formación profesional IA" - Top 5
- "certificación en inteligencia artificial" - Top 5
- "aprendizaje automático" - Top 5
- "redes neuronales" - Top 10
- "procesamiento de lenguaje natural" - Top 10
- "visión por computadora" - Top 10
- "robótica e IA" - Top 10

## 📝 Notas
- Actualizado: ${new Date().toISOString()}
- Próxima revisión: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
`;

  fs.writeFileSync(keywordsPath, keywordsContent);
  console.log('✅ Archivo de keywords generado: docs/seo-keywords.md');
}

// Ejecutar optimizaciones
try {
  updateRobotsTxt();
  updateManifestJson();
  updateSitemapXml();
  generateKeywordsFile();
  
  console.log('\n🎉 Optimización de keywords completada!');
  console.log('\n📈 Próximos pasos:');
  console.log('1. Configurar Google Analytics 4');
  console.log('2. Medir Core Web Vitals');
  console.log('3. Crear contenido optimizado');
  console.log('4. Construir backlinks de calidad');
  
} catch (error) {
  console.error('❌ Error durante la optimización:', error);
} 