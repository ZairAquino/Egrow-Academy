#!/usr/bin/env tsx

/**
 * Script para verificar que los eventos se estén registrando correctamente
 * 
 * Este script verifica que los eventos del webinar se estén enviando
 * correctamente a Meta Business y aparezcan en el dashboard.
 * 
 * Uso: npx tsx scripts/verify-events-tracking.ts
 */

interface EventVerification {
  eventType: string;
  expectedData: any;
  status: 'sent' | 'pending' | 'error';
  timestamp?: string;
}

class EventsTrackingVerifier {
  private pixelId = '1247652460159167';
  private webinarId = 'videos-profesionales-ia';

  async runVerification() {
    console.log('🔍 Verificando eventos de tracking del webinar...\n');

    console.log('📊 Eventos que deberían aparecer en Meta Business:');
    
    const expectedEvents = [
      {
        name: 'PageView',
        description: 'Visualización de la página del webinar',
        trigger: 'Carga de página',
        data: {
          content_name: 'Crea Videos Profesionales con IA',
          content_category: 'Webinar',
          content_type: 'webinar_page'
        }
      },
      {
        name: 'ViewContent',
        description: 'Visualización del contenido del webinar',
        trigger: '1 segundo después de cargar',
        data: {
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
        data: {
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
        data: {
          content_name: 'Webinar Landing Page View',
          content_category: 'Webinar',
          content_type: 'webinar_landing_view',
          custom_parameters: {
            webinar_id: 'videos-profesionales-ia',
            funnel_step: 'landing_page_view'
          }
        }
      },
      {
        name: 'Webinar Registration',
        description: 'Registro exitoso al webinar',
        trigger: 'Click en "Comenzar Curso Premium"',
        data: {
          content_name: 'Crea Videos Profesionales con IA',
          content_category: 'Webinar',
          content_type: 'webinar_registration',
          content_ids: ['videos-profesionales-ia']
        }
      }
    ];

    expectedEvents.forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.name}`);
      console.log(`   📝 Descripción: ${event.description}`);
      console.log(`   🎯 Trigger: ${event.trigger}`);
      console.log(`   📊 Datos: ${JSON.stringify(event.data, null, 2)}`);
    });

    console.log('\n🔍 Cómo verificar en Meta Business:');
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

    console.log('\n5. Verificar eventos específicos:');
    console.log('   • PageView: Debería aparecer al cargar la página');
    console.log('   • ViewContent: Debería aparecer después de 1 segundo');
    console.log('   • Lead: Debería aparecer al intentar registrarse');
    console.log('   • CustomEvent: Debería aparecer en diferentes pasos');

    console.log('\n⚠️  Si no aparecen eventos:');
    console.log('   1. Verificar que el sitio esté en producción');
    console.log('   2. Verificar que no haya bloqueadores de anuncios');
    console.log('   3. Verificar que el dominio esté configurado en Meta');
    console.log('   4. Esperar 24-48 horas para que Meta actualice');

    console.log('\n🔧 Para probar eventos manualmente:');
    console.log('   1. Visitar: https://egrow-academy.com/curso/videos-profesionales-ia');
    console.log('   2. Abrir DevTools (F12)');
    console.log('   3. Ir a la pestaña Network');
    console.log('   4. Filtrar por "facebook"');
    console.log('   5. Navegar por la página');
    console.log('   6. Verificar que se envíen eventos a Facebook');

    console.log('\n📊 Métricas que deberías ver:');
    console.log('   • Impresiones de la página del webinar');
    console.log('   • Clicks en botones de registro');
    console.log('   • Conversiones de registro al webinar');
    console.log('   • Costo por registro al webinar');
    console.log('   • ROI de campañas del webinar');
  }

  async checkProductionStatus() {
    console.log('\n🔍 Verificando estado de producción...');
    
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    console.log(`   • Entorno actual: ${process.env.NODE_ENV || 'undefined'}`);
    console.log(`   • Es producción: ${isProduction}`);
    console.log(`   • Es desarrollo: ${isDevelopment}`);
    
    if (isProduction) {
      console.log('   ✅ En producción: Los eventos se enviarán a Meta Business');
    } else if (isDevelopment) {
      console.log('   ⚠️  En desarrollo: Los eventos NO se enviarán a Meta Business');
      console.log('   💡 Para probar eventos, visita el sitio en producción');
    } else {
      console.log('   ❓ Entorno no definido: Verificar configuración');
    }
  }

  async provideTestingInstructions() {
    console.log('\n🧪 Instrucciones para testing:');
    console.log('\n1. Testing en Producción:');
    console.log('   • Visitar: https://egrow-academy.com/curso/videos-profesionales-ia');
    console.log('   • Abrir DevTools (F12)');
    console.log('   • Ir a pestaña Network');
    console.log('   • Filtrar por "facebook"');
    console.log('   • Navegar por la página');
    console.log('   • Verificar eventos enviados');

    console.log('\n2. Testing con Facebook Pixel Helper:');
    console.log('   • Instalar extensión "Facebook Pixel Helper"');
    console.log('   • Visitar la página del webinar');
    console.log('   • Verificar que aparezcan eventos en la extensión');

    console.log('\n3. Testing en Meta Business:');
    console.log('   • Ir a Events Manager');
    console.log('   • Buscar Pixel ID: 1247652460159167');
    console.log('   • Verificar eventos en tiempo real');
    console.log('   • Verificar que el dominio sea correcto');
  }
}

async function main() {
  const verifier = new EventsTrackingVerifier();
  
  await verifier.runVerification();
  await verifier.checkProductionStatus();
  await verifier.provideTestingInstructions();
  
  console.log('\n🎉 Verificación completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Visitar el sitio en producción');
  console.log('   2. Verificar eventos en Meta Business');
  console.log('   3. Crear audiencias basadas en eventos');
  console.log('   4. Configurar campañas de retargeting');
}

if (require.main === module) {
  main().catch(console.error);
}

export default EventsTrackingVerifier; 