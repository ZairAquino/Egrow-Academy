import fs from 'fs';
import path from 'path';

async function cleanupLocalResources() {
  console.log('🧹 Iniciando limpieza de recursos locales...');

  const resourcesDir = path.join(process.cwd(), 'public', 'resources');
  
  try {
    // Verificar si el directorio existe
    if (!fs.existsSync(resourcesDir)) {
      console.log('📁 Directorio de recursos no encontrado');
      return;
    }

    // Listar archivos en el directorio
    const files = fs.readdirSync(resourcesDir);
    console.log(`📋 Encontrados ${files.length} archivos en /public/resources/`);

    // Archivos que sabemos que están en UploadThing
    const migratedFiles = [
      'Manual GPT.pdf',
      'Manual GEM.pdf'
    ];

    let deletedCount = 0;
    let totalSizeSaved = 0;

    for (const file of files) {
      if (migratedFiles.includes(file)) {
        const filePath = path.join(resourcesDir, file);
        const stats = fs.statSync(filePath);
        
        try {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Eliminado: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
          deletedCount++;
          totalSizeSaved += stats.size;
        } catch (error) {
          console.error(`❌ Error eliminando ${file}:`, error);
        }
      }
    }

    // Verificar si el directorio está vacío
    const remainingFiles = fs.readdirSync(resourcesDir);
    if (remainingFiles.length === 0) {
      try {
        fs.rmdirSync(resourcesDir);
        console.log('📁 Directorio /public/resources/ eliminado (vacío)');
      } catch (error) {
        console.error('❌ Error eliminando directorio:', error);
      }
    }

    console.log(`\n🎉 Limpieza completada:`);
    console.log(`   📊 Archivos eliminados: ${deletedCount}`);
    console.log(`   💾 Espacio liberado: ${(totalSizeSaved / 1024).toFixed(2)} KB`);
    console.log(`   📁 Archivos restantes: ${remainingFiles.length}`);

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Ejecutar limpieza
cleanupLocalResources(); 