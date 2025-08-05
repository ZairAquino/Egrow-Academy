import { PrismaClient } from '@prisma/client';
import { scheduleWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function activateReminderSystem() {
  try {
    console.log('🔄 Activando sistema automático de recordatorios...');

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

    console.log('✅ Webinar encontrado:', webinar.title);
    console.log('📅 Fecha del webinar:', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));

    // Calcular cuándo debería enviarse el recordatorio (15 minutos antes)
    const webinarTime = new Date(webinar.dateTime);
    const reminderTime = new Date(webinarTime.getTime() - 15 * 60 * 1000); // 15 minutos antes
    const now = new Date();

    console.log('\n📅 Información de recordatorios:');
    console.log('📅 Hora del webinar:', webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('📅 Hora del recordatorio:', reminderTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('📅 Hora actual:', now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      const minutesUntilReminder = Math.floor(timeUntilReminder / (1000 * 60));
      
      console.log(`\n⏰ El recordatorio se enviará automáticamente en ${minutesUntilReminder} minutos`);
      console.log('📧 Se enviará a todos los usuarios registrados');
      
      // Programar el recordatorio automático
      console.log('\n🔄 Programando recordatorio automático...');
      await scheduleWebinarReminders(webinar.id);
      
      console.log('✅ Sistema de recordatorios activado');
      console.log('📧 Los recordatorios se enviarán automáticamente 15 minutos antes del webinar');
    } else {
      console.log('\n⚠️ El tiempo para enviar recordatorios automáticos ya pasó');
      console.log('💡 El webinar ya comenzó o está muy cerca del inicio');
    }

  } catch (error) {
    console.error('❌ Error activando sistema de recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
activateReminderSystem(); 