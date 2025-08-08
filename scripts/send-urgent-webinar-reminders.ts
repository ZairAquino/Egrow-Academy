import { prisma } from '../src/lib/prisma';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

async function sendUrgentWebinarReminders() {
  try {
    console.log('🚨 ENVIANDO RECORDATORIOS URGENTES DE WEBINAR');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar el webinar específico de hoy
    const webinarSlug = 'videos-profesionales-ia';
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: webinarSlug,
        isActive: true,
        dateTime: {
          gte: startOfToday,
          lt: endOfToday
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true },
          include: {
            user: true
          }
        }
      }
    });

    if (!webinar) {
      console.log('❌ No se encontró el webinar de hoy');
      return;
    }

    console.log(`\n🎯 Webinar encontrado: ${webinar.title}`);
    console.log(`📅 Fecha y hora: ${new Date(webinar.dateTime).toISOString()}`);
    console.log(`👥 Registrados: ${webinar.registrations.length}`);

    // Calcular tiempo restante
    const webinarTime = new Date(webinar.dateTime);
    const now = new Date();
    const timeUntilWebinar = webinarTime.getTime() - now.getTime();
    const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

    console.log(`⏰ Minutos hasta el webinar: ${minutesUntilWebinar}`);

    if (minutesUntilWebinar < 0) {
      console.log('❌ El webinar ya comenzó o terminó');
      return;
    }

    if (minutesUntilWebinar > 45) {
      console.log('⚠️ Aún es muy temprano para el recordatorio');
      return;
    }

    // Verificar si ya se enviaron recordatorios
    const reminderKey = `urgent_reminder_sent_${webinar.id}_${webinarTime.toISOString().split('T')[0]}`;
    const metadata = webinar.metadata as any || {};
    
    if (metadata[reminderKey]) {
      console.log('⚠️ Ya se enviaron recordatorios urgentes para este webinar');
      return;
    }

    console.log('\n📧 ENVIANDO RECORDATORIOS URGENTES...');
    const result = await sendBulkWebinarReminders(webinar.id);

    console.log(`\n✅ RECORDATORIOS ENVIADOS:`);
    console.log(`📧 Exitosos: ${result.success}`);
    console.log(`❌ Fallidos: ${result.failed}`);
    console.log(`📝 Detalles:`, result.details);

    // Marcar como enviado
    await prisma.webinar.update({
      where: { id: webinar.id },
      data: {
        metadata: {
          ...metadata,
          [reminderKey]: true,
          urgentReminderSent: new Date().toISOString(),
          urgentReminderStats: {
            success: result.success,
            failed: result.failed,
            sentAt: new Date().toISOString()
          }
        }
      }
    });

    console.log('\n🎉 PROCESO COMPLETADO EXITOSAMENTE');

  } catch (error) {
    console.error('❌ Error enviando recordatorios urgentes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
sendUrgentWebinarReminders()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  });