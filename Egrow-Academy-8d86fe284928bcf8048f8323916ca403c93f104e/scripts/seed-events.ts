import { PrismaClient, EventType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  try {
    console.log('🌱 Iniciando seed de eventos...');

    // Crear eventos de ejemplo
    const events = [
             {
         title: '🎉 Lanzamiento: Monetizar con IA',
         description: 'Descubre cómo crear múltiples fuentes de ingresos usando inteligencia artificial. Aprende estrategias prácticas para monetizar tus habilidades en IA.',
         date: new Date('2025-07-25T12:00:00Z'),
         time: '12:00 - 13:30',
         type: EventType.LANZAMIENTO,
         category: 'Lanzamiento de Curso',
         instructor: 'Equipo eGrow Academy',
         image: '/images/monetiza-ia.png',
         maxAttendees: 200,
         isActive: true
       },
      {
        title: '🚀 Workshop: ChatGPT Avanzado',
        description: 'Aprende técnicas avanzadas de prompt engineering y optimización de ChatGPT para proyectos profesionales.',
        date: new Date('2025-08-12T15:00:00Z'),
        time: '15:00 - 17:00',
        type: EventType.WORKSHOP,
        category: 'Workshop Práctico',
        instructor: 'Dr. Ana Martínez',
        image: '/images/robot.png',
        maxAttendees: 100,
        isActive: true
      },
      {
        title: '💡 Webinar: IA en Marketing Digital',
        description: 'Descubre cómo implementar estrategias de IA en tu marketing digital para maximizar resultados.',
        date: new Date('2025-08-20T20:00:00Z'),
        time: '20:00 - 21:30',
        type: EventType.WEBINAR,
        category: 'Webinar Gratuito',
        instructor: 'Carlos López',
        image: '/images/v-5.png',
        maxAttendees: 300,
        isActive: true
      },
      {
        title: '🎯 Masterclass: Prompt Engineering',
        description: 'Domina el arte del prompt engineering para obtener resultados excepcionales de cualquier IA.',
        date: new Date('2025-08-28T18:00:00Z'),
        time: '18:00 - 19:30',
        type: EventType.MASTERCLASS,
        category: 'Masterclass Premium',
        instructor: 'María García',
        image: '/images/p1.png',
        maxAttendees: 150,
        isActive: true
      },
      {
        title: '🤖 Meetup: IA y Automatización',
        description: 'Conecta con otros profesionales y comparte experiencias sobre implementación de IA en empresas.',
        date: new Date('2025-09-05T19:00:00Z'),
        time: '19:00 - 21:00',
        type: EventType.MEETUP,
        category: 'Networking',
        instructor: 'Equipo eGrow Academy',
        image: '/images/Zair.jpeg',
        maxAttendees: 80,
        isActive: true
      }
    ];

    // Limpiar eventos existentes (si existen)
    try {
      await prisma.eventRegistration.deleteMany();
      await prisma.event.deleteMany();
      console.log('🧹 Eventos existentes eliminados');
    } catch (error) {
      console.log('ℹ️ No hay eventos existentes para eliminar');
    }

    // Crear nuevos eventos
    for (const eventData of events) {
      const event = await prisma.event.create({
        data: eventData
      });
      console.log(`✅ Evento creado: ${event.title} (ID: ${event.id})`);
    }

    console.log('🎉 Seed de eventos completado exitosamente');
  } catch (error) {
    console.error('❌ Error en seed de eventos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents(); 