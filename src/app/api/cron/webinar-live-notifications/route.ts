import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWebinarLiveNowEmail } from '@/lib/email/webinar-email-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autorización (Vercel Cron Secret)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Ejecutando cron job de notificaciones EN VIVO...');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar webinars que estén comenzando AHORA (± 5 minutos)
    const now = new Date();
    const nowMinus5 = new Date(now.getTime() - 5 * 60 * 1000);
    const nowPlus5 = new Date(now.getTime() + 5 * 60 * 1000);

    console.log('🎯 Buscando webinars EN VIVO entre:', nowMinus5.toISOString(), 'y', nowPlus5.toISOString());

    const liveWebinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: nowMinus5,
          lte: nowPlus5
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    console.log(`📊 Webinars EN VIVO encontrados: ${liveWebinars.length}`);

    const results = {
      webinarsProcessed: 0,
      emailsSent: 0,
      emailsFailed: 0,
      webinars: [] as any[]
    };

    for (const webinar of liveWebinars) {
      const webinarTime = new Date(webinar.dateTime);
      const timeUntilWebinar = webinarTime.getTime() - now.getTime();
      const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

      console.log(`\n🎯 Procesando: ${webinar.title}`);
      console.log(`📅 Fecha: ${webinarTime.toISOString()}`);
      console.log(`⏰ Minutos hasta webinar: ${minutesUntilWebinar} (EN VIVO)`);
      console.log(`👥 Usuarios registrados: ${webinar.registrations.length}`);

      // Verificar si ya se enviaron notificaciones EN VIVO
      const reminderKey = `live_notification_sent_${webinar.id}_${webinarTime.toISOString().split('T')[0]}`;
      const reminderSent = await prisma.webinar.findFirst({
        where: {
          id: webinar.id,
          metadata: {
            path: [reminderKey],
            equals: true
          }
        }
      });

      if (reminderSent) {
        console.log('⚠️ Ya se enviaron notificaciones EN VIVO para este webinar');
        continue;
      }

      console.log('📧 Enviando notificaciones EN VIVO...');
      
      let success = 0;
      let failed = 0;

      // Enviar emails a todos los registrados
      for (const registration of webinar.registrations) {
        const result = await sendWebinarLiveNowEmail(webinar, registration);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }
      
      results.webinarsProcessed++;
      results.emailsSent += success;
      results.emailsFailed += failed;
      
      results.webinars.push({
        title: webinar.title,
        dateTime: webinar.dateTime,
        registrations: webinar.registrations.length,
        emailsSent: success,
        emailsFailed: failed
      });

      // Marcar como enviado en metadata
      await prisma.webinar.update({
        where: { id: webinar.id },
        data: {
          metadata: {
            ...webinar.metadata as any,
            [reminderKey]: true,
            lastLiveNotificationSent: new Date().toISOString()
          }
        }
      });

      console.log(`✅ Notificaciones EN VIVO enviadas: ${success} exitosas, ${failed} fallidas`);
    }

    console.log('\n📊 Resumen del cron job EN VIVO:');
    console.log(`📋 Webinars procesados: ${results.webinarsProcessed}`);
    console.log(`✅ Emails enviados: ${results.emailsSent}`);
    console.log(`❌ Emails fallidos: ${results.emailsFailed}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      type: 'live-notification',
      results
    });

  } catch (error) {
    console.error('❌ Error en cron job de notificaciones EN VIVO:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando notificaciones EN VIVO',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}