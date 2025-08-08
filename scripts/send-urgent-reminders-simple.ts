import { prisma } from '../src/lib/prisma';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

async function sendUrgentReminders() {
  try {
    console.log('🚨 ENVIANDO RECORDATORIOS URGENTES');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar todos los webinars de hoy que estén activos
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const webinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: today,
          lt: tomorrow
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

    console.log(`\n📊 Webinars encontrados hoy: ${webinars.length}`);

    for (const webinar of webinars) {
      const webinarTime = new Date(webinar.dateTime);
      const timeUntilWebinar = webinarTime.getTime() - now.getTime();
      const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

      console.log(`\n🎯 Webinar: ${webinar.title}`);
      console.log(`📅 Hora: ${webinarTime.toISOString()}`);
      console.log(`👥 Registrados: ${webinar.registrations.length}`);
      console.log(`⏰ Minutos restantes: ${minutesUntilWebinar}`);

      if (minutesUntilWebinar < 0) {
        console.log('❌ Este webinar ya pasó');
        continue;
      }

      if (minutesUntilWebinar > 60) {
        console.log('⚠️ Aún falta mucho para este webinar');
        continue;
      }

      if (webinar.registrations.length === 0) {
        console.log('⚠️ No hay registrados para este webinar');
        continue;
      }

      console.log('📧 ENVIANDO RECORDATORIOS...');
      const result = await sendBulkWebinarReminders(webinar.id);

      console.log(`✅ Enviados: ${result.success}`);
      console.log(`❌ Fallidos: ${result.failed}`);
      if (result.details) {
        console.log('📝 Detalles:', result.details);
      }
    }

    console.log('\n🎉 PROCESO COMPLETADO');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

sendUrgentReminders()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });