import { prisma } from '../src/lib/prisma';

async function checkProductionStatus() {
  console.log('🔍 Verificando estado de recordatorios en PRODUCCIÓN\n');
  console.log('Hora actual:', new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
  console.log('='.repeat(50));
  
  try {
    // Buscar webinars próximos
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    
    const webinars = await prisma.webinar.findMany({
      where: {
        isActive: true,
        dateTime: {
          gte: now,
          lte: thirtyMinutesFromNow
        }
      },
      include: {
        registrations: {
          where: { isConfirmed: true }
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    });
    
    console.log(`\n📅 Webinars en los próximos 30 minutos: ${webinars.length}`);
    
    for (const webinar of webinars) {
      const webinarTime = new Date(webinar.dateTime);
      const timeUntil = webinarTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(timeUntil / (1000 * 60));
      
      console.log(`\n📌 ${webinar.title}`);
      console.log(`   - ID: ${webinar.id}`);
      console.log(`   - Hora: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`   - Minutos hasta el webinar: ${minutesUntil}`);
      console.log(`   - Registros confirmados: ${webinar.registrations.length}`);
      
      // Verificar metadata
      const metadata = webinar.metadata as any || {};
      console.log('\n   📧 Estado de recordatorios:');
      
      // Buscar claves de recordatorio
      const reminderKeys = Object.keys(metadata).filter(k => k.startsWith('reminder_sent_'));
      if (reminderKeys.length > 0) {
        console.log('   ✅ Se han enviado recordatorios:');
        reminderKeys.forEach(key => {
          console.log(`      - ${key}: ${metadata[key]}`);
        });
      } else {
        console.log('   ⚠️ NO se han enviado recordatorios aún');
      }
      
      if (metadata.lastReminderSent) {
        const sentTime = new Date(metadata.lastReminderSent);
        console.log(`   - Último envío: ${sentTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      }
      
      // Verificar si está en ventana de recordatorio
      if (minutesUntil >= 14 && minutesUntil <= 16) {
        console.log('   ⏰ ESTÁ EN VENTANA DE RECORDATORIO AHORA MISMO');
      } else if (minutesUntil < 14) {
        console.log('   ⚠️ Ya pasó la ventana de recordatorio');
      }
      
      // Mostrar registros
      if (webinar.registrations.length > 0) {
        console.log('\n   👥 Usuarios registrados:');
        webinar.registrations.forEach(reg => {
          console.log(`      - ${reg.email} (${reg.firstName} ${reg.lastName})`);
        });
      }
    }
    
    // Verificar webinar específico de Monetiza con IA
    console.log('\n' + '='.repeat(50));
    console.log('\n🎯 Buscando webinar "Monetiza con IA":');
    
    const monetizaWebinar = await prisma.webinar.findFirst({
      where: {
        OR: [
          { title: { contains: 'Monetiza' } },
          { slug: { contains: 'monetiza' } }
        ]
      },
      include: {
        registrations: true
      }
    });
    
    if (monetizaWebinar) {
      const webinarTime = new Date(monetizaWebinar.dateTime);
      console.log(`\n✅ Encontrado: ${monetizaWebinar.title}`);
      console.log(`   - Hora programada: ${webinarTime.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`   - Total registros: ${monetizaWebinar.registrations.length}`);
      console.log(`   - Confirmados: ${monetizaWebinar.registrations.filter(r => r.isConfirmed).length}`);
      
      const luisReg = monetizaWebinar.registrations.find(r => r.email === 'luisdavid.ls47@gmail.com');
      if (luisReg) {
        console.log(`\n   ✅ Usuario luisdavid.ls47@gmail.com está registrado`);
        console.log(`      - Confirmado: ${luisReg.isConfirmed ? 'SÍ' : 'NO'}`);
        console.log(`      - Recordatorio enviado: ${luisReg.reminderSent ? 'SÍ' : 'NO'}`);
      } else {
        console.log(`\n   ❌ Usuario luisdavid.ls47@gmail.com NO está registrado`);
      }
    }
    
    // Verificar configuración
    console.log('\n' + '='.repeat(50));
    console.log('\n⚙️ CONFIGURACIÓN:');
    console.log('- CRON_SECRET:', process.env.CRON_SECRET ? '✅ Configurada' : '❌ NO configurada');
    console.log('- RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ NO configurada');
    console.log('- RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ NO configurada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductionStatus()
  .catch(console.error)
  .finally(() => prisma.$disconnect());