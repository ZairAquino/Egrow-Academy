import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWebinarThirtyMinuteReminderEmail } from '@/lib/email/webinar-email-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autorización (Vercel Cron Secret)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Ejecutando cron job de recordatorios de 30 minutos...');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar webinars que empiecen en exactamente 30 minutos (± 5 minutos)
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    const thirtyMinutesMinus5 = new Date(thirtyMinutesFromNow.getTime() - 5 * 60 * 1000);
    const thirtyMinutesPlus5 = new Date(thirtyMinutesFromNow.getTime() + 5 * 60 * 1000);

    console.log('🎯 Buscando webinars entre:', thirtyMinutesMinus5.toISOString(), 'y', thirtyMinutesPlus5.toISOString());

    const upcomingWebinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: thirtyMinutesMinus5,
          lte: thirtyMinutesPlus5
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    console.log(`📊 Webinars en 30 minutos encontrados: ${upcomingWebinars.length}`);

    const results = {
      webinarsProcessed: 0,
      emailsSent: 0,
      emailsFailed: 0,
      webinars: [] as any[]
    };

    for (const webinar of upcomingWebinars) {
      const webinarTime = new Date(webinar.dateTime);
      const timeUntilWebinar = webinarTime.getTime() - now.getTime();
      const minutesUntilWebinar = Math.floor(timeUntilWebinar / (1000 * 60));

      console.log(`\n🎯 Procesando: ${webinar.title}`);
      console.log(`📅 Fecha: ${webinarTime.toISOString()}`);
      console.log(`⏰ Minutos hasta webinar: ${minutesUntilWebinar}`);
      console.log(`👥 Usuarios registrados: ${webinar.registrations.length}`);

      // Verificar si ya se enviaron recordatorios de 30 minutos
      const reminderKey = `30min_reminder_sent_${webinar.id}_${webinarTime.toISOString().split('T')[0]}`;
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
        console.log('⚠️ Ya se enviaron recordatorios de 30 minutos para este webinar');
        continue;
      }

      console.log('📧 Enviando recordatorios de 30 minutos...');
      
      let success = 0;
      let failed = 0;

      // Enviar emails a todos los registrados
      for (const registration of webinar.registrations) {
        const result = await sendWebinarThirtyMinuteReminderEmail(webinar, registration);
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
            lastThirtyMinuteReminderSent: new Date().toISOString()
          }
        }
      });

      console.log(`✅ Recordatorios de 30 minutos enviados: ${success} exitosos, ${failed} fallidos`);
    }

    console.log('\n📊 Resumen del cron job de 30 minutos:');
    console.log(`📋 Webinars procesados: ${results.webinarsProcessed}`);
    console.log(`✅ Emails enviados: ${results.emailsSent}`);
    console.log(`❌ Emails fallidos: ${results.emailsFailed}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      type: '30-minute-reminder',
      results
    });

  } catch (error) {
    console.error('❌ Error en cron job de recordatorios de 30 minutos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando recordatorios de 30 minutos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}