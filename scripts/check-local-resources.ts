import fs from 'fs';
import path from 'path';

async function checkLocalResources() {
  console.log('🔍 Verificando recursos locales...\n');

  try {
    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    
    console.log('📁 ARCHIVOS LOCALES:');
    
    if (fs.existsSync(resourcesDir)) {
      const files = fs.readdirSync(resourcesDir);
      console.log(`   Encontrados: ${files.length} archivos`);
      
      let totalSize = 0;
      files.forEach(file => {
        const filePath = path.join(resourcesDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        console.log(`   📄 ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
      
      console.log(`   💾 Tamaño total: ${(totalSize / 1024).toFixed(2)} KB`);
      
      console.log('\n💡 RECOMENDACIONES:');
      console.log('   🔄 Estos archivos deberían estar en UploadThing');
      console.log('   🧹 Después de migrar, eliminar archivos locales');
      console.log('   📊 Esto liberará espacio en el repositorio');
      
    } else {
      console.log('   ✅ No hay directorio local (optimizado)');
    }

    // Verificar si hay referencias en el código
    console.log('\n🔍 BUSCANDO REFERENCIAS EN EL CÓDIGO:');
    
    const searchPaths = [
      'src/app/resources',
      'src/components/resources',
      'src/hooks'
    ];
    
    let foundReferences = 0;
    
    for (const searchPath of searchPaths) {
      const fullPath = path.join(process.cwd(), searchPath);
      if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath, { recursive: true });
        for (const file of files) {
          if (typeof file === 'string' && file.endsWith('.tsx')) {
            const filePath = path.join(fullPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('/resources/')) {
              console.log(`   📄 ${file} - Contiene referencias locales`);
              foundReferences++;
            }
          }
        }
      }
    }
    
    if (foundReferences === 0) {
      console.log('   ✅ No se encontraron referencias locales');
    } else {
      console.log(`   ⚠️  Encontradas ${foundReferences} referencias locales`);
      console.log('   🔄 Actualizar referencias a UploadThing');
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  }
}

// Ejecutar verificación
checkLocalResources(); 