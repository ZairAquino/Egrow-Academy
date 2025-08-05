import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBulkWebinarReminders } from '@/lib/email/webinar-email-service';

export async function GET(request: NextRequest) {
  try {
    // Verificar autorización (Vercel Cron Secret)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Ejecutando cron job de recordatorios de webinars...');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar webinars que están por comenzar (entre 14 y 16 minutos)
    const now = new Date();
    const fourteenMinutesFromNow = new Date(now.getTime() + 14 * 60 * 1000);
    const sixteenMinutesFromNow = new Date(now.getTime() + 16 * 60 * 1000);

    const upcomingWebinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: fourteenMinutesFromNow,
          lte: sixteenMinutesFromNow
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });

    console.log(`📊 Webinars próximos encontrados: ${upcomingWebinars.length}`);

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
      console.log(`⏰ Minutos hasta el webinar: ${minutesUntilWebinar}`);
      console.log(`👥 Usuarios registrados: ${webinar.registrations.length}`);

      // Verificar si ya se enviaron recordatorios
      const reminderKey = `reminder_sent_${webinar.id}_${webinarTime.toISOString().split('T')[0]}`;
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
        console.log('⚠️ Ya se enviaron recordatorios para este webinar');
        continue;
      }

      console.log('📧 Enviando recordatorios...');
      const result = await sendBulkWebinarReminders(webinar.id);
      
      results.webinarsProcessed++;
      results.emailsSent += result.success;
      results.emailsFailed += result.failed;
      
      results.webinars.push({
        title: webinar.title,
        dateTime: webinar.dateTime,
        registrations: webinar.registrations.length,
        emailsSent: result.success,
        emailsFailed: result.failed
      });

      // Marcar como enviado en metadata
      await prisma.webinar.update({
        where: { id: webinar.id },
        data: {
          metadata: {
            ...webinar.metadata as any,
            [reminderKey]: true,
            lastReminderSent: new Date().toISOString()
          }
        }
      });

      console.log(`✅ Recordatorios enviados: ${result.success} exitosos, ${result.failed} fallidos`);
    }

    console.log('\n📊 Resumen del cron job:');
    console.log(`📋 Webinars procesados: ${results.webinarsProcessed}`);
    console.log(`✅ Emails enviados: ${results.emailsSent}`);
    console.log(`❌ Emails fallidos: ${results.emailsFailed}`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });

  } catch (error) {
    console.error('❌ Error en cron job de recordatorios:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error procesando recordatorios',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Endpoint para pruebas manuales (solo en desarrollo)
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  // Ejecutar sin verificación de autorización para pruebas
  console.log('🧪 Ejecutando prueba manual de recordatorios...');
  
  const now = new Date();
  const upcomingWebinars = await prisma.webinar.findMany({
    where: {
      isActive: true,
      dateTime: {
        gte: now,
        lte: new Date(now.getTime() + 30 * 60 * 1000) // Próximos 30 minutos
      }
    },
    include: {
      registrations: {
        where: { isConfirmed: true }
      }
    }
  });

  const results = [];
  for (const webinar of upcomingWebinars) {
    const result = await sendBulkWebinarReminders(webinar.id);
    results.push({
      webinar: webinar.title,
      ...result
    });
  }

  return NextResponse.json({
    success: true,
    test: true,
    results
  });
}