import { config } from 'dotenv';
import { prisma } from '../src/lib/prisma';

// Cargar variables de entorno
config();

async function debugCronDetection() {
  console.log('🔍 Depurando detección de webinars en cron job\n');
  
  const now = new Date();
  const fourteenMinutesFromNow = new Date(now.getTime() + 14 * 60 * 1000);
  const sixteenMinutesFromNow = new Date(now.getTime() + 16 * 60 * 1000);
  
  console.log('⏰ Hora actual:', now.toISOString());
  console.log('⏰ Hora México:', now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
  console.log('🎯 Buscando webinars entre:');
  console.log('   - 14 min después:', fourteenMinutesFromNow.toISOString());
  console.log('   - 16 min después:', sixteenMinutesFromNow.toISOString());
  console.log('   - En México: ', fourteenMinutesFromNow.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }), 'a', sixteenMinutesFromNow.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
  
  try {
    // Esta es la misma lógica que usa el cron job
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
    
    console.log(`\n📊 Webinars encontrados en ventana: ${upcomingWebinars.length}`);
    
    if (upcomingWebinars.length === 0) {
      console.log('⚠️ No hay webinars en la ventana de 14-16 minutos');
      
      // Buscar todos los webinars activos próximos
      const allUpcoming = await prisma.webinar.findMany({
        where: {
          isActive: true,
          dateTime: { gte: now }
        },
        orderBy: { dateTime: 'asc' },
        take: 5
      });
      
      console.log(`\n📅 Webinars próximos (${allUpcoming.length}):`);
      for (const w of allUpcoming) {
        const timeUntil = new Date(w.dateTime).getTime() - now.getTime();
        const minutesUntil = Math.floor(timeUntil / (1000 * 60));
        
        console.log(`\n  📌 ${w.title}`);
        console.log(`     - Fecha UTC: ${w.dateTime}`);
        console.log(`     - Fecha México: ${new Date(w.dateTime).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
        console.log(`     - Minutos hasta el webinar: ${minutesUntil}`);
        console.log(`     - En ventana de recordatorio: ${minutesUntil >= 14 && minutesUntil <= 16 ? 'SÍ ✅' : 'NO ❌'}`);
      }
    } else {
      console.log('✅ Webinars que recibirían recordatorio:');
      upcomingWebinars.forEach(w => {
        console.log(`  - ${w.title} (${w.registrations.length} registros)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCronDetection().catch(console.error);