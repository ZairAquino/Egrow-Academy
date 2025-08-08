import { sendWebinarFiveHourReminderEmail } from '@/lib/email/webinar-email-service';
import { PrismaClient } from '@prisma/client';

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
 * Script para verificar y reenviar correos fallidos del webinar de hoy
 * Con pausa adecuada para evitar rate limiting
 */

async function checkAndResendFailedEmails() {
  try {
    console.log('🔍 VERIFICANDO ESTADO DE ENVÍOS Y REENVIANDO FALLIDOS...');
    console.log('🌐 Base de datos: PRODUCCIÓN');
    console.log('⚠️ Con pausa de 1 segundo entre envíos para evitar rate limiting');
    
    // Obtener webinar de hoy
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const webinar = await prisma.webinar.findFirst({
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

    if (!webinar) {
      console.log('❌ No hay webinars activos para hoy');
      return;
    }

    console.log(`\n📊 WEBINAR ENCONTRADO: ${webinar.title}`);
    console.log(`👥 Total registrados: ${webinar.registrations.length}`);
    
    // Lista completa de registrados
    console.log('\n📧 LISTA COMPLETA DE REGISTRADOS:');
    console.log('-'.repeat(60));
    
    webinar.registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.firstName} ${reg.lastName} - ${reg.email}`);
    });

    console.log('\n🚀 REENVIANDO A TODOS CON PAUSA DE 1 SEGUNDO...');
    console.log('📝 Esto asegura que todos reciban el correo sin errores de rate limit');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < webinar.registrations.length; i++) {
      const registration = webinar.registrations[i];
      const progress = `[${i + 1}/${webinar.registrations.length}]`;
      
      console.log(`\n${progress} Enviando a: ${registration.firstName} ${registration.lastName}`);
      console.log(`📧 Email: ${registration.email}`);
      
      try {
        const result = await sendWebinarFiveHourReminderEmail(webinar, registration);
        
        if (result) {
          console.log(`${progress} ✅ ENVIADO EXITOSAMENTE`);
          successCount++;
        } else {
          console.log(`${progress} ❌ FALLÓ EN EL ENVÍO`);
          failCount++;
        }
        
      } catch (error) {
        console.log(`${progress} ❌ ERROR: ${error.message}`);
        failCount++;
      }
      
      // Pausa de 1 segundo para evitar rate limiting
      if (i < webinar.registrations.length - 1) {
        console.log(`⏳ Esperando 1 segundo...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN FINAL DE ENVÍOS:');
    console.log(`✅ Enviados exitosamente: ${successCount}`);
    console.log(`❌ Fallidos: ${failCount}`);
    console.log(`📧 Total procesados: ${successCount + failCount}`);
    console.log(`📋 Total registrados: ${webinar.registrations.length}`);
    
    if (successCount === webinar.registrations.length) {
      console.log('\n🎉 ¡PERFECTO! Todos los correos fueron enviados exitosamente');
      console.log('📧 Los 31 registrados deberían recibir el recordatorio');
    } else if (successCount > 0) {
      console.log(`\n⚠️ Se enviaron ${successCount} de ${webinar.registrations.length} correos`);
      console.log('💡 Verifica en Resend cuántos se entregaron realmente');
    } else {
      console.log('\n❌ No se pudo enviar ningún correo');
      console.log('🔧 Verifica la configuración de Resend');
    }

    console.log('\n🔍 VERIFICAR EN RESEND:');
    console.log('1. Ir a https://resend.com/emails');
    console.log('2. Revisar los emails enviados hoy');
    console.log('3. Contar cuántos están marcados como "Delivered"');
    console.log('4. Si faltan algunos, pueden estar en "Processing" o "Failed"');
    
    return {
      total: webinar.registrations.length,
      success: successCount,
      failed: failCount
    };

  } catch (error) {
    console.error('❌ Error verificando envíos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación y reenvío
checkAndResendFailedEmails()
  .then((result) => {
    if (result) {
      console.log('\n🏁 Verificación y reenvío completados');
      console.log(`📈 Tasa de éxito: ${((result.success / result.total) * 100).toFixed(1)}%`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });