import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendWebinarLiveNowEmail } from '../email/webinar-email-service';

const prisma = new PrismaClient();

/**
 * Cron job para enviar recordatorios "EN VIVO" cuando el webinar comience
 * Se ejecuta cada minuto y verifica si algún webinar debe comenzar
 */
export function startWebinarLiveCron() {
  console.log('🚀 Iniciando cron job para recordatorios EN VIVO...');
  
  // Ejecutar cada minuto
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentHour = now.getUTCHours();
      const currentMinute = now.getUTCMinutes();
      
      console.log(`⏰ Verificando webinars en vivo: ${now.toISOString()}`);
      
      // Buscar webinars que deberían estar comenzando ahora
      // Consideramos un rango de 2 minutos para asegurar que no se pierda
      const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
      const oneMinuteFromNow = new Date(now.getTime() + 1 * 60 * 1000);
      
      const webinarsToStart = await prisma.webinar.findMany({
        where: {
          dateTime: {
            gte: twoMinutesAgo,
            lte: oneMinuteFromNow
          },
          isActive: true
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

      if (webinarsToStart.length > 0) {
        console.log(`🎯 Encontrados ${webinarsToStart.length} webinars para iniciar`);
        
        for (const webinar of webinarsToStart) {
          console.log(`\n🚀 PROCESANDO WEBINAR EN VIVO: ${webinar.title}`);
          console.log(`📅 Hora programada: ${webinar.dateTime}`);
          console.log(`👥 Registrados confirmados: ${webinar.registrations.length}`);
          
          // Verificar si ya se enviaron recordatorios para este webinar
          const liveReminderKey = `live_reminder_sent_${webinar.id}`;
          
          // En producción, usar Redis o base de datos para trackear
          // Por ahora, usamos un campo en la base de datos
          const hasLiveReminderSent = await checkIfLiveReminderSent(webinar.id);
          
          if (hasLiveReminderSent) {
            console.log(`⚠️ Ya se enviaron recordatorios EN VIVO para: ${webinar.title}`);
            continue;
          }
          
          if (webinar.registrations.length === 0) {
            console.log(`❌ No hay usuarios confirmados para: ${webinar.title}`);
            continue;
          }
          
          let success = 0;
          let failed = 0;
          
          console.log(`📧 Enviando recordatorios EN VIVO a ${webinar.registrations.length} usuarios...`);
          
          // Enviar emails a todos los registrados
          for (const registration of webinar.registrations) {
            try {
              const userEmail = registration.user?.email;
              if (!userEmail) {
                failed++;
                continue;
              }
              
              const firstName = registration.user?.firstName || '';
              const lastName = registration.user?.lastName || '';
              
              // Crear objeto WebinarRegistration compatible
              const webinarRegistrationData = {
                id: registration.id,
                firstName,
                lastName,
                email: userEmail,
                isConfirmed: registration.isConfirmed,
                createdAt: registration.createdAt,
                updatedAt: registration.updatedAt,
                webinarId: webinar.id,
                userId: registration.userId
              };
              
              const result = await sendWebinarLiveNowEmail(webinar, webinarRegistrationData);
              
              if (result) {
                success++;
              } else {
                failed++;
              }
              
              // Pequeño delay para evitar rate limiting
              await new Promise(resolve => setTimeout(resolve, 100));
              
            } catch (error) {
              console.error(`❌ Error enviando recordatorio EN VIVO:`, error);
              failed++;
            }
          }
          
          console.log(`✅ Recordatorios EN VIVO completados para: ${webinar.title}`);
          console.log(`📊 Exitosos: ${success}, Fallidos: ${failed}`);
          
          // Marcar que ya se enviaron los recordatorios
          await markLiveReminderSent(webinar.id);
        }
      }
      
    } catch (error) {
      console.error('❌ Error en cron job de recordatorios EN VIVO:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('✅ Cron job de recordatorios EN VIVO iniciado');
}

/**
 * Verificar si ya se enviaron recordatorios EN VIVO para un webinar
 */
async function checkIfLiveReminderSent(webinarId: string): Promise<boolean> {
  try {
    // Buscar en una tabla de logs o usar un campo en el webinar
    // Por simplicidad, usaremos el campo notes del webinar para tracking
    const webinar = await prisma.webinar.findUnique({
      where: { id: webinarId },
      select: { notes: true }
    });
    
    return webinar?.notes?.includes('LIVE_REMINDER_SENT') || false;
  } catch (error) {
    console.error('Error verificando recordatorio EN VIVO:', error);
    return false;
  }
}

/**
 * Marcar que ya se enviaron recordatorios EN VIVO
 */
async function markLiveReminderSent(webinarId: string): Promise<void> {
  try {
    await prisma.webinar.update({
      where: { id: webinarId },
      data: {
        notes: {
          set: 'LIVE_REMINDER_SENT'
        }
      }
    });
    console.log(`✅ Marcado como enviado: recordatorios EN VIVO para webinar ${webinarId}`);
  } catch (error) {
    console.error('Error marcando recordatorio EN VIVO:', error);
  }
}

/**
 * Parar todos los cron jobs
 */
export function stopWebinarLiveCron() {
  cron.getTasks().forEach((task, name) => {
    task.destroy();
  });
  console.log('🛑 Cron jobs de recordatorios EN VIVO detenidos');
}