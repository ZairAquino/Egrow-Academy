#!/usr/bin/env node

/**
 * Script para medir Core Web Vitals automáticamente
 * Usa Lighthouse CLI para generar reportes
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Medición automática de Core Web Vitals\n');

const siteUrl = 'https://egrowacademy.com';
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
  console.log(`🌐 URL: ${siteUrl}`);
  console.log(`📁 Output: ${outputPath}`);
  
  const command = `lighthouse "${siteUrl}" --output=json --output-path="${outputPath}" --only-categories=performance`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error ejecutando Lighthouse:', error.message);
      return;
    }
    
    if (fs.existsSync(outputPath)) {
      const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      const metrics = report.audits;
      
      console.log('\n📊 Resultados Core Web Vitals:');
      console.log(`LCP: ${metrics['largest-contentful-paint']?.displayValue || 'N/A'}`);
      console.log(`FID: ${metrics['max-potential-fid']?.displayValue || 'N/A'}`);
      console.log(`CLS: ${metrics['cumulative-layout-shift']?.displayValue || 'N/A'}`);
      console.log(`FCP: ${metrics['first-contentful-paint']?.displayValue || 'N/A'}`);
      console.log(`TTFB: ${metrics['server-response-time']?.displayValue || 'N/A'}`);
      
      console.log('\n✅ Medición completada!');
      console.log(`📄 Reporte guardado en: ${outputPath}`);
    } else {
      console.error('❌ No se generó el reporte');
    }
  });
}
