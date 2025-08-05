import { PrismaClient } from '@prisma/client';
import { sendWebinarConfirmationEmail, sendWebinarReminderEmail } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient();

async function testWebinarEmails() {
  try {
    console.log('🧪 Probando sistema de emails de webinars...\n');

    // Obtener el primer webinar disponible
    const webinar = await prisma.webinar.findFirst({
      where: { isActive: true }
    });

    if (!webinar) {
      console.log('❌ No hay webinars activos para probar');
      return;
    }

    console.log(`📋 Webinar seleccionado: ${webinar.title}`);
    console.log(`📅 Fecha: ${webinar.dateTime}`);
    console.log(`👨‍💼 Ponente: ${webinar.hostName}\n`);

    // Crear un registro de prueba
    const testRegistration = {
      id: 'test-registration',
      webinarId: webinar.id,
      userId: null,
      email: 'test@example.com', // Cambiar por tu email real
      firstName: 'Usuario',
      lastName: 'Prueba',
      phone: '+52 55 1234 5678',
      company: 'Empresa de Prueba',
      position: 'Desarrollador',
      questions: 'Pregunta de prueba para el webinar',
      isConfirmed: true,
      attended: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('📧 Enviando email de confirmación...');
    const confirmationResult = await sendWebinarConfirmationEmail(webinar, testRegistration);
    
    if (confirmationResult) {
      console.log('✅ Email de confirmación enviado exitosamente');
    } else {
      console.log('❌ Error enviando email de confirmación');
    }

    console.log('\n📧 Enviando email de recordatorio...');
    const reminderResult = await sendWebinarReminderEmail(webinar, testRegistration);
    
    if (reminderResult) {
      console.log('✅ Email de recordatorio enviado exitosamente');
    } else {
      console.log('❌ Error enviando email de recordatorio');
    }

    console.log('\n🎯 Resumen de la prueba:');
    console.log(`- Confirmación: ${confirmationResult ? '✅' : '❌'}`);
    console.log(`- Recordatorio: ${reminderResult ? '✅' : '❌'}`);

    if (confirmationResult && reminderResult) {
      console.log('\n🎉 ¡Sistema de emails funcionando correctamente!');
    } else {
      console.log('\n⚠️ Hay problemas con el sistema de emails');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar si se proporcionó un email como argumento
const testEmail = process.argv[2];
if (testEmail) {
  console.log(`📧 Usando email de prueba: ${testEmail}`);
}

testWebinarEmails(); 