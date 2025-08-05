import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function setupCronReminders() {
  try {
    console.log('🔄 Configurando sistema de recordatorios automáticos...');
    console.log('⏰ Este script debe ejecutarse cada minuto para verificar webinars próximos');
    console.log('📧 Enviará recordatorios automáticamente 15 minutos antes de cada webinar');

    // Buscar webinars activos próximos
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

      console.log(`\n🎯 Procesando: ${webinar.title}`);
      console.log(`📅 Fecha: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`⏰ Minutos hasta el webinar: ${minutesUntilWebinar}`);
      console.log(`👥 Usuarios registrados: ${webinar.registrations.length}`);

      // Enviar recordatorio si faltan exactamente 15 minutos (±1 minuto)
      if (minutesUntilWebinar >= 14 && minutesUntilWebinar <= 16) {
        console.log('📧 ¡ENVIANDO RECORDATORIO AUTOMÁTICO!');
        
        const result = await sendBulkWebinarReminders(webinar.id);
        
        console.log(`✅ Recordatorios enviados: ${result.success} exitosos, ${result.failed} fallidos`);
        
        if (result.success > 0) {
          console.log('📋 Email enviado con:');
          console.log('🔗 Link de acceso:', webinar.zoomLink);
          console.log('🆔 Meeting ID:', webinar.meetingId);
          console.log('🔑 Contraseña:', webinar.password);
          console.log('⏰ Hora de inicio:', webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
        }
      } else if (minutesUntilWebinar < 0) {
        console.log('⚠️ El webinar ya comenzó');
      } else if (minutesUntilWebinar > 16) {
        console.log('⏳ Aún no es tiempo (faltan más de 16 minutos)');
      } else {
        console.log('⏰ Fuera de la ventana de recordatorio');
      }
    }

    if (upcomingWebinars.length === 0) {
      console.log('📭 No hay webinars próximos en las próximas 20 minutos');
    }

    console.log('\n✅ Sistema de recordatorios configurado correctamente');
    console.log('💡 Para automatizar completamente, ejecuta este script cada minuto con cron');

  } catch (error) {
    console.error('❌ Error en sistema de recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
setupCronReminders(); 