#!/usr/bin/env tsx

/**
 * Script para configurar las credenciales de UploadThing
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Configurando credenciales de UploadThing...\n');

async function configureUploadThing() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    
    // Verificar si existe el archivo .env
    if (!fs.existsSync(envPath)) {
      console.log('❌ Archivo .env no encontrado');
      console.log('💡 Ejecuta: copy env.example .env');
      return;
    }

    // Leer el contenido actual
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Credenciales de UploadThing (configurar con tus propias credenciales)
    const uploadThingSecret = process.env.UPLOADTHING_SECRET || 'YOUR_UPLOADTHING_SECRET';
    const uploadThingAppId = process.env.UPLOADTHING_APP_ID || 'YOUR_UPLOADTHING_APP_ID';

    // Reemplazar o agregar las variables de UploadThing
    const uploadThingConfig = `# UploadThing Configuration
UPLOADTHING_SECRET="${uploadThingSecret}"
UPLOADTHING_APP_ID="${uploadThingAppId}"`;

    // Verificar si ya existen las variables
    if (envContent.includes('UPLOADTHING_SECRET')) {
      // Reemplazar las variables existentes
      envContent = envContent.replace(
        /# UploadThing Configuration[\s\S]*?UPLOADTHING_APP_ID="[^"]*"/,
        uploadThingConfig
      );
      console.log('✅ Variables de UploadThing actualizadas');
    } else {
      // Agregar las variables al final
      envContent += '\n\n' + uploadThingConfig;
      console.log('✅ Variables de UploadThing agregadas');
    }

    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, envContent);

    console.log('\n📝 Credenciales configuradas:');
    console.log(`UPLOADTHING_SECRET="${uploadThingSecret}"`);
    console.log(`UPLOADTHING_APP_ID="${uploadThingAppId}"`);

    console.log('\n🚀 Próximos pasos:');
    console.log('1. Reinicia el servidor de desarrollo');
    console.log('2. Ve a http://localhost:3001/admin/video-demo');
    console.log('3. Prueba la funcionalidad de subida de videos');
    console.log('4. Ve a http://localhost:3001/admin/lesson-video-upload');

    console.log('\n🎉 ¡UploadThing configurado exitosamente!');

  } catch (error) {
    console.error('❌ Error al configurar UploadThing:', error);
  }
}

// Ejecutar configuración
configureUploadThing(); 