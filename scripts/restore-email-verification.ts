#!/usr/bin/env tsx

/**
 * Script para restaurar la funcionalidad de verificación de email
 * 
 * Uso:
 * npm run restore-email-verification
 * 
 * Este script restaura todos los archivos a su estado original
 * antes de deshabilitar la verificación de email para la presentación.
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔄 Restaurando funcionalidad de verificación de email...');

try {
  // Verificar si existe el tag de backup
  const tagExists = execSync('git tag -l "v1.0.0-backup"', { encoding: 'utf8' }).trim();
  
  if (!tagExists) {
    console.error('❌ No se encontró el tag de backup v1.0.0-backup');
    console.log('💡 Asegúrate de haber creado el backup antes de deshabilitar la verificación');
    process.exit(1);
  }

  console.log('✅ Tag de backup encontrado');

  // Restaurar desde el tag de backup
  console.log('🔄 Restaurando archivos desde el backup...');
  execSync('git checkout v1.0.0-backup -- .', { stdio: 'inherit' });

  console.log('✅ Archivos restaurados exitosamente');
  console.log('');
  console.log('📋 Cambios realizados:');
  console.log('   ✅ Registro: Verificación de email habilitada');
  console.log('   ✅ Login: Verificación de email habilitada');
  console.log('   ✅ Página de verificación: Funcionalidad restaurada');
  console.log('   ✅ API de verificación: Funcionalidad restaurada');
  console.log('   ✅ API de reenvío: Funcionalidad restaurada');
  console.log('');
  console.log('🚀 La verificación de email está ahora habilitada nuevamente');
  console.log('💡 Recuerda configurar las variables de entorno para el envío de emails');

} catch (error) {
  console.error('❌ Error al restaurar:', error);
  process.exit(1);
} 