import { PrismaClient } from '@prisma/client';

async function syncWebinarsToProduction() {
  console.log('🔄 Sincronizando webinars específicos a producción...');

  try {
    // Conectar a desarrollo
    console.log('🔌 Conectando a desarrollo...');
    const devPrisma = new PrismaClient();
    await devPrisma.$connect();

    // Conectar a producción
    console.log('🔌 Conectando a producción...');
    const prodPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PROD_DATABASE_URL
        }
      }
    });
    await prodPrisma.$connect();

    console.log('✅ Conexiones exitosas\n');

    // Obtener webinars específicos de desarrollo
    console.log('📥 Obteniendo webinars de desarrollo...');
    const devWebinars = await devPrisma.webinar.findMany({
      where: {
        OR: [
          { title: { contains: 'Monetiza con IA' } },
          { title: { contains: 'Marketing Digital' } }
        ]
      }
    });

    console.log(`Encontrados ${devWebinars.length} webinars en desarrollo:`);
    devWebinars.forEach((webinar, index) => {
      console.log(`${index + 1}. ${webinar.title} - ${webinar.dateTime}`);
    });

    // Verificar webinars existentes en producción
    console.log('\n📊 Verificando webinars existentes en producción...');
    const prodWebinars = await prodPrisma.webinar.findMany();
    console.log(`Webinars existentes en producción: ${prodWebinars.length}`);

    // Sincronizar webinars
    console.log('\n🔄 Sincronizando webinars...');
    let createdCount = 0;
    let updatedCount = 0;

    for (const devWebinar of devWebinars) {
      // Buscar si ya existe en producción por título
      const existingWebinar = await prodPrisma.webinar.findFirst({
        where: {
          title: devWebinar.title
        }
      });

      if (existingWebinar) {
        console.log(`⚠️ Webinar "${devWebinar.title}" ya existe en producción`);
        updatedCount++;
      } else {
        // Crear nuevo webinar en producción
        const newWebinar = await prodPrisma.webinar.create({
          data: {
            title: devWebinar.title,
            description: devWebinar.description,
            slug: devWebinar.slug,
            dateTime: devWebinar.dateTime,
            duration: devWebinar.duration,
            maxAttendees: devWebinar.maxAttendees,
            currentAttendees: devWebinar.currentAttendees,
            imageUrl: devWebinar.imageUrl,
            zoomLink: devWebinar.zoomLink,
            status: devWebinar.status,
            category: devWebinar.category,
            instructor: devWebinar.instructor,
            tags: devWebinar.tags,
            isFeatured: devWebinar.isFeatured,
            requiresRegistration: devWebinar.requiresRegistration,
            recordingUrl: devWebinar.recordingUrl,
            materialsUrl: devWebinar.materialsUrl,
            notes: devWebinar.notes
          }
        });
        console.log(`✅ Creado: "${newWebinar.title}"`);
        createdCount++;
      }
    }

    // Verificar resultado final
    console.log('\n📊 Verificando resultado final...');
    const finalProdWebinars = await prodPrisma.webinar.findMany();
    console.log(`Webinars en producción después de sincronización: ${finalProdWebinars.length}`);

    finalProdWebinars.forEach((webinar, index) => {
      console.log(`${index + 1}. ${webinar.title} - ${webinar.dateTime}`);
    });

    await devPrisma.$disconnect();
    await prodPrisma.$disconnect();

    console.log('\n🎉 Sincronización completada');
    console.log(`📈 Resumen:`);
    console.log(`   - Creados: ${createdCount}`);
    console.log(`   - Ya existían: ${updatedCount}`);
    console.log(`   - Total en producción: ${finalProdWebinars.length}`);

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error);
  }
}

syncWebinarsToProduction().catch(console.error); 