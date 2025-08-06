#!/usr/bin/env tsx

/**
 * Script para diagnosticar problemas del Facebook Pixel
 * 
 * Este script ayuda a identificar por qué los eventos no aparecen
 * en Meta Business Test Events.
 * 
 * Uso: npx tsx scripts/debug-facebook-pixel.ts
 */

class FacebookPixelDebugger {
  private pixelId = '1247652460159167';
  private webinarUrl = 'https://egrowacademy.com/webinar/videos-profesionales-ia';

  async runDiagnostic() {
    console.log('🔍 Diagnosticando Facebook Pixel...\n');

    console.log('📋 Información del Pixel:');
    console.log(`   • Pixel ID: ${this.pixelId}`);
    console.log(`   • URL del webinar: ${this.webinarUrl}`);
    console.log(`   • Dominio: egrowacademy.com`);

    console.log('\n🎯 Pasos para diagnosticar:');
    console.log('\n1. Verificar que el Pixel esté cargado:');
    console.log('   • Abrir: https://egrowacademy.com/webinar/videos-profesionales-ia');
    console.log('   • Abrir DevTools (F12)');
    console.log('   • En Console, escribir: typeof fbq');
    console.log('   • Debería mostrar: "function"');

    console.log('\n2. Verificar eventos básicos:');
    console.log('   • En Console, escribir: fbq("track", "PageView")');
    console.log('   • Debería aparecer un log de evento enviado');

    console.log('\n3. Verificar peticiones a Facebook:');
    console.log('   • Ir a pestaña Network');
    console.log('   • Filtrar por "facebook"');
    console.log('   • Recargar la página');
    console.log('   • Deberías ver peticiones a:');
    console.log('     - https://connect.facebook.net/');
    console.log('     - https://www.facebook.com/tr');

    console.log('\n4. Verificar configuración en Meta Business:');
    console.log('   • Ir a: https://business.facebook.com/');
    console.log('   • Data Sources → Pixels');
    console.log('   • Buscar Pixel ID: 1247652460159167');
    console.log('   • Verificar que el dominio esté configurado');

    console.log('\n⚠️  Posibles problemas:');

    console.log('\n🔴 Problema 1: Pixel no cargado');
    console.log('   Síntomas: typeof fbq muestra "undefined"');
    console.log('   Solución: Verificar que el script de Facebook esté en el HTML');

    console.log('\n🔴 Problema 2: Bloqueador de anuncios');
    console.log('   Síntomas: No hay peticiones a facebook.com');
    console.log('   Solución: Deshabilitar bloqueadores temporalmente');

    console.log('\n🔴 Problema 3: Dominio no configurado');
    console.log('   Síntomas: Eventos aparecen pero no en Test Events');
    console.log('   Solución: Agregar dominio en Meta Business');

    console.log('\n🔴 Problema 4: Pixel ID incorrecto');
    console.log('   Síntomas: Eventos no llegan a Meta Business');
    console.log('   Solución: Verificar Pixel ID en el código');

    console.log('\n🔴 Problema 5: Entorno de desarrollo');
    console.log('   Síntomas: Eventos solo funcionan en localhost');
    console.log('   Solución: Verificar que esté en producción');

    console.log('\n🔧 Comandos para probar manualmente:');
    console.log('\n1. Probar Pixel básico:');
    console.log('   fbq("track", "PageView")');

    console.log('\n2. Probar evento personalizado:');
    console.log('   fbq("track", "CustomEvent", {content_name: "Test"})');

    console.log('\n3. Probar evento de conversión:');
    console.log('   fbq("track", "Lead", {content_name: "Test Lead"})');

    console.log('\n4. Verificar configuración del Pixel:');
    console.log('   fbq("init", "1247652460159167")');

    console.log('\n📊 Verificar logs en Console:');
    console.log('   • Deberías ver: "📊 [Facebook Pixel] Evento enviado: ..."');
    console.log('   • Deberías ver: "✅ [Facebook Pixel] Evento ... procesado correctamente"');

    console.log('\n🎯 URL específica para test:');
    console.log(`   ${this.webinarUrl}`);
    console.log('   Esta es la URL que debes usar en Meta Business Test Events');

    console.log('\n⚠️  IMPORTANTE:');
    console.log('   • Usar la URL exacta: https://egrowacademy.com/webinar/videos-profesionales-ia');
    console.log('   • No usar localhost o dominios de desarrollo');
    console.log('   • Esperar 1-2 minutos después de cargar la página');
    console.log('   • Verificar que no haya bloqueadores de anuncios activos');
  }

  async checkCommonIssues() {
    console.log('\n🔍 Verificando problemas comunes...');
    
    console.log('\n1. Verificar que el sitio esté en producción:');
    console.log('   • URL debe ser: https://egrowacademy.com/');
    console.log('   • No debe ser: http://localhost:3000/');
    
    console.log('\n2. Verificar bloqueadores de anuncios:');
    console.log('   • Deshabilitar uBlock Origin, AdBlock, etc.');
    console.log('   • Verificar en modo incógnito');
    
    console.log('\n3. Verificar configuración de Meta Business:');
    console.log('   • Dominio debe estar agregado: egrowacademy.com');
    console.log('   • Pixel ID debe ser correcto: 1247652460159167');
    
    console.log('\n4. Verificar timing de eventos:');
    console.log('   • Los eventos pueden tardar 1-2 minutos en aparecer');
    console.log('   • Recargar la página varias veces');
    console.log('   • Hacer click en botones para generar más eventos');
  }
}

async function main() {
  const debuggerTool = new FacebookPixelDebugger();
  
  await debuggerTool.runDiagnostic();
  await debuggerTool.checkCommonIssues();
  
  console.log('\n🎉 Diagnóstico completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Seguir los pasos de diagnóstico');
  console.log('   2. Verificar cada punto mencionado');
  console.log('   3. Probar con la URL específica del webinar');
  console.log('   4. Contactar soporte si persisten problemas');
}

if (require.main === module) {
  main().catch(console.error);
}

export default FacebookPixelDebugger; 