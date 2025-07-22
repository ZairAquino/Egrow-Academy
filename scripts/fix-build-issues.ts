#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

console.log('🔧 Iniciando limpieza y reparación del proyecto...');

try {
  // 1. Limpiar caché de Next.js
  console.log('📦 Limpiando caché de Next.js...');
  if (existsSync('.next')) {
    rmSync('.next', { recursive: true, force: true });
    console.log('✅ Caché de Next.js eliminada');
  }

  // 2. Limpiar node_modules si hay problemas
  console.log('🗂️ Verificando node_modules...');
  if (existsSync('node_modules')) {
    console.log('⚠️ node_modules existe. Si hay problemas, elimínalo manualmente y ejecuta npm install');
  }

  // 3. Limpiar caché de npm
  console.log('🧹 Limpiando caché de npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // 4. Regenerar Prisma
  console.log('🔄 Regenerando cliente Prisma...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente Prisma regenerado');
  } catch (error) {
    console.log('⚠️ Error regenerando Prisma. Intentando limpiar y regenerar...');
    
    // Intentar eliminar solo la carpeta .prisma
    const prismaPath = join('node_modules', '.prisma');
    if (existsSync(prismaPath)) {
      try {
        rmSync(prismaPath, { recursive: true, force: true });
        console.log('✅ Carpeta .prisma eliminada');
      } catch (e) {
        console.log('⚠️ No se pudo eliminar .prisma. Elimina node_modules manualmente.');
      }
    }
  }

  // 5. Verificar TypeScript
  console.log('🔍 Verificando configuración de TypeScript...');
  try {
    execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
    console.log('✅ TypeScript sin errores');
  } catch (error) {
    console.log('❌ Errores de TypeScript encontrados');
  }

  // 6. Verificar ESLint
  console.log('🔍 Verificando ESLint...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ ESLint sin errores');
  } catch (error) {
    console.log('⚠️ Advertencias de ESLint encontradas');
  }

  console.log('\n🎉 Limpieza completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si hay problemas con node_modules, elimínalo manualmente');
  console.log('2. Ejecuta: npm install');
  console.log('3. Ejecuta: npm run build');
  console.log('4. Si persisten errores, verifica las variables de entorno');

} catch (error) {
  console.error('❌ Error durante la limpieza:', error);
  process.exit(1);
} 