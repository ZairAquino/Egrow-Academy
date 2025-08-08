import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

// Conectar directamente a la rama específica
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendRemindersDirectly() {
  try {
    console.log('🚨 ENVIANDO RECORDATORIOS DIRECTAMENTE - URGENTE');
    console.log('⏰ Hora actual:', new Date().toISOString());
    console.log('🎯 Tiempo restante: ~12 minutos');
    
    await prisma.$connect();
    console.log('✅ Conectado a Neon');

    // Buscar webinar específico
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

    console.log(`\n🎯 WEBINAR: ${webinar.title}`);
    console.log(`🆔 ID: ${webinar.id}`);
    console.log(`📅 Fecha: ${webinar.dateTime}`);
    console.log(`👥 Usuarios confirmados: ${webinar.registrations.length}`);

    if (webinar.registrations.length === 0) {
      console.log('❌ No hay usuarios confirmados');
      return;
    }

    console.log(`\n📧 CONFIGURACIÓN DE EMAIL:`);
    console.log(`🔑 API Key configurada: ${!!process.env.RESEND_API_KEY}`);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@egrowacademy.com';
    console.log(`📤 Remitente: eGrow Academy <${fromEmail}>`);

    let success = 0;
    let failed = 0;

    console.log(`\n🚨 ENVIANDO EMAILS (${webinar.registrations.length} destinatarios)...`);

    for (const [index, registration] of webinar.registrations.entries()) {
      try {
        const userEmail = registration.user?.email;
        if (!userEmail) {
          console.log(`❌ ${index + 1}/${webinar.registrations.length}: Email no encontrado`);
          failed++;
          continue;
        }

        const userName = `${registration.user?.firstName || ''} ${registration.user?.lastName || ''}`.trim() || 'Estudiante';
        
        // Crear template del email directamente aquí
        const subject = `🚨 ¡Tu webinar comienza en 12 minutos! - ${webinar.title}`;
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Recordatorio de Webinar</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://egrowacademy.com/images/egacademylogoblanco.png" alt="eGrow Academy" style="height: 50px;">
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">🚨 ¡Tu webinar comienza en 12 minutos!</h1>
          </div>

          <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hola ${userName},</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Te recordamos que el webinar <strong>"${webinar.title}"</strong> está por comenzar.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">📅 Detalles del Webinar:</h3>
              <p><strong>🎯 Tema:</strong> ${webinar.title}</p>
              <p><strong>⏰ Hora:</strong> ${new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} (México)</p>
              <p><strong>⏱️ Duración:</strong> ${webinar.duration} minutos</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${webinar.zoomLink || 'https://egrowacademy.com'}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
                🚀 UNIRSE AL WEBINAR AHORA
              </a>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>💡 Consejo:</strong> Te recomendamos unirte 5 minutos antes para asegurar una conexión estable.
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              ¿Tienes preguntas? Escríbenos a <a href="mailto:soporte@egrowacademy.com">soporte@egrowacademy.com</a>
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              © 2025 eGrow Academy. Todos los derechos reservados.
            </p>
          </div>
        </body>
        </html>`;

        console.log(`📧 ${index + 1}/${webinar.registrations.length}: Enviando a ${userEmail}...`);

        const result = await resend.emails.send({
          from: `eGrow Academy <${fromEmail}>`,
          to: [userEmail],
          subject: subject,
          html: html
        });

        console.log(`✅ ${index + 1}/${webinar.registrations.length}: Enviado exitosamente`);
        success++;

        // Delay pequeño para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ ${index + 1}/${webinar.registrations.length}: Error enviando a ${registration.user?.email}:`, error.message);
        failed++;
      }
    }

    console.log(`\n🎉 PROCESO COMPLETADO:`);
    console.log(`✅ Exitosos: ${success}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`📊 Total procesados: ${success + failed}`);

    if (success > 0) {
      console.log(`\n🚨 ¡RECORDATORIOS ENVIADOS EXITOSAMENTE!`);
      console.log(`📧 ${success} personas recibieron el recordatorio urgente`);
      console.log(`⏰ El webinar comienza en aproximadamente 12 minutos`);
      console.log(`🔗 Link del webinar: ${webinar.zoomLink}`);
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

sendRemindersDirectly()
  .then(() => {
    console.log('\n✅ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal en el proceso:', error);
    process.exit(1);
  });