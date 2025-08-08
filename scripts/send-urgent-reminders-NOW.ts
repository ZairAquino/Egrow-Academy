import { PrismaClient } from '@prisma/client';
import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';

// Conectar directamente a la rama específica
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function sendUrgentRemindersNOW() {
  try {
    console.log('🚨🚨🚨 ENVIANDO RECORDATORIOS URGENTES AHORA 🚨🚨🚨');
    console.log('⏰ Hora actual:', new Date().toISOString());
    
    // Conectar
    await prisma.$connect();
    console.log('✅ Conectado a Neon');

    // Buscar el webinar específico
    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: 'videos-profesionales-ia'
      },
      include: {
        registrations: {
          where: {
            isConfirmed: true
          },
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!webinar) {
      console.log('❌ Webinar no encontrado');
      return;
    }

    const confirmedRegistrations = webinar.registrations.length;
    console.log(`\n🎯 WEBINAR: ${webinar.title}`);
    console.log(`📊 Registros confirmados: ${confirmedRegistrations}`);
    console.log(`🆔 ID Webinar: ${webinar.id}`);

    if (confirmedRegistrations === 0) {
      console.log('❌ No hay registros confirmados');
      return;
    }

    // Mostrar algunos emails (sin mostrar todos por privacidad)
    console.log(`\n📧 Primeros 5 emails que recibirán recordatorio:`);
    webinar.registrations.slice(0, 5).forEach((reg, index) => {
      const name = `${reg.user?.firstName || ''} ${reg.user?.lastName || ''}`.trim() || 'Sin nombre';
      console.log(`${index + 1}. ${reg.user?.email} (${name})`);
    });

    console.log(`\n🚨 ENVIANDO RECORDATORIOS A ${confirmedRegistrations} USUARIOS...`);
    console.log('📧 Procesando envío masivo...');

    // Enviar recordatorios
    const result = await sendBulkWebinarReminders(webinar.id);

    console.log(`\n✅ RESULTADO DEL ENVÍO:`);
    console.log(`📧 Exitosos: ${result.success}`);
    console.log(`❌ Fallidos: ${result.failed}`);
    
    if (result.details) {
      console.log(`📝 Detalles:`, result.details);
    }

    if (result.success > 0) {
      console.log(`\n🎉 ¡RECORDATORIOS ENVIADOS EXITOSAMENTE!`);
      console.log(`✉️ ${result.success} usuarios recibieron el recordatorio`);
      console.log(`⏰ Webinar comienza en aproximadamente 13 minutos`);
    } else {
      console.log(`\n❌ No se pudo enviar ningún recordatorio`);
      if (result.failed > 0) {
        console.log(`❌ ${result.failed} envíos fallaron`);
      }
    }

  } catch (error) {
    console.error('❌ Error enviando recordatorios urgentes:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

sendUrgentRemindersNOW()
  .then(() => {
    console.log('\n🎯 Proceso de recordatorios completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });