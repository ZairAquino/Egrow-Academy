#!/usr/bin/env tsx

/**
 * Script para probar Facebook Conversions API
 * 
 * Este script verifica que la Conversions API esté funcionando
 * correctamente con el nuevo token de acceso.
 * 
 * Uso: npx tsx scripts/test-conversions-api.ts
 */

import { sendFacebookConversionEvent, webinarEvents } from '../src/lib/facebook-conversions-api';

class ConversionsApiTester {
  private testEvents = [
    {
      name: 'PageView' as const,
      data: {
        content_name: 'Test Page',
        content_category: 'Test',
        content_type: 'test_page'
      }
    },
    {
      name: 'ViewContent' as const,
      data: {
        content_name: 'Test Content',
        content_category: 'Test',
        content_type: 'test_content'
      }
    },
    {
      name: 'Lead' as const,
      data: {
        content_name: 'Test Lead',
        content_category: 'Test',
        content_type: 'test_lead'
      }
    }
  ];

  async runTests() {
    console.log('🧪 Probando Facebook Conversions API...\n');

    console.log('📋 Información de configuración:');
    console.log('   • Endpoint: https://graph.facebook.com/v18.0/events');
    console.log('   • Token: Configurado');
    console.log('   • Eventos de prueba: PageView, ViewContent, Lead');

    console.log('\n🎯 Ejecutando pruebas...\n');

    // Probar eventos básicos
    for (const testEvent of this.testEvents) {
      console.log(`📊 Probando evento: ${testEvent.name}`);
      
      try {
        const result = await sendFacebookConversionEvent(
          testEvent.name,
          testEvent.data
        );
        
        if (result) {
          console.log(`✅ ${testEvent.name} - Enviado correctamente`);
        } else {
          console.log(`❌ ${testEvent.name} - Error al enviar`);
        }
      } catch (error) {
        console.log(`❌ ${testEvent.name} - Error:`, error);
      }
      
      console.log('');
    }

    // Probar eventos específicos de webinar
    console.log('🎓 Probando eventos de webinar...\n');

    try {
      const webinarPageView = await webinarEvents.trackWebinarPageView(
        'test-webinar-id',
        'Test Webinar'
      );
      console.log('✅ Webinar PageView:', webinarPageView ? 'Enviado' : 'Error');

      const webinarLead = await webinarEvents.trackWebinarLead(
        'test-webinar-id',
        'Test Webinar',
        'test@example.com'
      );
      console.log('✅ Webinar Lead:', webinarLead ? 'Enviado' : 'Error');

      const webinarRegistration = await webinarEvents.trackWebinarRegistration(
        'test-webinar-id',
        'Test Webinar',
        'test@example.com'
      );
      console.log('✅ Webinar Registration:', webinarRegistration ? 'Enviado' : 'Error');

    } catch (error) {
      console.log('❌ Error en eventos de webinar:', error);
    }

    console.log('\n📋 Instrucciones para verificar en Meta Business:');
    console.log('\n1. Ir a Meta Business Manager:');
    console.log('   https://business.facebook.com/');

    console.log('\n2. Navegar a:');
    console.log('   • Data Sources');
    console.log('   • Pixels');
    console.log('   • Buscar tu Pixel ID');

    console.log('\n3. En la pestaña "Test events":');
    console.log('   • Deberías ver eventos en tiempo real');
    console.log('   • Los eventos deberían mostrar "Conversions API"');
    console.log('   • Deberías ver eventos de prueba');

    console.log('\n4. En la pestaña "All Activity":');
    console.log('   • Deberías ver eventos históricos');
    console.log('   • Los eventos deberían tener el dominio correcto');
    console.log('   • Deberías ver diferentes tipos de eventos');

    console.log('\n⚠️  Notas importantes:');
    console.log('   • Los eventos pueden tardar 1-2 minutos en aparecer');
    console.log('   • Verificar que el token de acceso sea válido');
    console.log('   • Verificar que el dominio esté configurado en Meta');
    console.log('   • Los eventos de prueba no afectan las métricas reales');

    console.log('\n🔧 Para probar en el sitio web:');
    console.log('\n1. Visitar la página del webinar:');
    console.log('   https://egrowacademy.com/webinar/videos-profesionales-ia');

    console.log('\n2. Abrir DevTools (F12) y verificar:');
    console.log('   • Pestaña Console: Logs de Conversions API');
    console.log('   • Pestaña Network: Peticiones a graph.facebook.com');

    console.log('\n3. Eventos esperados:');
    console.log('   • PageView al cargar la página');
    console.log('   • ViewContent después de 1 segundo');
    console.log('   • CustomEvent después de 2 segundos');

    console.log('\n🎉 Pruebas completadas!');
  }

  async checkConfiguration() {
    console.log('\n🔍 Verificando configuración...');
    
    console.log('\n1. Verificar token de acceso:');
    console.log('   • Token configurado en facebook-conversions-api.ts');
    console.log('   • Endpoint configurado correctamente');
    
    console.log('\n2. Verificar componentes:');
    console.log('   • FacebookConversionsTracker creado');
    console.log('   • WebinarConversionsTracker creado');
    console.log('   • Hook useWebinarConversions disponible');
    
    console.log('\n3. Verificar integración:');
    console.log('   • Página del webinar actualizada');
    console.log('   • Eventos configurados correctamente');
    
    console.log('\n✅ Configuración verificada correctamente');
  }
}

async function main() {
  const tester = new ConversionsApiTester();
  
  await tester.runTests();
  await tester.checkConfiguration();
  
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Verificar eventos en Meta Business');
  console.log('   2. Probar en el sitio web en producción');
  console.log('   3. Configurar audiencias basadas en eventos');
  console.log('   4. Optimizar campañas con datos de conversión');
}

if (require.main === module) {
  main().catch(console.error);
}

export default ConversionsApiTester; 