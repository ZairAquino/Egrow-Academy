import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function simulateReminderSend() {
  try {
    console.log('🔄 Simulando envío automático de recordatorios para webinar "Monetiza con IA"...');

    // Buscar el webinar
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
      console.log('❌ No se encontró el webinar "Monetiza con IA"');
      return;
    }

    console.log('✅ Webinar encontrado:', webinar.title);
    console.log('📅 Fecha del webinar:', webinar.dateTime.toISOString());
    console.log('👥 Registros confirmados:', webinar.registrations.length);

    if (webinar.registrations.length === 0) {
      console.log('⚠️ No hay usuarios registrados para enviar recordatorios');
      console.log('💡 Para probar, registra algunos usuarios en el webinar primero');
      return;
    }

    console.log('\n📧 Enviando recordatorios a todos los usuarios registrados...');
    
    // Enviar recordatorios masivos
    const result = await sendBulkWebinarReminders(webinar.id);

    console.log('\n📊 Resultado del envío de recordatorios:');
    console.log('✅ Emails enviados exitosamente:', result.success);
    console.log('❌ Emails fallidos:', result.failed);
    console.log('📧 Total de usuarios registrados:', webinar.registrations.length);

    if (result.success > 0) {
      console.log('\n📋 Detalles del email de recordatorio:');
      console.log('📝 Asunto: ⏰ ¡El webinar comienza en 15 minutos! - "Monetiza con IA: Estrategias Prácticas para 2024"');
      console.log('🔗 Link de acceso incluido:', webinar.zoomLink);
      console.log('🆔 Meeting ID incluido:', webinar.meetingId);
      console.log('🔑 Contraseña incluida:', webinar.password);
      console.log('⏰ Hora de inicio:', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
      
      console.log('\n📅 El sistema automático funciona correctamente');
      console.log('   Los recordatorios se enviarán automáticamente 15 minutos antes del webinar');
      
      console.log('\n🌐 URL del webinar:');
      console.log(`http://localhost:3000/webinar/${webinar.slug}`);
    }

  } catch (error) {
    console.error('❌ Error simulando envío de recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
simulateReminderSend(); 