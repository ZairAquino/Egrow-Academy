import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEventReminderEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [SEND-REMINDERS] Iniciando envío de recordatorios');

    // Obtener la fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Buscar eventos que ocurren mañana
    const eventsTomorrow = await prisma.event.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfterTomorrow
        },
        isActive: true
      }
    });

    console.log(`📅 [SEND-REMINDERS] Encontrados ${eventsTomorrow.length} eventos para mañana`);

    let remindersSent = 0;
    let errors = 0;

    // Para cada evento, enviar recordatorios a los usuarios registrados
    for (const event of eventsTomorrow) {
      const registrations = await prisma.eventRegistration.findMany({
        where: {
          eventId: event.id,
          reminderSent: false // Solo enviar a quienes no han recibido recordatorio
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true
            }
          }
        }
      });

      console.log(`📧 [SEND-REMINDERS] Enviando recordatorios para evento: ${event.title} (${registrations.length} usuarios)`);

      for (const registration of registrations) {
        try {
          const emailResult = await sendEventReminderEmail(
            registration.user.email,
            registration.user.firstName,
            event.title,
            event.date,
            event.time,
            event.type,
            event.instructor
          );

          if (emailResult.success) {
            // Marcar como recordatorio enviado
            await prisma.eventRegistration.update({
              where: { id: registration.id },
              data: {
                reminderSent: true,
                reminderSentAt: new Date()
              }
            });

            remindersSent++;
            console.log(`✅ [SEND-REMINDERS] Recordatorio enviado a: ${registration.user.email}`);
          } else {
            errors++;
            console.error(`❌ [SEND-REMINDERS] Error enviando recordatorio a ${registration.user.email}:`, emailResult.error);
          }
        } catch (error) {
          errors++;
          console.error(`❌ [SEND-REMINDERS] Error procesando recordatorio para ${registration.user.email}:`, error);
        }
      }
    }

    console.log(`🎉 [SEND-REMINDERS] Proceso completado. Recordatorios enviados: ${remindersSent}, Errores: ${errors}`);

    return NextResponse.json({
      success: true,
      message: 'Recordatorios procesados',
      stats: {
        eventsProcessed: eventsTomorrow.length,
        remindersSent,
        errors
      }
    });

  } catch (error) {
    console.error('💥 [SEND-REMINDERS] Error completo:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 