#!/usr/bin/env tsx

/**
 * Script para decodificar el token de UploadThing y obtener el App ID
 */

console.log('🔍 Decodificando token de UploadThing...\n');

function decodeUploadThingToken() {
  try {
    // El token que copiaste
    const token = 'eyJhcGlLZXkiOiJza19saXZlXzg0YzIxMTU3NWY1ZmMzODFkMGZlODdkZGNmOWZlYWQzYzA1ODhjM2ZiNTA5YTA2Yzc4MjVjZWI4N2RiM2EyNWQiLCJhcHBJZCI6IjNvMHAxbHpqNG4iLCJyZWdpb25zIjpbInNlYTEiXX0=';
    
    // Decodificar base64
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    
    console.log('📝 Token decodificado:');
    console.log(JSON.stringify(parsed, null, 2));
    
    console.log('\n🔑 Información extraída:');
    console.log(`API Key: ${parsed.apiKey}`);
    console.log(`App ID: ${parsed.appId}`);
    console.log(`Regions: ${parsed.regions.join(', ')}`);
    
    console.log('\n📋 Variables para .env:');
    console.log(`UPLOADTHING_SECRET="${parsed.apiKey}"`);
    console.log(`UPLOADTHING_APP_ID="${parsed.appId}"`);
    
    console.log('\n✅ El App ID es:', parsed.appId);
    
  } catch (error) {
    console.error('❌ Error al decodificar el token:', error);
  }
}

// Ejecutar decodificación
decodeUploadThingToken(); 