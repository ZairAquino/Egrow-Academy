import { prisma } from '../src/lib/prisma';

async function checkWebinarReminders() {
  console.log('🔍 Verificando sistema de recordatorios de webinars\n');
  console.log('='.repeat(50));
  
  // 1. Verificar variables de entorno
  console.log('\n📋 VARIABLES DE ENTORNO:');
  console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ NO CONFIGURADA');
  console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ NO CONFIGURADA');
  console.log('- CRON_SECRET:', process.env.CRON_SECRET ? '✅ Configurada' : '❌ NO CONFIGURADA (Necesaria para Vercel)');
  
  // 2. Verificar webinars
  console.log('\n📅 WEBINARS EN BASE DE DATOS:');
  const webinars = await prisma.webinar.findMany({
    include: {
      registrations: true
    },
    orderBy: {
      dateTime: 'asc'
    }
  });
  
  console.log(`Total de webinars: ${webinars.length}`);
  
  const now = new Date();
  const upcomingWebinars = webinars.filter(w => new Date(w.dateTime) > now);
  const pastWebinars = webinars.filter(w => new Date(w.dateTime) <= now);
  
  console.log(`- Próximos: ${upcomingWebinars.length}`);
  console.log(`- Pasados: ${pastWebinars.length}`);
  
  // 3. Detalles de webinars próximos
  if (upcomingWebinars.length > 0) {
    console.log('\n🎯 WEBINARS PRÓXIMOS:');
    for (const webinar of upcomingWebinars) {
      const dateTime = new Date(webinar.dateTime);
      const timeUntilWebinar = dateTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeUntilWebinar / (1000 * 60));
      const hoursUntil = Math.floor(minutesUntil / 60);
      
      console.log(`\n📌 ${webinar.title}`);
      console.log(`   - ID: ${webinar.id}`);
      console.log(`   - Fecha/Hora: ${dateTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })} (México)`);
      console.log(`   - Tiempo hasta el webinar: ${hoursUntil}h ${minutesUntil % 60}m`);
      console.log(`   - Estado: ${webinar.isActive ? '✅ Activo' : '❌ Inactivo'}`);
      console.log(`   - Registros totales: ${webinar.registrations.length}`);
      console.log(`   - Registros confirmados: ${webinar.registrations.filter(r => r.isConfirmed).length}`);
      
      // Verificar si está en ventana de recordatorio (14-16 minutos)
      if (minutesUntil >= 14 && minutesUntil <= 16) {
        console.log(`   ⏰ EN VENTANA DE RECORDATORIO (15 min antes)`);
      }
      
      // Verificar metadata de recordatorios enviados
      if (webinar.metadata) {
        const metadata = webinar.metadata as any;
        const reminderKeys = Object.keys(metadata).filter(k => k.startsWith('reminder_sent_'));
        if (reminderKeys.length > 0) {
          console.log(`   📧 Recordatorios enviados:`);
          reminderKeys.forEach(key => {
            console.log(`      - ${key}: ${metadata[key]}`);
          });
          if (metadata.lastReminderSent) {
            console.log(`      - Último envío: ${new Date(metadata.lastReminderSent).toLocaleString()}`);
          }
        }
      }
    }
  }
  
  // 4. Verificar registros sin confirmar
  console.log('\n📊 ESTADÍSTICAS DE REGISTROS:');
  const allRegistrations = await prisma.webinarRegistration.findMany();
  const confirmedRegistrations = allRegistrations.filter(r => r.isConfirmed);
  const unconfirmedRegistrations = allRegistrations.filter(r => !r.isConfirmed);
  
  console.log(`- Total de registros: ${allRegistrations.length}`);
  console.log(`- Confirmados: ${confirmedRegistrations.length}`);
  console.log(`- Sin confirmar: ${unconfirmedRegistrations.length}`);
  
  // 5. Próximo webinar que necesitará recordatorio
  if (upcomingWebinars.length > 0) {
    const nextWebinar = upcomingWebinars[0];
    const nextDateTime = new Date(nextWebinar.dateTime);
    const reminderTime = new Date(nextDateTime.getTime() - 15 * 60 * 1000);
    
    console.log('\n⏰ PRÓXIMO RECORDATORIO:');
    console.log(`Webinar: ${nextWebinar.title}`);
    console.log(`Hora del webinar: ${nextDateTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
    console.log(`Recordatorio se enviará: ${reminderTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
    
    if (reminderTime < now) {
      console.log('⚠️ El tiempo de recordatorio ya pasó');
    } else {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      const minutesUntilReminder = Math.floor(timeUntilReminder / (1000 * 60));
      const hoursUntilReminder = Math.floor(minutesUntilReminder / 60);
      console.log(`Tiempo hasta el recordatorio: ${hoursUntilReminder}h ${minutesUntilReminder % 60}m`);
    }
  }
  
  // 6. Resumen de problemas encontrados
  console.log('\n⚠️ PROBLEMAS DETECTADOS:');
  const problems = [];
  
  if (!process.env.RESEND_API_KEY) {
    problems.push('❌ RESEND_API_KEY no está configurada');
  }
  if (!process.env.CRON_SECRET) {
    problems.push('❌ CRON_SECRET no está configurada (necesaria para Vercel Cron)');
  }
  if (upcomingWebinars.filter(w => w.isActive).length === 0) {
    problems.push('⚠️ No hay webinars activos próximos');
  }
  if (upcomingWebinars.some(w => w.registrations.filter(r => r.isConfirmed).length === 0)) {
    problems.push('⚠️ Hay webinars sin registros confirmados');
  }
  
  if (problems.length === 0) {
    console.log('✅ Todo parece estar configurado correctamente');
  } else {
    problems.forEach(p => console.log(p));
    
    console.log('\n📝 SOLUCIONES:');
    if (!process.env.CRON_SECRET) {
      console.log('1. Agregar CRON_SECRET al archivo .env:');
      console.log('   CRON_SECRET="tu-clave-secreta-aqui"');
      console.log('2. Configurar la misma clave en Vercel:');
      console.log('   vercel env add CRON_SECRET production');
    }
  }
  
  console.log('\n' + '='.repeat(50));
}

checkWebinarReminders()
  .catch(console.error)
  .finally(() => prisma.$disconnect());