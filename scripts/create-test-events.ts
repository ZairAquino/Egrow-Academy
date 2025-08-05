import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestEvents() {
  try {
    console.log('🎯 Creando eventos de prueba...\n');

    const events = [
      {
        title: 'Workshop de Inteligencia Artificial Práctica',
        description: 'Aprende a implementar IA en proyectos reales con casos de uso prácticos',
        type: 'WORKSHOP',
        startDate: new Date('2025-08-15T18:00:00.000Z'),
        endDate: new Date('2025-08-15T21:00:00.000Z'),
        maxCapacity: 50,
        isFree: true,
        location: 'Virtual',
        status: 'UPCOMING'
      },
      {
        title: 'Networking: Emprendedores en IA',
        description: 'Conecta con otros emprendedores y comparte experiencias en el mundo de la IA',
        type: 'NETWORKING',
        startDate: new Date('2025-08-18T20:00:00.000Z'),
        endDate: new Date('2025-08-18T22:00:00.000Z'),
        maxCapacity: 100,
        isFree: true,
        location: 'Virtual',
        status: 'UPCOMING'
      },
      {
        title: 'Masterclass: Marketing Digital con IA',
        description: 'Descubre cómo la IA está revolucionando el marketing digital',
        type: 'MASTERCLASS',
        startDate: new Date('2025-08-22T19:00:00.000Z'),
        endDate: new Date('2025-08-22T21:00:00.000Z'),
        maxCapacity: 75,
        isFree: true,
        location: 'Virtual',
        status: 'UPCOMING'
      },
      {
        title: 'Meetup: Comunidad de Desarrolladores IA',
        description: 'Reunión mensual de la comunidad de desarrolladores de IA',
        type: 'MEETUP',
        startDate: new Date('2025-08-25T16:00:00.000Z'),
        endDate: new Date('2025-08-25T18:00:00.000Z'),
        maxCapacity: 200,
        isFree: true,
        location: 'Virtual',
        status: 'UPCOMING'
      },
      {
        title: 'Conference: El Futuro de la IA en 2025',
        description: 'Conferencia anual sobre las últimas tendencias en IA',
        type: 'CONFERENCE',
        startDate: new Date('2025-08-28T21:00:00.000Z'),
        endDate: new Date('2025-08-28T23:00:00.000Z'),
        maxCapacity: 150,
        isFree: true,
        location: 'Virtual',
        status: 'UPCOMING'
      }
    ];

    for (const event of events) {
      const createdEvent = await prisma.event.create({
        data: event
      });
      
      console.log(`✅ Evento creado: ${createdEvent.title}`);
      console.log(`   📅 Fecha: ${createdEvent.startDate}`);
      console.log(`   🕐 Duración: ${createdEvent.startDate?.toLocaleTimeString()} - ${createdEvent.endDate?.toLocaleTimeString()}`);
      console.log(`   👥 Cupos: ${createdEvent.maxCapacity}`);
      console.log(`   🏢 Tipo: ${createdEvent.type}`);
      console.log('');
    }

    console.log('🎉 Todos los eventos de prueba han sido creados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- Total de eventos: ${events.length}`);
    console.log(`- Fechas: Del 15 al 28 de agosto 2025`);
    console.log(`- Tipos: WORKSHOP, NETWORKING, MASTERCLASS, MEETUP, CONFERENCE`);

  } catch (error) {
    console.error('❌ Error creando eventos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEvents(); 