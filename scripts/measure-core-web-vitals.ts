#!/usr/bin/env node

/**
 * Script para medir Core Web Vitals de eGrow Academy
 * Genera recomendaciones de optimización basadas en métricas de rendimiento
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Medición de Core Web Vitals para eGrow Academy\n');

// Métricas objetivo de Core Web Vitals
const targetMetrics = {
  LCP: { target: 2.5, good: 2.5, poor: 4.0 }, // Largest Contentful Paint (segundos)
  FID: { target: 100, good: 100, poor: 300 }, // First Input Delay (milisegundos)
  CLS: { target: 0.1, good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { target: 1.8, good: 1.8, poor: 3.0 }, // First Contentful Paint (segundos)
  TTFB: { target: 600, good: 600, poor: 1800 }, // Time to First Byte (milisegundos)
};

// Recomendaciones de optimización
const optimizationRecommendations = {
  LCP: [
    'Optimizar imágenes grandes (usar WebP, AVIF)',
    'Implementar lazy loading para imágenes',
    'Optimizar CSS crítico',
    'Usar CDN para recursos estáticos',
    'Comprimir y minificar archivos',
    'Implementar preload para recursos críticos'
  ],
  FID: [
    'Reducir JavaScript bloqueante',
    'Dividir código en chunks más pequeños',
    'Usar web workers para tareas pesadas',
    'Optimizar event listeners',
    'Implementar debouncing en interacciones'
  ],
  CLS: [
    'Definir dimensiones de imágenes y videos',
    'Evitar insertar contenido sobre contenido existente',
    'Usar transform en lugar de cambiar propiedades que causan layout',
    'Precargar fuentes web',
    'Reservar espacio para anuncios dinámicos'
  ],
  FCP: [
    'Optimizar el servidor (TTFB)',
    'Minificar CSS, HTML y JavaScript',
    'Comprimir recursos con gzip/brotli',
    'Usar caché del navegador',
    'Eliminar recursos no críticos'
  ],
  TTFB: [
    'Optimizar consultas de base de datos',
    'Usar caché del servidor',
    'Implementar CDN',
    'Optimizar el servidor web',
    'Usar bases de datos más rápidas'
  ]
};

// Función para generar reporte de Core Web Vitals
function generateCoreWebVitalsReport() {
  const reportPath = path.join(process.cwd(), 'docs', 'core-web-vitals-report.md');
  
  const reportContent = `# Reporte Core Web Vitals - eGrow Academy

## 📊 Métricas Objetivo

| Métrica | Objetivo | Bueno | Malo | Descripción |
|---------|----------|-------|------|-------------|
| LCP | < 2.5s | < 2.5s | > 4.0s | Largest Contentful Paint |
| FID | < 100ms | < 100ms | > 300ms | First Input Delay |
| CLS | < 0.1 | < 0.1 | > 0.25 | Cumulative Layout Shift |
| FCP | < 1.8s | < 1.8s | > 3.0s | First Contentful Paint |
| TTFB | < 600ms | < 600ms | > 1800ms | Time to First Byte |

## 🎯 Estado Actual

### Métricas Críticas
- **LCP**: Por medir
- **FID**: Por medir  
- **CLS**: Por medir

### Métricas Secundarias
- **FCP**: Por medir
- **TTFB**: Por medir

## 🛠️ Herramientas de Medición

### 1. Google PageSpeed Insights
\`\`\`bash
# URL: https://pagespeed.web.dev/
# Ingresa: https://egrow-academy.com
\`\`\`

### 2. Lighthouse CLI
\`\`\`bash
# Instalar Lighthouse
npm install -g lighthouse

# Medir Core Web Vitals
lighthouse https://egrow-academy.com --output=json --output-path=./docs/lighthouse-report.json
\`\`\`

### 3. Google Search Console
- Ir a: https://search.google.com/search-console
- Seleccionar propiedad: egrow-academy.com
- Ir a: Mejoras > Core Web Vitals

### 4. Chrome DevTools
- Abrir DevTools (F12)
- Ir a pestaña Performance
- Hacer clic en "Record"
- Recargar página
- Analizar métricas

## 🔧 Recomendaciones de Optimización

### LCP (Largest Contentful Paint)
${optimizationRecommendations.LCP.map(rec => `- ${rec}`).join('\n')}

### FID (First Input Delay)
${optimizationRecommendations.FID.map(rec => `- ${rec}`).join('\n')}

### CLS (Cumulative Layout Shift)
${optimizationRecommendations.CLS.map(rec => `- ${rec}`).join('\n')}

### FCP (First Contentful Paint)
${optimizationRecommendations.FCP.map(rec => `- ${rec}`).join('\n')}

### TTFB (Time to First Byte)
${optimizationRecommendations.TTFB.map(rec => `- ${rec}`).join('\n')}

## 📈 Optimizaciones Específicas para eGrow Academy

### 1. Optimización de Imágenes
\`\`\`typescript
// En next.config.ts
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
};
\`\`\`

### 2. Lazy Loading de Componentes
\`\`\`typescript
// Componentes pesados
const CourseCard = dynamic(() => import('./CourseCard'), {
  loading: () => <CourseCardSkeleton />,
  ssr: false
});
\`\`\`

### 3. Optimización de Fuentes
\`\`\`typescript
// En layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
\`\`\`

### 4. Caché y Compresión
\`\`\`typescript
// En next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async headers() {
    return [
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
\`\`\`

## 📊 Monitoreo Continuo

### Scripts de Automatización
\`\`\`bash
# Medir Core Web Vitals
npm run measure-cwv

# Análisis de rendimiento
npm run performance-analysis

# Optimización automática
npm run optimize-performance
\`\`\`

### Alertas Recomendadas
- LCP > 2.5s
- FID > 100ms
- CLS > 0.1
- FCP > 1.8s
- TTFB > 600ms

## 🎯 Objetivos de Rendimiento

### A 1 mes:
- LCP < 2.0s
- FID < 80ms
- CLS < 0.08
- FCP < 1.5s
- TTFB < 500ms

### A 3 meses:
- LCP < 1.8s
- FID < 60ms
- CLS < 0.05
- FCP < 1.2s
- TTFB < 400ms

## 📝 Notas
- Actualizado: ${new Date().toISOString()}
- Próxima medición: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}
- Responsable: Equipo de Desarrollo
`;

  fs.writeFileSync(reportPath, reportContent);
  console.log('✅ Reporte de Core Web Vitals generado: docs/core-web-vitals-report.md');
}

// Función para generar script de medición
function generateMeasurementScript() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'measure-cwv.js');
  
  const scriptContent = `#!/usr/bin/env node

/**
 * Script para medir Core Web Vitals automáticamente
 * Usa Lighthouse CLI para generar reportes
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Medición automática de Core Web Vitals\\n');

const siteUrl = 'https://egrow-academy.com';
const outputPath = path.join(process.cwd(), 'docs', 'lighthouse-report.json');

// Verificar si Lighthouse está instalado
exec('lighthouse --version', (error) => {
  if (error) {
    console.log('⚠️  Lighthouse no está instalado');
    console.log('📦 Instalando Lighthouse...');
    exec('npm install -g lighthouse', (installError) => {
      if (installError) {
        console.error('❌ Error instalando Lighthouse:', installError.message);
        return;
      }
      runMeasurement();
    });
  } else {
    runMeasurement();
  }
});

function runMeasurement() {
  console.log('📊 Ejecutando Lighthouse...');
  console.log(\`🌐 URL: \${siteUrl}\`);
  console.log(\`📁 Output: \${outputPath}\`);
  
  const command = \`lighthouse "\${siteUrl}" --output=json --output-path="\${outputPath}" --only-categories=performance\`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error ejecutando Lighthouse:', error.message);
      return;
    }
    
    if (fs.existsSync(outputPath)) {
      const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      const metrics = report.audits;
      
      console.log('\\n📊 Resultados Core Web Vitals:');
      console.log(\`LCP: \${metrics['largest-contentful-paint']?.displayValue || 'N/A'}\`);
      console.log(\`FID: \${metrics['max-potential-fid']?.displayValue || 'N/A'}\`);
      console.log(\`CLS: \${metrics['cumulative-layout-shift']?.displayValue || 'N/A'}\`);
      console.log(\`FCP: \${metrics['first-contentful-paint']?.displayValue || 'N/A'}\`);
      console.log(\`TTFB: \${metrics['server-response-time']?.displayValue || 'N/A'}\`);
      
      console.log('\\n✅ Medición completada!');
      console.log(\`📄 Reporte guardado en: \${outputPath}\`);
    } else {
      console.error('❌ No se generó el reporte');
    }
  });
}
`;

  fs.writeFileSync(scriptPath, scriptContent);
  console.log('✅ Script de medición generado: scripts/measure-cwv.js');
}

// Función para actualizar package.json con scripts
function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    // Agregar scripts de Core Web Vitals
    packageJson.scripts['measure-cwv'] = 'node scripts/measure-cwv.js';
    packageJson.scripts['performance-analysis'] = 'node scripts/performance-analysis.js';
    packageJson.scripts['optimize-performance'] = 'node scripts/optimize-performance.js';
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Scripts de Core Web Vitals agregados a package.json');
  }
}

// Ejecutar generación de reportes
try {
  generateCoreWebVitalsReport();
  generateMeasurementScript();
  updatePackageJson();
  
  console.log('\n🎉 Configuración de Core Web Vitals completada!');
  console.log('\n📈 Próximos pasos:');
  console.log('1. Instalar Lighthouse: npm install -g lighthouse');
  console.log('2. Medir métricas: npm run measure-cwv');
  console.log('3. Analizar resultados en docs/core-web-vitals-report.md');
  console.log('4. Implementar optimizaciones recomendadas');
  
} catch (error) {
  console.error('❌ Error durante la configuración:', error);
} 