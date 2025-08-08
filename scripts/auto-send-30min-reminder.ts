import { PrismaClient } from '@prisma/client';
import { sendWebinarThirtyMinuteReminderEmail } from '@/lib/email/webinar-email-service';

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
 * Script automático que envía recordatorios de 30 minutos
 * Se ejecuta automáticamente y verifica si hay webinars que comiencen en 30 minutos
 * 
 * USO:
 * - Programar con cron job para ejecutar cada minuto
 * - O programar para ejecutar exactamente 30 minutos antes del webinar
 */

async function autoSendThirtyMinuteReminders() {
  try {
    console.log('🕐 AUTO-RECORDATORIO 30 MINUTOS - INICIANDO VERIFICACIÓN...');
    console.log('🌐 Base de datos: PRODUCCIÓN');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // Calcular ventana de tiempo: ahora + 29 minutos a ahora + 31 minutos
    // Esto da un margen de error de 2 minutos para la ejecución
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 29 * 60 * 1000); // 29 min
    const thirtyOneMinutesFromNow = new Date(now.getTime() + 31 * 60 * 1000); // 31 min
    
    console.log('🕐 Buscando webinars que comiencen entre:');
    console.log(`   Desde: ${thirtyMinutesFromNow.toLocaleString('es-MX')}`);
    console.log(`   Hasta: ${thirtyOneMinutesFromNow.toLocaleString('es-MX')}`);
    
    // Buscar webinars que comiencen en 30 minutos (±1 minuto)
    const upcomingWebinars = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: thirtyMinutesFromNow,
          lte: thirtyOneMinutesFromNow
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

    if (upcomingWebinars.length === 0) {
      console.log('ℹ️ No hay webinars que comiencen en 30 minutos');
      console.log('✅ Verificación completada - No hay acciones necesarias');
      return { processed: 0, success: 0, failed: 0 };
    }

    console.log(`🎯 ¡ENCONTRADOS ${upcomingWebinars.length} WEBINARS!`);
    
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;

    // Procesar cada webinar
    for (const webinar of upcomingWebinars) {
      console.log('\n' + '='.repeat(60));
      console.log(`📚 PROCESANDO: ${webinar.title}`);
      console.log(`🕐 Hora del webinar: ${webinar.dateTime.toLocaleString('es-MX')}`);
      console.log(`👥 Registrados confirmados: ${webinar.registrations.length}`);
      
      if (webinar.registrations.length === 0) {
        console.log('⚠️ No hay registrados confirmados - Saltando webinar');
        continue;
      }

      console.log('\n📧 ENVIANDO RECORDATORIOS DE 30 MINUTOS...');
      
      // Calcular delay para evitar rate limiting
      const calculateDelay = (totalEmails: number) => {
        if (totalEmails <= 50) return 500;   // 0.5s para pocos emails
        if (totalEmails <= 200) return 750;  // 0.75s para volumen medio
        return 1000;                         // 1s para alto volumen
      };
      
      const delayMs = calculateDelay(webinar.registrations.length);
      console.log(`⏱️ Usando delay de ${delayMs}ms entre envíos`);
      
      let webinarSuccess = 0;
      let webinarFailed = 0;
      
      // Enviar a cada registrado
      for (let i = 0; i < webinar.registrations.length; i++) {
        const registration = webinar.registrations[i];
        const progress = `[${i + 1}/${webinar.registrations.length}]`;
        
        try {
          console.log(`${progress} 📤 Enviando a: ${registration.firstName} ${registration.lastName} (${registration.email})`);
          
          const result = await sendWebinarThirtyMinuteReminderEmail(webinar, registration);
          
          if (result) {
            console.log(`${progress} ✅ ENVIADO EXITOSAMENTE`);
            webinarSuccess++;
          } else {
            console.log(`${progress} ❌ FALLÓ EN EL ENVÍO`);
            webinarFailed++;
          }
          
        } catch (error) {
          console.log(`${progress} ❌ ERROR: ${error.message}`);
          webinarFailed++;
        }
        
        // Pausa entre envíos para evitar rate limiting
        if (i < webinar.registrations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      totalProcessed += webinar.registrations.length;
      totalSuccess += webinarSuccess;
      totalFailed += webinarFailed;
      
      console.log(`\n📊 RESUMEN DEL WEBINAR:`);
      console.log(`✅ Enviados: ${webinarSuccess}`);
      console.log(`❌ Fallidos: ${webinarFailed}`);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 AUTO-ENVÍO COMPLETADO');
    console.log(`📚 Webinars procesados: ${upcomingWebinars.length}`);
    console.log(`📧 Total emails procesados: ${totalProcessed}`);
    console.log(`✅ Total enviados exitosamente: ${totalSuccess}`);
    console.log(`❌ Total fallidos: ${totalFailed}`);
    console.log(`📈 Tasa de éxito: ${totalProcessed > 0 ? ((totalSuccess / totalProcessed) * 100).toFixed(1) : 0}%`);
    
    if (totalSuccess > 0) {
      console.log('\n🎯 Los usuarios deberían recibir el recordatorio de 30 minutos');
      console.log('📱 Contenido: Alerta urgente + checklist + acceso directo');
    }
    
    return {
      processed: totalProcessed,
      success: totalSuccess,
      failed: totalFailed,
      webinars: upcomingWebinars.length
    };

  } catch (error) {
    console.error('❌ Error en auto-envío de 30 minutos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  console.log('🚀 AUTO-RECORDATORIO DE 30 MINUTOS');
  console.log('⚡ Verificando webinars próximos...');
  
  autoSendThirtyMinuteReminders()
    .then((result) => {
      if (result.processed > 0) {
        console.log(`\n🏁 Auto-envío completado: ${result.success}/${result.processed} emails enviados`);
      } else {
        console.log('\n🏁 Auto-verificación completada - No hay webinars próximos');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal en auto-envío:', error);
      process.exit(1);
    });
}

export { autoSendThirtyMinuteReminders };