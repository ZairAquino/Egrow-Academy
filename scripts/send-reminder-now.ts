import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function sendReminderNow() {
  try {
    console.log('🔄 Enviando recordatorio inmediato para webinar "Monetiza con IA"...');

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
    console.log('📅 Fecha del webinar:', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('👥 Usuarios registrados:', webinar.registrations.length);

    if (webinar.registrations.length === 0) {
      console.log('⚠️ No hay usuarios registrados');
      console.log('💡 Creando registro de prueba...');
      
      const testRegistration = await prisma.webinarRegistration.create({
        data: {
          firstName: 'Usuario',
          lastName: 'Prueba',
          email: 'test@egrowacademy.com',
          phone: '+52 55 1234 5678',
          isConfirmed: true,
          webinarId: webinar.id
        }
      });
      
      console.log('✅ Registro de prueba creado:', testRegistration.email);
    }

    // Enviar recordatorio inmediatamente
    console.log('\n📧 Enviando recordatorio inmediato...');
    const result = await sendBulkWebinarReminders(webinar.id);

    console.log('\n📊 Resultado del envío:');
    console.log('✅ Emails enviados exitosamente:', result.success);
    console.log('❌ Emails fallidos:', result.failed);

    if (result.success > 0) {
      console.log('\n📋 Detalles del email de recordatorio enviado:');
      console.log('📝 Asunto: ⏰ ¡El webinar comienza en 15 minutos! - "Monetiza con IA: Estrategias Prácticas para 2024"');
      console.log('🔗 Link de acceso incluido:', webinar.zoomLink);
      console.log('🆔 Meeting ID incluido:', webinar.meetingId);
      console.log('🔑 Contraseña incluida:', webinar.password);
      console.log('⏰ Hora de inicio:', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
      
      console.log('\n✅ Recordatorio enviado exitosamente');
      console.log('📧 Los usuarios registrados recibieron el email con toda la información de acceso');
    } else {
      console.log('\n❌ No se pudieron enviar los recordatorios');
    }

  } catch (error) {
    console.error('❌ Error enviando recordatorio:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
sendReminderNow(); 