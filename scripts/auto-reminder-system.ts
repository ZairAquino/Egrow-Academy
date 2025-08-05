import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function autoReminderSystem() {
  try {
    console.log('🔄 Sistema automático de recordatorios iniciado...');
    console.log('📅 Hora actual:', new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));

    // Buscar webinars que están próximos (en los próximos 20 minutos)
    const now = new Date();
    const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const upcomingWebinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: fifteenMinutesAgo,
          lte: twentyMinutesFromNow
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    console.log(`📊 Webinars próximos encontrados: ${upcomingWebinars.length}`);

    for (const webinar of upcomingWebinars) {
      const webinarTime = new Date(webinar.dateTime);
      const timeUntilWebinar = webinarTime.getTime() - now.getTime();
      const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

      console.log(`\n🎯 Procesando webinar: ${webinar.title}`);
      console.log(`📅 Fecha del webinar: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`⏰ Minutos hasta el webinar: ${minutesUntilWebinar}`);
      console.log(`👥 Usuarios registrados: ${webinar.registrations.length}`);

      // Enviar recordatorio si faltan entre 14-16 minutos (ventana de 2 minutos)
      if (minutesUntilWebinar >= 14 && minutesUntilWebinar <= 16) {
        console.log('📧 Enviando recordatorio automático...');
        
        const result = await sendBulkWebinarReminders(webinar.id);
        
        console.log(`✅ Recordatorios enviados: ${result.success} exitosos, ${result.failed} fallidos`);
        
        if (result.success > 0) {
          console.log('📋 Detalles del email enviado:');
          console.log('📝 Asunto: ⏰ ¡El webinar comienza en 15 minutos!');
          console.log('🔗 Link de acceso:', webinar.zoomLink);
          console.log('🆔 Meeting ID:', webinar.meetingId);
          console.log('🔑 Contraseña:', webinar.password);
          console.log('⏰ Hora de inicio:', webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
        }
      } else if (minutesUntilWebinar < 0) {
        console.log('⚠️ El webinar ya comenzó');
      } else if (minutesUntilWebinar > 16) {
        console.log('⏳ Aún no es tiempo de enviar recordatorio');
      } else {
        console.log('⏰ Fuera de la ventana de recordatorio (14-16 minutos)');
      }
    }

    if (upcomingWebinars.length === 0) {
      console.log('📭 No hay webinars próximos en las próximas 20 minutos');
    }

  } catch (error) {
    console.error('❌ Error en sistema automático de recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el sistema automático
autoReminderSystem(); 