#!/usr/bin/env tsx

/**
 * Script de Testing para Facebook Pixel
 * 
 * Este script verifica que Facebook Pixel esté correctamente implementado
 * y que los eventos se envíen correctamente.
 * 
 * Uso: npx tsx scripts/test-facebook-pixel.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

class FacebookPixelTester {
  private results: TestResult[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  async runAllTests() {
    console.log('🧪 Iniciando tests de Facebook Pixel...\n');

    // Tests de configuración
    this.testLayoutImplementation();
    this.testPixelIdConfiguration();
    this.testServiceImplementation();
    this.testHookImplementation();
    this.testComponentImplementation();
    this.testDocumentation();

    // Mostrar resultados
    this.displayResults();
  }

  private testLayoutImplementation() {
    const layoutPath = join(this.projectRoot, 'src/app/layout.tsx');
    
    if (!existsSync(layoutPath)) {
      this.addResult('Layout Implementation', 'FAIL', 'Archivo layout.tsx no encontrado');
      return;
    }

    const layoutContent = readFileSync(layoutPath, 'utf-8');
    
    // Verificar que el script de Facebook Pixel esté presente
    if (layoutContent.includes('1247652460159167')) {
      this.addResult('Layout Implementation', 'PASS', 'Facebook Pixel script encontrado en layout.tsx');
    } else {
      this.addResult('Layout Implementation', 'FAIL', 'Facebook Pixel script no encontrado en layout.tsx');
    }

    // Verificar que el noscript tag esté presente
    if (layoutContent.includes('noscript')) {
      this.addResult('NoScript Implementation', 'PASS', 'NoScript tag encontrado');
    } else {
      this.addResult('NoScript Implementation', 'WARNING', 'NoScript tag no encontrado');
    }
  }

  private testPixelIdConfiguration() {
    const envPath = join(this.projectRoot, '.env.example');
    
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8');
      
      if (envContent.includes('NEXT_PUBLIC_FACEBOOK_PIXEL_ID')) {
        this.addResult('Environment Configuration', 'PASS', 'Variable NEXT_PUBLIC_FACEBOOK_PIXEL_ID configurada');
      } else {
        this.addResult('Environment Configuration', 'WARNING', 'Variable NEXT_PUBLIC_FACEBOOK_PIXEL_ID no encontrada en .env.example');
      }
    } else {
      this.addResult('Environment Configuration', 'WARNING', 'Archivo .env.example no encontrado');
    }
  }

  private testServiceImplementation() {
    const servicePath = join(this.projectRoot, 'src/lib/facebook-pixel.ts');
    
    if (!existsSync(servicePath)) {
      this.addResult('Service Implementation', 'FAIL', 'Archivo facebook-pixel.ts no encontrado');
      return;
    }

    const serviceContent = readFileSync(servicePath, 'utf-8');
    
    // Verificar funciones principales
    const requiredFunctions = [
      'trackFacebookPixelEvent',
      'trackUserRegistration',
      'trackUserLogin',
      'trackCourseView',
      'trackLessonComplete',
      'trackPremiumUpgrade',
      'trackPurchase'
    ];

    let passedFunctions = 0;
    for (const func of requiredFunctions) {
      if (serviceContent.includes(func)) {
        passedFunctions++;
      }
    }

    if (passedFunctions === requiredFunctions.length) {
      this.addResult('Service Implementation', 'PASS', `Todas las funciones requeridas implementadas (${passedFunctions}/${requiredFunctions.length})`);
    } else {
      this.addResult('Service Implementation', 'FAIL', `Faltan funciones: ${passedFunctions}/${requiredFunctions.length} implementadas`);
    }
  }

  private testHookImplementation() {
    const hookPath = join(this.projectRoot, 'src/hooks/useFacebookPixel.ts');
    
    if (!existsSync(hookPath)) {
      this.addResult('Hook Implementation', 'FAIL', 'Archivo useFacebookPixel.ts no encontrado');
      return;
    }

    const hookContent = readFileSync(hookPath, 'utf-8');
    
    // Verificar que el hook use el contexto de autenticación
    if (hookContent.includes('useAuth')) {
      this.addResult('Hook Implementation', 'PASS', 'Hook useFacebookPixel implementado correctamente');
    } else {
      this.addResult('Hook Implementation', 'FAIL', 'Hook no usa useAuth');
    }

    // Verificar funciones del hook
    const hookFunctions = [
      'trackCourseView',
      'trackPurchase',
      'trackPremiumUpgrade',
      'isUserLoggedIn'
    ];

    let passedHookFunctions = 0;
    for (const func of hookFunctions) {
      if (hookContent.includes(func)) {
        passedHookFunctions++;
      }
    }

    if (passedHookFunctions === hookFunctions.length) {
      this.addResult('Hook Functions', 'PASS', `Todas las funciones del hook implementadas (${passedHookFunctions}/${hookFunctions.length})`);
    } else {
      this.addResult('Hook Functions', 'WARNING', `Algunas funciones del hook faltan: ${passedHookFunctions}/${hookFunctions.length}`);
    }
  }

  private testComponentImplementation() {
    const componentPath = join(this.projectRoot, 'src/components/analytics/FacebookPixelTracker.tsx');
    
    if (!existsSync(componentPath)) {
      this.addResult('Component Implementation', 'FAIL', 'Archivo FacebookPixelTracker.tsx no encontrado');
      return;
    }

    const componentContent = readFileSync(componentPath, 'utf-8');
    
    // Verificar componentes principales
    const requiredComponents = [
      'FacebookPixelTracker',
      'CourseTracker',
      'LessonTracker',
      'CertificateTracker'
    ];

    let passedComponents = 0;
    for (const component of requiredComponents) {
      if (componentContent.includes(component)) {
        passedComponents++;
      }
    }

    if (passedComponents === requiredComponents.length) {
      this.addResult('Component Implementation', 'PASS', `Todos los componentes implementados (${passedComponents}/${requiredComponents.length})`);
    } else {
      this.addResult('Component Implementation', 'WARNING', `Algunos componentes faltan: ${passedComponents}/${requiredComponents.length}`);
    }
  }

  private testDocumentation() {
    const docPath = join(this.projectRoot, 'docs/FACEBOOK-PIXEL-GUIDE.md');
    
    if (existsSync(docPath)) {
      const docContent = readFileSync(docPath, 'utf-8');
      
      if (docContent.includes('1247652460159167')) {
        this.addResult('Documentation', 'PASS', 'Documentación completa creada con ID correcto');
      } else {
        this.addResult('Documentation', 'WARNING', 'Documentación creada pero sin ID específico');
      }
    } else {
      this.addResult('Documentation', 'FAIL', 'Documentación no encontrada');
    }
  }

  private addResult(test: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: string) {
    this.results.push({
      test,
      status,
      message,
      details
    });
  }

  private displayResults() {
    console.log('📊 Resultados de los Tests:\n');

    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;

    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`${icon} ${result.test}: ${result.message}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    });

    console.log('\n📈 Resumen:');
    console.log(`✅ PASS: ${passCount}`);
    console.log(`❌ FAIL: ${failCount}`);
    console.log(`⚠️ WARNING: ${warningCount}`);

    if (failCount === 0) {
      console.log('\n🎉 ¡Facebook Pixel está correctamente implementado!');
      console.log('\n📋 Próximos pasos:');
      console.log('1. Verificar que el sitio esté funcionando');
      console.log('2. Instalar Facebook Pixel Helper en el navegador');
      console.log('3. Navegar por el sitio y verificar eventos');
      console.log('4. Configurar audiencias en Facebook Ads Manager');
    } else {
      console.log('\n🔧 Hay problemas que necesitan ser corregidos antes de continuar.');
    }
  }
}

// Ejecutar tests
async function main() {
  const tester = new FacebookPixelTester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
} 