import { PrismaClient } from '@prisma/client';
import { sendWebinarReminderEmail } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function testWebinarReminder() {
  try {
    console.log('🔄 Probando envío de email de recordatorio para webinar "Monetiza con IA"...');

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
    console.log('📅 Fecha del webinar:', webinar.dateTime.toISOString());
    console.log('🔗 Link de acceso:', webinar.zoomLink);

    // Crear un registro de prueba
    const testRegistration = {
      id: 'test-reminder',
      firstName: 'Usuario',
      lastName: 'Prueba',
      email: 'test@egrowacademy.com',
      isConfirmed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      webinarId: webinar.id,
      userId: null
    };

    console.log('\n📧 Enviando email de recordatorio de prueba...');
    console.log('📧 Destinatario:', testRegistration.email);
    console.log('📧 Nombre:', `${testRegistration.firstName} ${testRegistration.lastName}`);

    // Enviar email de recordatorio
    const result = await sendWebinarReminderEmail(webinar, testRegistration);

    if (result) {
      console.log('✅ Email de recordatorio enviado exitosamente');
      console.log('\n📋 Detalles del email enviado:');
      console.log('📝 Asunto: ⏰ ¡El webinar comienza en 15 minutos! - "Monetiza con IA: Estrategias Prácticas para 2024"');
      console.log('📧 Destinatario:', testRegistration.email);
      console.log('🔗 Link de acceso incluido:', webinar.zoomLink);
      console.log('🆔 Meeting ID incluido:', webinar.meetingId);
      console.log('🔑 Contraseña incluida:', webinar.password);
      
      console.log('\n📅 El sistema automático enviará recordatorios a todos los usuarios registrados');
      console.log('   cuando falten 15 minutos para el inicio del webinar.');
      
      console.log('\n🌐 URL del webinar para verificar:');
      console.log(`http://localhost:3000/webinar/${webinar.slug}`);
    } else {
      console.log('❌ Error enviando email de recordatorio');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
testWebinarReminder(); 