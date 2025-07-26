#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('⚡ Optimizando JavaScript - eGrow Academy');

// Función para analizar imports
function analyzeImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Buscar imports de React
    const reactImports = content.match(/import.*from ['"]react['"]/g) || [];
    const nextImports = content.match(/import.*from ['"]next\/[^'"]*['"]/g) || [];
    const componentImports = content.match(/import.*from ['"]@\/components[^'"]*['"]/g) || [];
    const hookImports = content.match(/import.*from ['"]@\/hooks[^'"]*['"]/g) || [];
    
    return {
      react: reactImports.length,
      next: nextImports.length,
      components: componentImports.length,
      hooks: hookImports.length,
      total: reactImports.length + nextImports.length + componentImports.length + hookImports.length
    };
  } catch (error) {
    return { react: 0, next: 0, components: 0, hooks: 0, total: 0 };
  }
}

// Función para identificar componentes pesados
function findHeavyComponents() {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  const heavyComponents = [];
  
  if (fs.existsSync(componentsDir)) {
    const files = fs.readdirSync(componentsDir, { recursive: true });
    
    files.forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(componentsDir, file);
        const stats = fs.statSync(filePath);
        const imports = analyzeImports(filePath);
        
        if (stats.size > 5000 || imports.total > 10) {
          heavyComponents.push({
            file: file,
            size: stats.size,
            imports: imports
          });
        }
      }
    });
  }
  
  return heavyComponents;
}

// Función para generar recomendaciones de lazy loading
function generateLazyLoadingRecommendations(heavyComponents) {
  const recommendations = [];
  
  heavyComponents.forEach(component => {
    if (component.size > 10000) {
      recommendations.push({
        component: component.file,
        type: 'lazy-load',
        reason: 'Componente muy pesado',
        size: component.size
      });
    } else if (component.imports.total > 15) {
      recommendations.push({
        component: component.file,
        type: 'code-split',
        reason: 'Muchos imports',
        imports: component.imports.total
      });
    }
  });
  
  return recommendations;
}

// Función para optimizar bundle
function optimizeBundle() {
  console.log('📊 Analizando componentes...');
  
  const heavyComponents = findHeavyComponents();
  const recommendations = generateLazyLoadingRecommendations(heavyComponents);
  
  console.log(`🔍 Encontrados ${heavyComponents.length} componentes pesados`);
  
  if (heavyComponents.length > 0) {
    console.log('\n📋 Componentes que requieren optimización:');
    heavyComponents.forEach(comp => {
      console.log(`• ${comp.file} (${(comp.size / 1024).toFixed(2)} KB, ${comp.imports.total} imports)`);
    });
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recomendaciones de optimización:');
    recommendations.forEach(rec => {
      console.log(`• ${rec.component}: ${rec.type} - ${rec.reason}`);
    });
  }
  
  return { heavyComponents, recommendations };
}

// Función para crear configuración de optimización
function createOptimizationConfig(heavyComponents, recommendations) {
  const config = {
    analysis: {
      totalComponents: heavyComponents.length,
      totalRecommendations: recommendations.length,
      timestamp: new Date().toISOString()
    },
    heavyComponents: heavyComponents.map(comp => ({
      file: comp.file,
      size: comp.size,
      sizeKB: (comp.size / 1024).toFixed(2),
      imports: comp.imports
    })),
    recommendations: recommendations,
    optimizations: {
      lazyLoading: recommendations.filter(r => r.type === 'lazy-load').length,
      codeSplitting: recommendations.filter(r => r.type === 'code-split').length,
      treeShaking: true,
      minification: true
    }
  };
  
  const configPath = path.join(process.cwd(), 'docs', 'javascript-optimization-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  return config;
}

// Función para generar código de lazy loading
function generateLazyLoadingCode(components) {
  const lazyComponents = components.filter(comp => comp.size > 10000);
  
  if (lazyComponents.length === 0) {
    return null;
  }
  
  let code = '// Lazy Loading Components\n';
  code += 'import { lazy, Suspense } from \'react\';\n\n';
  
  lazyComponents.forEach(comp => {
    const componentName = path.basename(comp.file, path.extname(comp.file));
    code += `const ${componentName} = lazy(() => import('@/components/${comp.file}'));\n`;
  });
  
  code += '\n// Usage example:\n';
  code += '// <Suspense fallback={<div>Loading...</div>}>\n';
  code += '//   <ComponentName />\n';
  code += '// </Suspense>\n';
  
  return code;
}

// Función principal
function optimizeJavaScript() {
  try {
    console.log('🚀 Iniciando optimización de JavaScript...\n');
    
    // Analizar componentes
    const { heavyComponents, recommendations } = optimizeBundle();
    
    // Crear configuración
    const config = createOptimizationConfig(heavyComponents, recommendations);
    
    // Generar código de lazy loading
    const lazyCode = generateLazyLoadingCode(heavyComponents);
    
    if (lazyCode) {
      const lazyPath = path.join(process.cwd(), 'src', 'lib', 'lazy-components.ts');
      fs.writeFileSync(lazyPath, lazyCode);
      console.log(`📁 Código lazy loading generado: src/lib/lazy-components.ts`);
    }
    
    console.log('\n✅ Optimización de JavaScript completada!');
    console.log(`📁 Configuración: docs/javascript-optimization-config.json`);
    console.log(`📊 Componentes analizados: ${config.analysis.totalComponents}`);
    console.log(`💡 Recomendaciones generadas: ${config.analysis.totalRecommendations}`);
    
    return config;
    
  } catch (error) {
    console.error('❌ Error optimizando JavaScript:', error.message);
    return null;
  }
}

// Ejecutar optimización
if (require.main === module) {
  optimizeJavaScript();
}

module.exports = { optimizeJavaScript, analyzeImports, findHeavyComponents }; 