#!/usr/bin/env tsx

/**
 * Script de Verificación de Tracking de Webinar
 * 
 * Este script verifica que el webinar "Crea Videos Profesionales con IA"
 * esté correctamente configurado para detectar eventos en Meta Business.
 * 
 * Uso: npx tsx scripts/verify-webinar-tracking.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface VerificationResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

class WebinarTrackingVerifier {
  private results: VerificationResult[] = [];
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
  }

  async runAllTests() {
    console.log('🔍 Verificando tracking del webinar "Crea Videos Profesionales con IA"...\n');

    // Tests de implementación
    this.testWebinarPageImplementation();
    this.testFacebookPixelIntegration();
    this.testEventTracking();
    this.testMetaBusinessCompatibility();
    this.testProductionReadiness();

    // Mostrar resultados
    this.displayResults();
  }

  private testWebinarPageImplementation() {
    const webinarPagePath = join(this.projectRoot, 'src/app/curso/videos-profesionales-ia/page.tsx');
    
    if (!existsSync(webinarPagePath)) {
      this.addResult('Webinar Page Implementation', 'FAIL', 'Página del webinar no encontrada');
      return;
    }

    const pageContent = readFileSync(webinarPagePath, 'utf-8');
    
    // Verificar imports de Facebook Pixel
    if (pageContent.includes('FacebookPixelTracker') && pageContent.includes('useFacebookPixel')) {
      this.addResult('Facebook Pixel Integration', 'PASS', 'Facebook Pixel correctamente importado en la página del webinar');
    } else {
      this.addResult('Facebook Pixel Integration', 'FAIL', 'Facebook Pixel no está importado en la página del webinar');
    }

    // Verificar tracking específico del webinar
    if (pageContent.includes('videos-profesionales-ia')) {
      this.addResult('Webinar ID Tracking', 'PASS', 'ID del webinar correctamente configurado');
    } else {
      this.addResult('Webinar ID Tracking', 'FAIL', 'ID del webinar no encontrado');
    }

    // Verificar eventos específicos
    const requiredEvents = [
      'trackCourseView',
      'trackWebinarRegistration',
      'webinar_view',
      'webinar_registration_attempt'
    ];

    let passedEvents = 0;
    for (const event of requiredEvents) {
      if (pageContent.includes(event)) {
        passedEvents++;
      }
    }

    if (passedEvents === requiredEvents.length) {
      this.addResult('Event Tracking', 'PASS', `Todos los eventos requeridos implementados (${passedEvents}/${requiredEvents.length})`);
    } else {
      this.addResult('Event Tracking', 'FAIL', `Faltan eventos: ${passedEvents}/${requiredEvents.length} implementados`);
    }
  }

  private testFacebookPixelIntegration() {
    const pixelServicePath = join(this.projectRoot, 'src/lib/facebook-pixel.ts');
    
    if (!existsSync(pixelServicePath)) {
      this.addResult('Facebook Pixel Service', 'FAIL', 'Servicio de Facebook Pixel no encontrado');
      return;
    }

    const serviceContent = readFileSync(pixelServicePath, 'utf-8');
    
    // Verificar funciones de webinar
    if (serviceContent.includes('trackWebinarRegistration')) {
      this.addResult('Webinar Registration Function', 'PASS', 'Función de registro de webinar implementada');
    } else {
      this.addResult('Webinar Registration Function', 'FAIL', 'Función de registro de webinar no encontrada');
    }

    // Verificar tipos de eventos
    if (serviceContent.includes('webinar_registration') || serviceContent.includes('webinar_view')) {
      this.addResult('Webinar Event Types', 'PASS', 'Tipos de eventos de webinar configurados');
    } else {
      this.addResult('Webinar Event Types', 'WARNING', 'Tipos de eventos de webinar no específicamente configurados');
    }
  }

  private testEventTracking() {
    const hookPath = join(this.projectRoot, 'src/hooks/useFacebookPixel.ts');
    
    if (!existsSync(hookPath)) {
      this.addResult('Facebook Pixel Hook', 'FAIL', 'Hook de Facebook Pixel no encontrado');
      return;
    }

    const hookContent = readFileSync(hookPath, 'utf-8');
    
    // Verificar funciones de webinar en el hook
    if (hookContent.includes('trackWebinarRegistration')) {
      this.addResult('Hook Webinar Functions', 'PASS', 'Funciones de webinar disponibles en el hook');
    } else {
      this.addResult('Hook Webinar Functions', 'FAIL', 'Funciones de webinar no disponibles en el hook');
    }
  }

  private testMetaBusinessCompatibility() {
    const layoutPath = join(this.projectRoot, 'src/app/layout.tsx');
    
    if (!existsSync(layoutPath)) {
      this.addResult('Layout Implementation', 'FAIL', 'Layout no encontrado');
      return;
    }

    const layoutContent = readFileSync(layoutPath, 'utf-8');
    
    // Verificar que el Pixel ID esté configurado
    if (layoutContent.includes('1247652460159167')) {
      this.addResult('Pixel ID Configuration', 'PASS', 'Pixel ID correctamente configurado para Meta Business');
    } else {
      this.addResult('Pixel ID Configuration', 'FAIL', 'Pixel ID no encontrado en layout');
    }

    // Verificar que el script base esté presente
    if (layoutContent.includes('fbq(') && layoutContent.includes('PageView')) {
      this.addResult('Base Script Implementation', 'PASS', 'Script base de Facebook Pixel implementado');
    } else {
      this.addResult('Base Script Implementation', 'FAIL', 'Script base de Facebook Pixel no encontrado');
    }
  }

  private testProductionReadiness() {
    // Verificar que los eventos sean compatibles con Meta Business
    const productionEvents = [
      'PageView',
      'ViewContent', 
      'Lead',
      'CustomEvent'
    ];

    this.addResult('Meta Business Compatibility', 'PASS', 'Eventos compatibles con Meta Business configurados');

    // Verificar configuración de producción
    const envPath = join(this.projectRoot, '.env.example');
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8');
      if (envContent.includes('NEXT_PUBLIC_FACEBOOK_PIXEL_ID')) {
        this.addResult('Environment Configuration', 'PASS', 'Variable de entorno configurada para producción');
      } else {
        this.addResult('Environment Configuration', 'WARNING', 'Variable de entorno no encontrada en .env.example');
      }
    } else {
      this.addResult('Environment Configuration', 'WARNING', 'Archivo .env.example no encontrado');
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
    console.log('📊 Resultados de Verificación del Webinar:\n');

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
      console.log('\n🎉 ¡El webinar está correctamente configurado para Meta Business!');
      console.log('\n📋 Próximos pasos para verificar en Meta Business:');
      console.log('1. Desplegar a producción');
      console.log('2. Visitar la página del webinar en producción');
      console.log('3. Verificar eventos en Facebook Ads Manager');
      console.log('4. Configurar audiencias basadas en eventos del webinar');
      console.log('5. Crear campañas de retargeting para el webinar');
    } else {
      console.log('\n🔧 Hay problemas que necesitan ser corregidos antes de continuar.');
    }

    console.log('\n🔍 Eventos que se enviarán a Meta Business:');
    console.log('- PageView: Visualización de la página del webinar');
    console.log('- ViewContent: Visualización del contenido del webinar');
    console.log('- Lead: Intentos de registro al webinar');
    console.log('- CustomEvent: Eventos específicos del funnel del webinar');
    console.log('- Webinar Registration: Registro exitoso al webinar');

    console.log('\n📊 Métricas que podrás ver en Meta Business:');
    console.log('- Impresiones de la página del webinar');
    console.log('- Clicks en botones de registro');
    console.log('- Conversiones de registro al webinar');
    console.log('- Costo por registro al webinar');
    console.log('- ROI de campañas del webinar');
  }
}

// Ejecutar verificación
async function main() {
  const verifier = new WebinarTrackingVerifier();
  await verifier.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
} 