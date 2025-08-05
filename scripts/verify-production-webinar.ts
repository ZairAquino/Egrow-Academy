import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function verifyProductionWebinar() {
  try {
    console.log('🔍 Verificando webinar en PRODUCCIÓN...');

    // Buscar el webinar en producción
    const webinar = await prisma.webinar.findFirst({
      where: {
        OR: [
          { title: { contains: 'Monetiza con IA' } },
          { slug: { contains: 'monetiza' } }
        ]
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    if (!webinar) {
      console.log('❌ No se encontró el webinar "Monetiza con IA" en producción');
      return;
    }

    console.log('\n📋 Detalles del webinar en PRODUCCIÓN:');
    console.log('📝 Título:', webinar.title);
    console.log('🔗 Slug:', webinar.slug);
    console.log('📅 Fecha (UTC):', webinar.dateTime.toISOString());
    console.log('📅 Fecha (México):', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('⏱️ Duración:', webinar.duration, 'minutos');
    console.log('👥 Cupos:', webinar.maxAttendees);
    console.log('💰 Precio:', webinar.isFree ? 'Gratis' : `$${webinar.price}`);
    console.log('👨‍💼 Ponente:', webinar.hostName);
    console.log('🔗 Link de acceso:', webinar.zoomLink);
    console.log('🆔 Meeting ID:', webinar.meetingId);
    console.log('🔑 Contraseña:', webinar.password);
    console.log('👥 Registros confirmados:', webinar.registrations.length);

    // Verificar si la fecha es correcta (4:00 PM México)
    const now = new Date();
    const mexicoTime = new Date(now.getTime() - (6 * 60 * 60 * 1000));
    const expectedDate = new Date(mexicoTime);
    expectedDate.setHours(16, 0, 0, 0); // 4:00 PM
    const expectedUTC = new Date(expectedDate.getTime() + (6 * 60 * 60 * 1000));

    console.log('\n📅 Verificación de fecha en PRODUCCIÓN:');
    console.log('📅 Fecha esperada (México):', expectedDate.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('📅 Fecha esperada (UTC):', expectedUTC.toISOString());
    console.log('📅 Fecha actual en BD (UTC):', webinar.dateTime.toISOString());
    
    const isCorrect = Math.abs(webinar.dateTime.getTime() - expectedUTC.getTime()) < 60000; // 1 minuto de tolerancia
    
    if (isCorrect) {
      console.log('✅ La fecha del webinar en PRODUCCIÓN es correcta');
    } else {
      console.log('❌ La fecha del webinar en PRODUCCIÓN NO es correcta');
      console.log('💡 Necesitas actualizar la fecha en producción');
    }

    if (webinar.registrations.length > 0) {
      console.log('\n📝 Registros en PRODUCCIÓN:');
      webinar.registrations.forEach((registration, index) => {
        console.log(`  ${index + 1}. ${registration.firstName} ${registration.lastName}`);
        console.log(`     📧 ${registration.email}`);
        console.log(`     📅 ${registration.createdAt.toLocaleString()}`);
        console.log(`     ✅ Confirmado: ${registration.isConfirmed ? 'Sí' : 'No'}`);
      });
    } else {
      console.log('\n⚠️ No hay registros confirmados en PRODUCCIÓN');
    }

  } catch (error) {
    console.error('❌ Error verificando webinar en producción:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
verifyProductionWebinar(); 