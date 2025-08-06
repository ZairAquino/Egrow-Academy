import { config } from 'dotenv';
import { prisma } from '../src/lib/prisma';

config();

async function createTestWebinarForCron() {
  console.log('🔧 Creando webinar de prueba para CRON automático\n');
  
  // Crear un webinar que comience en exactamente 20 minutos
  const now = new Date();
  const webinarTime = new Date(now.getTime() + 20 * 60 * 1000);
  const reminderTime = new Date(webinarTime.getTime() - 15 * 60 * 1000);
  
  console.log(`📅 Hora actual: ${now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
  console.log(`📅 Webinar programado: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
  console.log(`⏰ Recordatorio automático a las: ${reminderTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
  console.log(`⏰ En UTC: ${reminderTime.toISOString()}\n`);
  
  try {
    // Crear el webinar
    const webinar = await prisma.webinar.create({
      data: {
        title: `Test Cron Automático - ${Date.now()}`,
        slug: `test-cron-auto-${Date.now()}`,
        description: 'Webinar de prueba para verificar que el cron automático funcione.',
        shortDescription: 'Prueba cron automático',
        dateTime: webinarTime,
        duration: 60,
        hostName: 'Test Cron System',
        imageUrl: '/images/webinars/default.jpg',
        zoomLink: 'https://zoom.us/test-cron-auto',
        password: 'test123',
        maxAttendees: 100,
        isActive: true,
        isFree: true,
        price: 0,
        category: 'test',
        tags: ['prueba', 'cron', 'automatico']
      }
    });
    
    console.log('✅ Webinar creado:');
    console.log(`   - ID: ${webinar.id}`);
    console.log(`   - Título: ${webinar.title}`);
    
    // Crear registro de prueba
    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId: webinar.id,
        email: 'cron-test@egrowacademy.com',
        firstName: 'Test',
        lastName: 'Cron',
        phone: '+521234567890',
        isConfirmed: true
      }
    });
    
    console.log('\n✅ Registro creado:');
    console.log(`   - Email: ${registration.email}`);
    
    console.log('\n📋 INSTRUCCIONES:');
    console.log('1. El cron job debe ejecutarse automáticamente en 5 minutos');
    console.log(`2. A las ${reminderTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} debe llegar el email`);
    console.log('3. Monitorea tu email cron-test@egrowacademy.com');
    console.log('4. Si no llega, hay un problema con Vercel Cron');
    
    console.log('\n📝 Para verificar estado:');
    console.log('npx tsx scripts/debug-cron-detection.ts');
    
    return webinar;
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestWebinarForCron().catch(console.error);