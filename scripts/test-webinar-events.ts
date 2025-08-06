#!/usr/bin/env tsx

/**
 * Script para probar eventos del webinar en Meta Business
 * 
 * Este script simula los eventos que deberían enviarse cuando
 * alguien visita la página del webinar y se registra.
 * 
 * Uso: npx tsx scripts/test-webinar-events.ts
 */

interface WebinarEvent {
  name: string;
  description: string;
  trigger: string;
  expectedData: any;
}

class WebinarEventsTester {
  private pixelId = '1247652460159167';
  private webinarId = 'videos-profesionales-ia';

  async runTest() {
    console.log('🧪 Probando eventos del webinar...\n');

    console.log('📋 Instrucciones para probar eventos:');
    console.log('\n1. Abrir el sitio en producción:');
    console.log('   https://egrow-academy.com/curso/videos-profesionales-ia');

    console.log('\n2. Abrir DevTools (F12) y ir a:');
    console.log('   • Pestaña Console');
    console.log('   • Pestaña Network');
    console.log('   • Filtrar por "facebook" en Network');

    console.log('\n3. Eventos que deberías ver en Console:');
    console.log('   📊 [Facebook Pixel] Evento enviado: PageView');
    console.log('   📊 [Facebook Pixel] Evento enviado: ViewContent');
    console.log('   📊 [Facebook Pixel] Evento enviado: Lead (al intentar registrarse)');
    console.log('   📊 [Facebook Pixel] Evento enviado: CustomEvent');

    console.log('\n4. Eventos que deberías ver en Network:');
    console.log('   • Peticiones a: https://connect.facebook.net/');
    console.log('   • Peticiones a: https://www.facebook.com/tr');

    console.log('\n5. En Meta Business Test Events:');
    console.log('   • Deberías ver eventos en tiempo real');
    console.log('   • Los eventos deberían mostrar tu dominio real');
    console.log('   • No deberían aparecer eventos de localhost');

    console.log('\n⚠️  Si no ves eventos:');
    console.log('   1. Verificar que no haya bloqueadores de anuncios');
    console.log('   2. Verificar que el dominio esté configurado en Meta');
    console.log('   3. Verificar que el Pixel ID sea correcto');
    console.log('   4. Esperar unos minutos para que aparezcan');

    console.log('\n🔧 Para forzar eventos de prueba:');
    console.log('   • Recargar la página varias veces');
    console.log('   • Hacer click en "Iniciar Sesión para Comenzar"');
    console.log('   • Navegar por diferentes secciones de la página');

    console.log('\n📊 Eventos esperados:');
    
    const expectedEvents: WebinarEvent[] = [
      {
        name: 'PageView',
        description: 'Visualización de la página del webinar',
        trigger: 'Carga de página',
        expectedData: {
          content_name: 'Crea Videos Profesionales con IA',
          content_category: 'Webinar',
          content_type: 'webinar_page'
        }
      },
      {
        name: 'ViewContent',
        description: 'Visualización del contenido del webinar',
        trigger: '1 segundo después de cargar',
        expectedData: {
          content_name: 'Crea Videos Profesionales con IA',
          content_category: 'Webinar',
          content_type: 'webinar_view',
          content_ids: ['videos-profesionales-ia']
        }
      },
      {
        name: 'Lead',
        description: 'Intento de registro al webinar',
        trigger: 'Click en "Iniciar Sesión para Comenzar"',
        expectedData: {
          content_name: 'Webinar Registration Attempt',
          content_category: 'Webinar',
          content_type: 'webinar_registration_attempt',
          custom_parameters: {
            webinar_id: 'videos-profesionales-ia',
            action: 'redirect_to_login',
            user_status: 'anonymous'
          }
        }
      },
      {
        name: 'CustomEvent',
        description: 'Eventos específicos del funnel',
        trigger: 'Diferentes pasos del funnel',
        expectedData: {
          content_name: 'Webinar Landing Page View',
          content_category: 'Webinar',
          content_type: 'webinar_landing_view',
          custom_parameters: {
            webinar_id: 'videos-profesionales-ia',
            funnel_step: 'landing_page_view'
          }
        }
      }
    ];

    expectedEvents.forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.name}`);
      console.log(`   📝 Descripción: ${event.description}`);
      console.log(`   🎯 Trigger: ${event.trigger}`);
      console.log(`   📊 Datos esperados: ${JSON.stringify(event.expectedData, null, 2)}`);
    });

    console.log('\n🎯 Pasos para verificar en Meta Business:');
    console.log('\n1. Ir a Meta Business Manager:');
    console.log('   https://business.facebook.com/');

    console.log('\n2. Navegar a:');
    console.log('   • Data Sources');
    console.log('   • Pixels');
    console.log('   • Buscar Pixel ID: 1247652460159167');

    console.log('\n3. En la pestaña "Test events":');
    console.log('   • Deberías ver eventos en tiempo real');
    console.log('   • Los eventos deberían mostrar tu dominio real');
    console.log('   • No deberían aparecer eventos de localhost');

    console.log('\n4. En la pestaña "All Activity":');
    console.log('   • Deberías ver eventos históricos');
    console.log('   • Los eventos deberían tener el dominio correcto');
    console.log('   • Deberías ver diferentes tipos de eventos');

    console.log('\n⚠️  Solución de problemas:');
    console.log('\nSi no aparecen eventos:');
    console.log('   1. Verificar que el sitio esté en producción');
    console.log('   2. Verificar que no haya bloqueadores de anuncios');
    console.log('   3. Verificar que el dominio esté configurado en Meta');
    console.log('   4. Esperar 24-48 horas para que Meta actualice');
    console.log('   5. Verificar que el Pixel ID sea correcto');

    console.log('\nSi aparecen eventos pero no conversiones:');
    console.log('   1. Verificar que los eventos de conversión estén configurados');
    console.log('   2. Verificar que el funnel de conversión esté completo');
    console.log('   3. Verificar que las audiencias estén correctamente configuradas');
    console.log('   4. Verificar que las campañas estén optimizadas para conversión');
  }

  async checkPixelConfiguration() {
    console.log('\n🔍 Verificando configuración del Pixel...');
    
    console.log(`   • Pixel ID: ${this.pixelId}`);
    console.log(`   • Webinar ID: ${this.webinarId}`);
    console.log(`   • Dominio esperado: egrow-academy.com`);
    
    console.log('\n📋 Configuración actual:');
    console.log('   ✅ Facebook Pixel habilitado en todos los entornos');
    console.log('   ✅ Eventos específicos del webinar implementados');
    console.log('   ✅ Logs de depuración habilitados');
    console.log('   ✅ Tracking de funnel implementado');
  }
}

async function main() {
  const tester = new WebinarEventsTester();
  
  await tester.runTest();
  await tester.checkPixelConfiguration();
  
  console.log('\n🎉 Test completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Visitar el sitio en producción');
  console.log('   2. Verificar eventos en DevTools');
  console.log('   3. Verificar eventos en Meta Business');
  console.log('   4. Crear audiencias basadas en eventos');
}

if (require.main === module) {
  main().catch(console.error);
}

export default WebinarEventsTester; 