import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkWebinarDate() {
  try {
    console.log('🔍 Verificando fecha del webinar "Monetiza con IA"...');

    // Buscar el webinar
    const webinar = await prisma.webinar.findFirst({
      where: {
        OR: [
          { title: { contains: 'Monetiza con IA' } },
          { slug: { contains: 'monetiza' } }
        ]
      }
    });

    if (!webinar) {
      console.log('❌ No se encontró el webinar "Monetiza con IA"');
      return;
    }

    console.log('\n📋 Detalles del webinar:');
    console.log('📝 Título:', webinar.title);
    console.log('🔗 Slug:', webinar.slug);
    console.log('📅 Fecha actual (UTC):', webinar.dateTime.toISOString());
    console.log('📅 Fecha actual (México):', new Date(webinar.dateTime.getTime() - (6 * 60 * 60 * 1000)).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('⏱️ Duración:', webinar.duration, 'minutos');
    console.log('👥 Cupos:', webinar.maxAttendees);
    console.log('💰 Precio:', webinar.isFree ? 'Gratis' : `$${webinar.price}`);
    console.log('👨‍💼 Ponente:', webinar.hostName);
    console.log('🔗 Link de acceso:', webinar.zoomLink);
    console.log('🆔 Meeting ID:', webinar.meetingId);
    console.log('🔑 Contraseña:', webinar.password);

    // Verificar si la fecha es correcta (hoy a las 4 PM México)
    const now = new Date();
    const mexicoTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    const expectedDate = new Date(mexicoTime);
    expectedDate.setHours(16, 0, 0, 0); // 4:00 PM
    const expectedUTC = new Date(expectedDate.getTime() + (6 * 60 * 60 * 1000));

    console.log('\n📅 Verificación de fecha:');
    console.log('📅 Fecha esperada (México):', expectedDate.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('📅 Fecha esperada (UTC):', expectedUTC.toISOString());
    console.log('📅 Fecha actual en BD (UTC):', webinar.dateTime.toISOString());
    
    const isCorrect = Math.abs(webinar.dateTime.getTime() - expectedUTC.getTime()) < 60000; // 1 minuto de tolerancia
    
    if (isCorrect) {
      console.log('✅ La fecha del webinar es correcta');
    } else {
      console.log('❌ La fecha del webinar NO es correcta');
      console.log('💡 Ejecuta el script de actualización para corregir la fecha');
    }

  } catch (error) {
    console.error('❌ Error verificando webinar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkWebinarDate(); 