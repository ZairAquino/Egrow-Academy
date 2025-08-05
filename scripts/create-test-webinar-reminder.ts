import { prisma } from '../src/lib/prisma';

async function createTestWebinar() {
  console.log('🔧 Creando webinar de prueba para recordatorios...\n');
  
  // Crear un webinar que comience en 20 minutos
  const now = new Date();
  const webinarTime = new Date(now.getTime() + 20 * 60 * 1000); // 20 minutos desde ahora
  
  console.log(`📅 Hora actual: ${now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
  console.log(`📅 Hora del webinar: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
  console.log(`⏰ El recordatorio se enviará en ~5 minutos (15 min antes del webinar)\n`);
  
  try {
    // Crear el webinar
    const webinar = await prisma.webinar.create({
      data: {
        title: 'Webinar de Prueba - Sistema de Recordatorios',
        slug: 'test-reminder-webinar-' + Date.now(),
        description: 'Este es un webinar de prueba para verificar el sistema de recordatorios automáticos.',
        shortDescription: 'Prueba del sistema de recordatorios',
        dateTime: webinarTime,
        duration: 60,
        hostName: 'Sistema de Pruebas',
        imageUrl: '/images/webinars/default.jpg',
        zoomLink: 'https://zoom.us/test-webinar',
        password: 'test123',
        maxAttendees: 100,
        isActive: true,
        isFree: true,
        price: 0,
        category: 'test',
        tags: ['prueba', 'recordatorios']
      }
    });
    
    console.log('✅ Webinar creado exitosamente:');
    console.log(`   - ID: ${webinar.id}`);
    console.log(`   - Título: ${webinar.title}`);
    console.log(`   - Slug: ${webinar.slug}`);
    
    // Crear un registro de prueba
    const registration = await prisma.webinarRegistration.create({
      data: {
        webinarId: webinar.id,
        email: 'test@egrowacademy.com',
        firstName: 'Usuario',
        lastName: 'Prueba',
        phone: '+521234567890',
        isConfirmed: true
      }
    });
    
    console.log('\n✅ Registro de prueba creado:');
    console.log(`   - Email: ${registration.email}`);
    console.log(`   - Nombre: ${registration.firstName} ${registration.lastName}`);
    console.log(`   - Confirmado: ${registration.isConfirmed}`);
    
    console.log('\n📝 INSTRUCCIONES:');
    console.log('1. El cron job está configurado para ejecutarse cada minuto');
    console.log('2. En aproximadamente 5 minutos debería detectar este webinar');
    console.log('3. Enviará un email de recordatorio al correo test@egrowacademy.com');
    console.log('4. Puedes verificar el estado con: npx tsx scripts/check-webinar-reminders.ts');
    console.log('\n⚠️ IMPORTANTE:');
    console.log('- Asegúrate de que el servidor esté corriendo (npm run dev)');
    console.log('- El CRON_SECRET debe estar configurado en Vercel para producción');
    console.log('- Puedes probar manualmente con: curl -X POST http://localhost:3000/api/cron/webinar-reminders');
    
    return webinar;
  } catch (error) {
    console.error('❌ Error creando webinar de prueba:', error);
    throw error;
  }
}

createTestWebinar()
  .then(() => {
    console.log('\n✅ Proceso completado exitosamente');
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());