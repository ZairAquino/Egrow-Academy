import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    }
  }
});

async function checkProductionReminders() {
  try {
    console.log('🔍 Verificando sistema de recordatorios en PRODUCCIÓN...');
    console.log('⏰ Hora actual:', new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    
    // Buscar el webinar Monetiza con IA
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
      console.log('❌ No se encontró el webinar en producción');
      return;
    }

    console.log('\n📋 Webinar encontrado:');
    console.log('📝 Título:', webinar.title);
    console.log('📅 Fecha (México):', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('👥 Registros confirmados:', webinar.registrations.length);
    console.log('🔗 Link de acceso:', webinar.zoomLink);
    console.log('🔑 Contraseña:', webinar.password);

    // Calcular tiempo hasta el webinar
    const now = new Date();
    const webinarTime = new Date(webinar.dateTime);
    const timeUntilWebinar = webinarTime.getTime() - now.getTime();
    const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

    console.log('\n⏰ Estado del recordatorio:');
    console.log(`⏳ Minutos hasta el webinar: ${minutesUntilWebinar}`);

    if (minutesUntilWebinar < 0) {
      console.log('⚠️ El webinar ya comenzó o pasó');
    } else if (minutesUntilWebinar <= 15) {
      console.log('🚨 ¡ES HORA DE ENVIAR EL RECORDATORIO!');
      console.log('📧 Enviando emails de recordatorio ahora...');
      
      // Enviar recordatorios
      const result = await sendBulkWebinarReminders(webinar.id);
      
      console.log(`\n✅ Resultado del envío:`);
      console.log(`📧 Emails exitosos: ${result.success}`);
      console.log(`❌ Emails fallidos: ${result.failed}`);
      
      if (result.success > 0) {
        console.log('\n✅ Los recordatorios se enviaron correctamente');
        console.log('📋 Los usuarios recibieron:');
        console.log('  - Link de acceso al webinar');
        console.log('  - Contraseña de acceso');
        console.log('  - Recordatorio de la hora de inicio');
      }
    } else if (minutesUntilWebinar <= 20) {
      console.log('⏳ Próximo a enviar recordatorio (faltan menos de 20 minutos)');
      console.log(`📧 Se enviará automáticamente cuando falten 15 minutos`);
    } else {
      console.log(`⏳ Aún no es tiempo para enviar recordatorio`);
      console.log(`📧 Se enviará cuando falten 15 minutos`);
    }

    // Verificar configuración de email
    console.log('\n🔧 Configuración de email:');
    console.log('📧 API Key de Resend:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ No configurada');
    console.log('📧 Email remitente:', process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com');

  } catch (error) {
    console.error('❌ Error verificando recordatorios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkProductionReminders();