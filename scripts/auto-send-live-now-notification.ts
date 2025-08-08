import { PrismaClient } from '@prisma/client';
import { sendWebinarLiveNowEmail } from '@/lib/email/webinar-email-service';

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
 * Script automático que envía notificaciones "EN VIVO" 
 * Se ejecuta justo cuando comienza el webinar (hora exacta ±1 minuto)
 * 
 * USO:
 * - Programar con cron job para ejecutar cada minuto
 * - Se ejecuta automáticamente en la hora exacta del webinar
 */

async function autoSendLiveNowNotifications() {
  try {
    console.log('🔴 AUTO-NOTIFICACIÓN EN VIVO - INICIANDO VERIFICACIÓN...');
    console.log('🌐 Base de datos: PRODUCCIÓN');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // Calcular ventana de tiempo: ahora - 1 minuto a ahora + 1 minuto
    // Esto captura webinars que comenzaron justo ahora
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000); // -1 min
    const oneMinuteFromNow = new Date(now.getTime() + 1 * 60 * 1000); // +1 min
    
    console.log('🕐 Buscando webinars que comenzaron entre:');
    console.log(`   Desde: ${oneMinuteAgo.toLocaleString('es-MX')}`);
    console.log(`   Hasta: ${oneMinuteFromNow.toLocaleString('es-MX')}`);
    
    // Buscar webinars que comenzaron justo ahora (±1 minuto)
    const liveWebinars = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: oneMinuteAgo,
          lte: oneMinuteFromNow
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

    if (liveWebinars.length === 0) {
      console.log('ℹ️ No hay webinars que hayan comenzado ahora');
      console.log('✅ Verificación completada - No hay acciones necesarias');
      return { processed: 0, success: 0, failed: 0 };
    }

    console.log(`🔴 ¡ENCONTRADOS ${liveWebinars.length} WEBINARS EN VIVO!`);
    
    let totalProcessed = 0;
    let totalSuccess = 0;
    let totalFailed = 0;

    // Procesar cada webinar
    for (const webinar of liveWebinars) {
      console.log('\n' + '='.repeat(60));
      console.log(`🔴 WEBINAR EN VIVO: ${webinar.title}`);
      console.log(`🕐 Hora de inicio: ${webinar.dateTime.toLocaleString('es-MX')}`);
      console.log(`👥 Registrados confirmados: ${webinar.registrations.length}`);
      
      if (webinar.registrations.length === 0) {
        console.log('⚠️ No hay registrados confirmados - Saltando webinar');
        continue;
      }

      console.log('\n📧 ENVIANDO NOTIFICACIONES EN VIVO...');
      console.log('🚨 URGENCIA MÁXIMA: El webinar ya comenzó');
      
      // Calcular delay mínimo para máxima velocidad pero sin rate limiting
      const calculateDelayForLive = (totalEmails: number) => {
        if (totalEmails <= 30) return 300;   // 0.3s - máxima velocidad
        if (totalEmails <= 100) return 400;  // 0.4s - velocidad alta
        if (totalEmails <= 300) return 600;  // 0.6s - velocidad media
        return 800;                          // 0.8s - volumen alto
      };
      
      const delayMs = calculateDelayForLive(webinar.registrations.length);
      console.log(`⚡ Usando delay de ${delayMs}ms para máxima velocidad`);
      
      let webinarSuccess = 0;
      let webinarFailed = 0;
      
      // Enviar a cada registrado CON MÁXIMA URGENCIA
      for (let i = 0; i < webinar.registrations.length; i++) {
        const registration = webinar.registrations[i];
        const progress = `[${i + 1}/${webinar.registrations.length}]`;
        
        try {
          console.log(`${progress} 🔴 URGENTE → ${registration.firstName} ${registration.lastName} (${registration.email})`);
          
          const result = await sendWebinarLiveNowEmail(webinar, registration);
          
          if (result) {
            console.log(`${progress} ✅ NOTIFICACIÓN EN VIVO ENVIADA`);
            webinarSuccess++;
          } else {
            console.log(`${progress} ❌ FALLÓ EN EL ENVÍO`);
            webinarFailed++;
          }
          
        } catch (error) {
          console.log(`${progress} ❌ ERROR: ${error.message}`);
          webinarFailed++;
        }
        
        // Pausa mínima entre envíos (optimizada para velocidad)
        if (i < webinar.registrations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      totalProcessed += webinar.registrations.length;
      totalSuccess += webinarSuccess;
      totalFailed += webinarFailed;
      
      console.log(`\n📊 RESUMEN DEL WEBINAR EN VIVO:`);
      console.log(`✅ Notificaciones enviadas: ${webinarSuccess}`);
      console.log(`❌ Fallidas: ${webinarFailed}`);
      console.log(`⚡ Tiempo total: ~${((webinarSuccess * delayMs) / 1000).toFixed(1)}s`);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    console.log('🔴 NOTIFICACIONES EN VIVO COMPLETADAS');
    console.log(`📚 Webinars procesados: ${liveWebinars.length}`);
    console.log(`📧 Total emails procesados: ${totalProcessed}`);
    console.log(`✅ Total enviados exitosamente: ${totalSuccess}`);
    console.log(`❌ Total fallidos: ${totalFailed}`);
    console.log(`📈 Tasa de éxito: ${totalProcessed > 0 ? ((totalSuccess / totalProcessed) * 100).toFixed(1) : 0}%`);
    
    if (totalSuccess > 0) {
      console.log('\n🎯 Los usuarios fueron notificados que el webinar YA ESTÁ EN VIVO');
      console.log('📱 Contenido: Indicador EN VIVO + botón pulsante + acceso inmediato');
      console.log('🚨 Máxima urgencia para que se unan inmediatamente');
    }
    
    return {
      processed: totalProcessed,
      success: totalSuccess,
      failed: totalFailed,
      webinars: liveWebinars.length
    };

  } catch (error) {
    console.error('❌ Error en auto-notificación EN VIVO:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  console.log('🔴 AUTO-NOTIFICACIÓN EN VIVO');
  console.log('⚡ Verificando webinars que comenzaron ahora...');
  
  autoSendLiveNowNotifications()
    .then((result) => {
      if (result.processed > 0) {
        console.log(`\n🏁 Notificaciones EN VIVO completadas: ${result.success}/${result.processed} emails enviados`);
      } else {
        console.log('\n🏁 Verificación completada - No hay webinars EN VIVO ahora');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal en notificaciones EN VIVO:', error);
      process.exit(1);
    });
}

export { autoSendLiveNowNotifications };