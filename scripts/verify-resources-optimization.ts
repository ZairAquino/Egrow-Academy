import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function verifyResourcesOptimization() {
  console.log('🔍 Verificando optimización de recursos...\n');

  try {
    // 1. Verificar recursos en base de datos
    const resources = await prisma.resource.findMany({
      where: {
        category: 'WEBINAR'
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        category: true,
        status: true
      }
    });

    console.log('📊 RECURSOS EN BASE DE DATOS:');
    console.log(`   Total: ${resources.length} recursos`);
    
    let uploadThingCount = 0;
    let localCount = 0;
    let noFileCount = 0;

    resources.forEach(resource => {
      if (resource.fileUrl) {
        if (resource.fileUrl.includes('uploadthing.com')) {
          uploadThingCount++;
          console.log(`   ✅ ${resource.title} - UploadThing`);
        } else if (resource.fileUrl.startsWith('/resources/')) {
          localCount++;
          console.log(`   ⚠️  ${resource.title} - Local (${resource.fileUrl})`);
        } else {
          console.log(`   🔗 ${resource.title} - Externa (${resource.fileUrl})`);
        }
      } else {
        noFileCount++;
        console.log(`   ❌ ${resource.title} - Sin archivo`);
      }
    });

    console.log(`\n📈 ESTADÍSTICAS:`);
    console.log(`   UploadThing: ${uploadThingCount}`);
    console.log(`   Local: ${localCount}`);
    console.log(`   Sin archivo: ${noFileCount}`);

    // 2. Verificar archivos locales
    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    console.log('\n📁 ARCHIVOS LOCALES:');
    
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
    } else {
      console.log('   ✅ No hay directorio local (optimizado)');
    }

    // 3. Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    
    if (localCount > 0) {
      console.log(`   🔄 Migrar ${localCount} recursos a UploadThing`);
    }
    
    if (noFileCount > 0) {
      console.log(`   ⚠️  Revisar ${noFileCount} recursos sin archivo`);
    }
    
    if (fs.existsSync(resourcesDir) && fs.readdirSync(resourcesDir).length > 0) {
      console.log('   🧹 Limpiar archivos locales después de migrar');
    }

    if (localCount === 0 && !fs.existsSync(resourcesDir)) {
      console.log('   ✅ Optimización completa!');
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyResourcesOptimization(); 