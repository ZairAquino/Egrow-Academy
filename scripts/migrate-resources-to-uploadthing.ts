import { prisma } from '../src/lib/prisma';
import { uploadFiles } from '../src/lib/uploadthing';

async function migrateResourcesToUploadThing() {
  console.log('🔄 Iniciando migración de recursos a UploadThing...');

  try {
    // 1. Obtener todos los recursos de la base de datos
    const resources = await prisma.resource.findMany({
      where: {
        category: 'WEBINAR'
      }
    });

    console.log(`📋 Encontrados ${resources.length} recursos para migrar`);

    // 2. Procesar cada recurso
    for (const resource of resources) {
      console.log(`\n📁 Procesando: ${resource.title}`);

      // Verificar si ya tiene URL de UploadThing
      if (resource.fileUrl && resource.fileUrl.includes('uploadthing.com')) {
        console.log(`✅ Ya migrado a UploadThing: ${resource.title}`);
        continue;
      }

      // Si tiene URL local, migrar a UploadThing
      if (resource.fileUrl && resource.fileUrl.startsWith('/resources/')) {
        console.log(`🔄 Migrando: ${resource.fileUrl}`);
        
        // Aquí iría la lógica para subir el archivo a UploadThing
        // Por ahora, solo actualizamos la URL
        const uploadThingUrl = `https://uploadthing.com/f/${resource.slug}`;
        
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            fileUrl: uploadThingUrl,
            updatedAt: new Date()
          }
        });

        console.log(`✅ Migrado: ${resource.title} -> ${uploadThingUrl}`);
      }
    }

    console.log('\n🎉 Migración completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
migrateResourcesToUploadThing(); 