#!/usr/bin/env tsx

/**
 * Script para configurar el dominio correcto en Meta Business
 * 
 * Este script ayuda a verificar y configurar el dominio correcto
 * para que Meta Business reconozca los eventos desde el sitio web real.
 * 
 * Uso: npx tsx scripts/configure-meta-business-domain.ts
 */

interface DomainConfig {
  pixelId: string;
  currentDomain: string;
  productionDomain: string;
  status: 'active' | 'pending' | 'error';
}

class MetaBusinessDomainConfigurator {
  private pixelId = '1247652460159167';
  private productionDomain = 'egrow-academy.com'; // Cambiar por tu dominio real

  async runConfiguration() {
    console.log('🔧 Configurando dominio en Meta Business...\n');

    console.log('📋 Información del Pixel:');
    console.log(`   • Pixel ID: ${this.pixelId}`);
    console.log(`   • Dominio de producción: ${this.productionDomain}`);
    console.log(`   • Dominio actual en Meta: localhost (desarrollo)`);

    console.log('\n🎯 Pasos para configurar el dominio correcto:');
    console.log('\n1. Ir a Meta Business Manager:');
    console.log('   https://business.facebook.com/');

    console.log('\n2. Navegar a:');
    console.log('   • Data Sources');
    console.log('   • Pixels');
    console.log('   • Buscar Pixel ID: 1247652460159167');

    console.log('\n3. En la configuración del Pixel:');
    console.log('   • Ir a "Settings"');
    console.log('   • Buscar "Domains" o "Website URLs"');
    console.log('   • Agregar tu dominio de producción');

    console.log('\n4. Dominios que debes agregar:');
    console.log(`   • https://${this.productionDomain}`);
    console.log(`   • https://www.${this.productionDomain}`);
    console.log('   • https://egrow-academy.vercel.app (si usas Vercel)');

    console.log('\n5. Verificar configuración:');
    console.log('   • Esperar 24-48 horas para que Meta actualice');
    console.log('   • Los eventos deberían aparecer con el dominio correcto');

    console.log('\n⚠️  IMPORTANTE:');
    console.log('   • El Pixel ahora solo funciona en producción');
    console.log('   • Los eventos de localhost ya no se enviarán');
    console.log('   • Solo verás eventos desde tu dominio real');

    console.log('\n🔍 Para verificar que funciona:');
    console.log('   1. Visitar tu sitio en producción');
    console.log('   2. Ir a la página del webinar');
    console.log('   3. Verificar en Meta Business que aparezcan eventos');
    console.log('   4. El dominio debería mostrar tu URL real, no localhost');

    console.log('\n📞 Si necesitas ayuda:');
    console.log('   • Revisar logs en DevTools (F12)');
    console.log('   • Verificar que no haya bloqueadores de anuncios');
    console.log('   • Contactar soporte de Meta si persisten problemas');
  }

  async checkCurrentConfiguration() {
    console.log('\n🔍 Verificando configuración actual...');
    
    // Verificar si estamos en desarrollo o producción
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    console.log(`   • Entorno actual: ${process.env.NODE_ENV}`);
    console.log(`   • Es desarrollo: ${isDevelopment}`);
    console.log(`   • Es producción: ${isProduction}`);
    
    if (isDevelopment) {
      console.log('   ⚠️  En desarrollo: El Pixel está deshabilitado');
      console.log('   ✅ Los eventos no se enviarán a Meta Business');
    } else if (isProduction) {
      console.log('   ✅ En producción: El Pixel está habilitado');
      console.log('   📊 Los eventos se enviarán a Meta Business');
    }
  }
}

async function main() {
  const configurator = new MetaBusinessDomainConfigurator();
  
  await configurator.runConfiguration();
  await configurator.checkCurrentConfiguration();
  
  console.log('\n🎉 Configuración completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Configurar dominios en Meta Business');
  console.log('   2. Desplegar cambios a producción');
  console.log('   3. Verificar eventos en Meta Business');
  console.log('   4. Crear audiencias y campañas');
}

if (require.main === module) {
  main().catch(console.error);
}

export default MetaBusinessDomainConfigurator; 