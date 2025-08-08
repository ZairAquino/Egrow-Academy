import { PrismaClient } from '@prisma/client';
import { sendWebinarFiveHourReminderEmail } from '@/lib/email/webinar-email-service';

// URL de base de datos de producción
const DATABASE_URL = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

/**
 * Script para enviar recordatorios de 5 horas a TODOS los registrados 
 * confirmados del webinar de hoy en PRODUCCIÓN
 */

async function sendProductionFiveHourReminders() {
  try {
    console.log('🚀 Iniciando envío masivo de recordatorios de 5 horas...');
    console.log('🌐 Base de datos: PRODUCCIÓN');
    console.log('📧 Servicio: Resend');
    
    // Verificar variables de entorno
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ ERROR: RESEND_API_KEY no está configurada');
      process.exit(1);
    }

    // Obtener fecha de hoy
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    console.log('📅 Buscando webinars de hoy:', startOfDay.toDateString());
    
    // Obtener webinars de hoy con registros confirmados
    const webinarsToday = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        isActive: true
      },
      include: {
        registrations: {
          where: {
            isConfirmed: true
          }
        }
      }
    });

    if (webinarsToday.length === 0) {
      console.log('❌ No hay webinars activos para hoy');
      return;
    }

    let totalEmailsSent = 0;
    let totalEmailsFailed = 0;

    // Procesar cada webinar
    for (const webinar of webinarsToday) {
      console.log('\n' + '='.repeat(60));
      console.log(`🎯 PROCESANDO: ${webinar.title}`);
      console.log(`📅 Fecha: ${webinar.dateTime.toLocaleString('es-MX')}`);
      console.log(`👥 Registrados: ${webinar.registrations.length}`);
      
      if (webinar.registrations.length === 0) {
        console.log('⚠️ No hay registrados confirmados, saltando...');
        continue;
      }

      console.log('\n📧 ENVIANDO RECORDATORIOS...');
      console.log('-'.repeat(40));

      // Enviar email a cada registro
      for (let i = 0; i < webinar.registrations.length; i++) {
        const registration = webinar.registrations[i];
        const progress = `[${i + 1}/${webinar.registrations.length}]`;
        
        try {
          console.log(`${progress} Enviando a: ${registration.firstName} ${registration.lastName} (${registration.email})`);
          
          const result = await sendWebinarFiveHourReminderEmail(webinar, registration);
          
          if (result) {
            console.log(`${progress} ✅ Enviado exitosamente`);
            totalEmailsSent++;
          } else {
            console.log(`${progress} ❌ Error en el envío`);
            totalEmailsFailed++;
          }
          
          // Pequeña pausa entre envíos para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.log(`${progress} ❌ Error: ${error.message}`);
          totalEmailsFailed++;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE ENVÍO:');
    console.log(`✅ Emails enviados exitosamente: ${totalEmailsSent}`);
    console.log(`❌ Emails fallidos: ${totalEmailsFailed}`);
    console.log(`📧 Total procesados: ${totalEmailsSent + totalEmailsFailed}`);
    
    if (totalEmailsSent > 0) {
      console.log('\n🎉 ¡Recordatorios de 5 horas enviados exitosamente!');
      console.log('📱 Los usuarios recibirán el correo con:');
      console.log('   - Banner urgente animado');
      console.log('   - Countdown de 5 horas');
      console.log('   - Horarios por país');
      console.log('   - Link de Google Meet');
      console.log('   - Lista de preparativos');
      console.log('   - Invitación a WhatsApp community');
    }

    if (totalEmailsFailed > 0) {
      console.log(`\n⚠️ ${totalEmailsFailed} correos no pudieron ser enviados. Revisa los logs para más detalles.`);
    }

  } catch (error) {
    console.error('💥 Error fatal en envío masivo:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el envío masivo
console.log('🔥 SISTEMA DE RECORDATORIOS MASIVOS - PRODUCCIÓN');
console.log('⏰ Recordatorio: 5 horas antes del webinar');
console.log('🎯 Objetivo: Todos los registrados confirmados');
console.log('');

sendProductionFiveHourReminders()
  .then(() => {
    console.log('\n🏁 Envío masivo completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });