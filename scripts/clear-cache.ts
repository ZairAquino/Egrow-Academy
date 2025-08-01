#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

async function clearCache() {
  console.log('🧹 Limpiando caché de Next.js...\n');

  // Directorios a limpiar
  const dirsToClean = [
    '.next',
    'node_modules/.cache',
  ];

  for (const dir of dirsToClean) {
    const fullPath = join(process.cwd(), dir);
    if (existsSync(fullPath)) {
      console.log(`Eliminando ${dir}...`);
      try {
        await rm(fullPath, { recursive: true, force: true });
        console.log(`✅ ${dir} eliminado`);
      } catch (error) {
        console.error(`❌ Error eliminando ${dir}:`, error);
      }
    } else {
      console.log(`⏭️  ${dir} no existe, saltando...`);
    }
  }

  console.log('\n📦 Reinstalando dependencias...');
  try {
    await execAsync('npm install');
    console.log('✅ Dependencias reinstaladas');
  } catch (error) {
    console.error('❌ Error reinstalando dependencias:', error);
  }

  console.log('\n✨ Caché limpiado exitosamente');
  console.log('\n💡 Sugerencias:');
  console.log('1. Reinicia el servidor de desarrollo: npm run dev');
  console.log('2. Limpia el caché del navegador o abre en modo incógnito');
  console.log('3. Si usas Chrome DevTools, deshabilita el caché en la pestaña Network');
}

clearCache().catch(console.error);