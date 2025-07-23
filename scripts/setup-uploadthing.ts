#!/usr/bin/env tsx

/**
 * Script para configurar UploadThing
 * 
 * Este script ayuda a:
 * 1. Verificar la configuración actual
 * 2. Proporcionar instrucciones para obtener credenciales
 * 3. Configurar variables de entorno
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Configuración de UploadThing para eGrow Academy\n');

async function setupUploadThing() {
  try {
    // 1. Verificar configuración actual
    console.log('📋 1. Verificando configuración actual...');
    
    const envPath = path.join(process.cwd(), '.env');
    const envExists = fs.existsSync(envPath);
    
    if (envExists) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const hasUploadThingSecret = envContent.includes('UPLOADTHING_SECRET');
      const hasUploadThingAppId = envContent.includes('UPLOADTHING_APP_ID');
      
      if (hasUploadThingSecret && hasUploadThingAppId) {
        console.log('✅ Variables de UploadThing ya configuradas en .env');
      } else {
        console.log('❌ Variables de UploadThing faltantes en .env');
      }
    } else {
      console.log('❌ Archivo .env no encontrado');
    }

    // 2. Verificar archivos de configuración
    console.log('\n📋 2. Verificando archivos de configuración...');
    
    const uploadThingConfigPath = path.join(process.cwd(), 'src/lib/uploadthing.ts');
    const uploadThingConfigExists = fs.existsSync(uploadThingConfigPath);
    
    if (uploadThingConfigExists) {
      console.log('✅ Configuración de UploadThing encontrada');
      
      const configContent = fs.readFileSync(uploadThingConfigPath, 'utf-8');
      const hasCourseVideoEndpoint = configContent.includes('courseVideo');
      
      if (hasCourseVideoEndpoint) {
        console.log('✅ Endpoint courseVideo configurado');
      } else {
        console.log('❌ Endpoint courseVideo no encontrado');
      }
    } else {
      console.log('❌ Configuración de UploadThing no encontrada');
    }

    // 3. Instrucciones para configurar UploadThing
    console.log('\n📋 3. Instrucciones para configurar UploadThing:');
    console.log('\n🔧 Pasos para obtener credenciales:');
    console.log('1. Ve a https://uploadthing.com');
    console.log('2. Crea una cuenta o inicia sesión');
    console.log('3. Crea un nuevo proyecto');
    console.log('4. Configura tu servicio de almacenamiento:');
    console.log('   - AWS S3 (recomendado para producción)');
    console.log('   - Cloudflare R2 (alternativa económica)');
    console.log('   - Local (solo para desarrollo)');
    console.log('5. Copia las credenciales generadas');

    console.log('\n📝 Variables que necesitas agregar a tu archivo .env:');
    console.log('UPLOADTHING_SECRET="sk_live_..."');
    console.log('UPLOADTHING_APP_ID="..."');

    console.log('\n🔗 URLs de configuración:');
    console.log('- Dashboard: https://uploadthing.com/dashboard');
    console.log('- Documentación: https://docs.uploadthing.com');
    console.log('- GitHub: https://github.com/pingdotgg/uploadthing');

    // 4. Verificar si necesitamos crear el archivo .env
    if (!envExists) {
      console.log('\n📋 4. Creando archivo .env de ejemplo...');
      
      const envExamplePath = path.join(process.cwd(), 'env.example');
      if (fs.existsSync(envExamplePath)) {
        const envExampleContent = fs.readFileSync(envExamplePath, 'utf-8');
        fs.writeFileSync(envPath, envExampleContent);
        console.log('✅ Archivo .env creado desde env.example');
        console.log('⚠️  Recuerda agregar tus credenciales reales de UploadThing');
      } else {
        console.log('❌ No se pudo crear .env - env.example no encontrado');
      }
    }

    // 5. Verificar configuración de Next.js
    console.log('\n📋 5. Verificando configuración de Next.js...');
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const nextConfigExists = fs.existsSync(nextConfigPath);
    
    if (nextConfigExists) {
      const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');
      const hasUploadThingConfig = nextConfigContent.includes('uploadthing');
      
      if (hasUploadThingConfig) {
        console.log('✅ UploadThing configurado en next.config.ts');
      } else {
        console.log('❌ UploadThing no configurado en next.config.ts');
        console.log('💡 Agrega la configuración de UploadThing a next.config.ts');
      }
    } else {
      console.log('❌ next.config.ts no encontrado');
    }

    console.log('\n🎉 Verificación de configuración completada');
    console.log('\n📝 Resumen de acciones necesarias:');
    console.log('1. ✅ Obtener credenciales de UploadThing');
    console.log('2. ✅ Agregar variables a .env');
    console.log('3. ✅ Verificar configuración de Next.js');
    console.log('4. ✅ Probar subida de archivos');

    console.log('\n🚀 Próximos pasos:');
    console.log('1. Configura tus credenciales en .env');
    console.log('2. Reinicia el servidor de desarrollo');
    console.log('3. Ve a /admin/lesson-video-upload para probar');
    console.log('4. Sube un video de prueba');
    console.log('5. Verifica que se reproduzca correctamente');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
  }
}

// Ejecutar configuración
setupUploadThing(); 