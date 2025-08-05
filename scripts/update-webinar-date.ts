import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWebinarDate() {
  try {
    console.log('🔄 Actualizando fecha del webinar "Monetiza con IA"...');

    // Obtener la fecha actual
    const now = new Date();
    
    // Crear la fecha del webinar para hoy a las 4:00 PM hora de México
    // 4:00 PM México = 22:00 UTC (4 + 6 = 10, pero como es PM, 16 + 6 = 22)
    const utcDate = new Date();
    utcDate.setUTCHours(22, 0, 0, 0); // 22:00 UTC = 4:00 PM México

    console.log('📅 Fecha actual (México):', now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('📅 Nueva fecha del webinar (UTC):', utcDate.toISOString());
    console.log('📅 Nueva fecha del webinar (México):', utcDate.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));

    // Buscar y actualizar el webinar
    const updatedWebinar = await prisma.webinar.updateMany({
      where: {
        OR: [
          { title: { contains: 'Monetiza con IA' } },
          { slug: { contains: 'monetiza' } }
        ]
      },
      data: {
        dateTime: utcDate
      }
    });

    if (updatedWebinar.count > 0) {
      console.log('✅ Webinar actualizado exitosamente');
      console.log(`📊 Webinars actualizados: ${updatedWebinar.count}`);
      
      // Obtener el webinar actualizado para mostrar detalles
      const webinar = await prisma.webinar.findFirst({
        where: {
          OR: [
            { title: { contains: 'Monetiza con IA' } },
            { slug: { contains: 'monetiza' } }
          ]
        }
      });

      if (webinar) {
        console.log('\n📋 Detalles del webinar actualizado:');
        console.log('📝 Título:', webinar.title);
        console.log('🔗 Slug:', webinar.slug);
        console.log('📅 Nueva fecha (UTC):', webinar.dateTime.toISOString());
        console.log('📅 Nueva fecha (México):', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
        console.log('⏱️ Duración:', webinar.duration, 'minutos');
        console.log('👥 Cupos:', webinar.maxAttendees);
        console.log('💰 Precio:', webinar.isFree ? 'Gratis' : `$${webinar.price}`);
        console.log('👨‍💼 Ponente:', webinar.hostName);
        
        console.log('\n🌐 URL del webinar:');
        console.log(`http://localhost:3000/webinar/${webinar.slug}`);
        
        console.log('\n📧 El sistema de emails de recordatorio debería enviar automáticamente');
        console.log('   los emails a los usuarios registrados 15 minutos antes del webinar.');
      }
    } else {
      console.log('⚠️ No se encontró ningún webinar con "Monetiza con IA"');
      
      // Mostrar todos los webinars disponibles
      const allWebinars = await prisma.webinar.findMany();
      console.log('\n📋 Webinars disponibles:');
      allWebinars.forEach((webinar, index) => {
        console.log(`${index + 1}. ${webinar.title} (${webinar.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Error actualizando webinar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
updateWebinarDate(); 