import { PrismaClient } from '@prisma/client';
import { sendWebinarLiveNowEmail } from '../src/lib/email/webinar-email-service';

// Conectar directamente a la rama específica
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function sendLiveNowReminders() {
  try {
    console.log('🚀 ENVIANDO RECORDATORIOS EN VIVO - WEBINAR ACTIVO');
    console.log('⏰ Hora actual:', new Date().toISOString());
    
    await prisma.$connect();
    console.log('✅ Conectado a Neon');

    // Buscar el webinar específico
    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: 'videos-profesionales-ia'
      },
      include: {
        registrations: {
          where: {
            isConfirmed: true
          },
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!webinar) {
      console.log('❌ Webinar no encontrado');
      return;
    }

    console.log(`\n🎯 WEBINAR EN VIVO: ${webinar.title}`);
    console.log(`🆔 ID: ${webinar.id}`);
    console.log(`📅 Fecha: ${webinar.dateTime}`);
    console.log(`👥 Usuarios confirmados: ${webinar.registrations.length}`);

    if (webinar.registrations.length === 0) {
      console.log('❌ No hay usuarios confirmados');
      return;
    }

    let success = 0;
    let failed = 0;

    console.log(`\n🚀 ENVIANDO EMAILS "EN VIVO" (${webinar.registrations.length} destinatarios)...`);

    for (const [index, registration] of webinar.registrations.entries()) {
      try {
        const userEmail = registration.user?.email;
        if (!userEmail) {
          console.log(`❌ ${index + 1}/${webinar.registrations.length}: Email no encontrado`);
          failed++;
          continue;
        }

        const firstName = registration.user?.firstName || '';
        const lastName = registration.user?.lastName || '';
        
        // Crear objeto WebinarRegistration compatible
        const webinarRegistrationData = {
          id: registration.id,
          firstName,
          lastName,
          email: userEmail,
          isConfirmed: registration.isConfirmed,
          createdAt: registration.createdAt,
          updatedAt: registration.updatedAt,
          webinarId: webinar.id,
          userId: registration.userId
        };

        console.log(`📧 ${index + 1}/${webinar.registrations.length}: Enviando EN VIVO a ${userEmail}...`);

        const result = await sendWebinarLiveNowEmail(webinar, webinarRegistrationData);

        if (result) {
          console.log(`✅ ${index + 1}/${webinar.registrations.length}: Enviado exitosamente`);
          success++;
        } else {
          console.log(`❌ ${index + 1}/${webinar.registrations.length}: Fallo en el envío`);
          failed++;
        }

        // Delay pequeño para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ ${index + 1}/${webinar.registrations.length}: Error enviando a ${registration.user?.email}:`, error.message);
        failed++;
      }
    }

    console.log(`\n🎉 PROCESO EN VIVO COMPLETADO:`);
    console.log(`✅ Exitosos: ${success}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📊 Total procesados: ${success + failed}`);

    if (success > 0) {
      console.log(`\n🚀 ¡RECORDATORIOS EN VIVO ENVIADOS EXITOSAMENTE!`);
      console.log(`📧 ${success} personas recibieron el recordatorio "EN VIVO"`);
      console.log(`🔗 Link del webinar: ${webinar.zoomLink}`);
      console.log(`🎯 El webinar está activo AHORA`);
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

sendLiveNowReminders()
  .then(() => {
    console.log('\n✅ Proceso de recordatorios EN VIVO completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal en el proceso:', error);
    process.exit(1);
  });