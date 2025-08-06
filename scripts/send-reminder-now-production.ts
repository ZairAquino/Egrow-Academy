import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';
import { prisma } from '../src/lib/prisma';

async function sendReminderNow() {
  console.log('🚨 ENVIANDO RECORDATORIO MANUAL DE EMERGENCIA\n');
  console.log('Hora actual:', new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
  
  try {
    // Buscar el webinar de Monetiza con IA
    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: 'monetiza-con-ia-estrategias-practicas-2024'
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });
    
    if (!webinar) {
      console.log('❌ Webinar no encontrado');
      return;
    }
    
    console.log(`📌 Webinar: ${webinar.title}`);
    console.log(`📅 Fecha: ${new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
    console.log(`👥 Usuarios confirmados: ${webinar.registrations.length}`);
    
    webinar.registrations.forEach(reg => {
      console.log(`   - ${reg.email} (${reg.firstName} ${reg.lastName})`);
    });
    
    console.log('\n📧 Enviando recordatorios...');
    const result = await sendBulkWebinarReminders(webinar.id);
    
    console.log('\n✅ RESULTADO:');
    console.log(`   - Emails exitosos: ${result.success}`);
    console.log(`   - Emails fallidos: ${result.failed}`);
    
    if (result.success > 0) {
      console.log('\n🎉 ¡Recordatorios enviados exitosamente!');
      console.log('Los usuarios ahora tienen el link de Zoom en su email');
    }
    
    // Verificar que se marcó en metadata
    const updatedWebinar = await prisma.webinar.findUnique({
      where: { id: webinar.id }
    });
    
    console.log('\nMetadata actualizada:', JSON.stringify(updatedWebinar?.metadata, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

sendReminderNow()
  .catch(console.error)
  .finally(() => prisma.$disconnect());