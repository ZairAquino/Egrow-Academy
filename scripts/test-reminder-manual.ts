import { sendBulkWebinarReminders } from '../src/lib/email/webinar-email-service';
import { prisma } from '../src/lib/prisma';

async function testManualReminder() {
  console.log('🧪 Probando envío manual de recordatorios...\n');
  
  try {
    // Buscar el webinar de prueba
    const webinar = await prisma.webinar.findFirst({
      where: {
        slug: { contains: 'test-reminder-webinar' },
        isActive: true
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      }
    });
    
    if (!webinar) {
      console.log('❌ No se encontró el webinar de prueba');
      return;
    }
    
    console.log('📌 Webinar encontrado:', webinar.title);
    console.log('📅 Fecha:', new Date(webinar.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
    console.log('👥 Registros confirmados:', webinar.registrations.length);
    
    if (webinar.registrations.length === 0) {
      console.log('⚠️ No hay registros confirmados para enviar');
      return;
    }
    
    console.log('\n📧 Enviando recordatorios...');
    const result = await sendBulkWebinarReminders(webinar.id);
    
    console.log('\n✅ Resultado del envío:');
    console.log(`   - Emails exitosos: ${result.success}`);
    console.log(`   - Emails fallidos: ${result.failed}`);
    
    if (result.success > 0) {
      console.log('\n✅ Los recordatorios se están enviando correctamente!');
      console.log('📝 El sistema de cron job debería funcionar automáticamente');
    } else if (result.failed > 0) {
      console.log('\n⚠️ Hubo problemas enviando los emails');
      console.log('Verifica la configuración de Resend y las claves API');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testManualReminder()
  .catch(console.error)
  .finally(() => prisma.$disconnect());