import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    console.log('🔍 Verificando eventos en la base de datos...');
    
    const events = await prisma.event.findMany({
      include: {
        registrations: true
      }
    });
    
    console.log(`✅ Encontrados ${events.length} eventos:`);
    
    events.forEach((event, index) => {
      console.log(`\n📅 Evento ${index + 1}:`);
      console.log(`   ID: ${event.id}`);
      console.log(`   Título: ${event.title}`);
      console.log(`   Descripción: ${event.description}`);
      console.log(`   Fecha de inicio: ${event.startDate}`);
      console.log(`   Fecha de fin: ${event.endDate}`);
      console.log(`   Tipo: ${event.type}`);
      console.log(`   Estado: ${event.status}`);
      console.log(`   Capacidad máxima: ${event.maxCapacity}`);
      console.log(`   Capacidad actual: ${event.currentCapacity}`);
      console.log(`   Es gratis: ${event.isFree}`);
      console.log(`   Precio: ${event.price}`);
      console.log(`   Registros: ${event.registrations.length}`);
    });
    
    if (events.length === 0) {
      console.log('\n⚠️ No hay eventos en la base de datos.');
      console.log('💡 Puedes crear eventos usando el script seed-events.ts');
    }
    
  } catch (error) {
    console.error('❌ Error verificando eventos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents(); 