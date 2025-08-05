import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestWebinar() {
  try {
    console.log('🔄 Creando webinar de prueba...');

    const testWebinar = await prisma.webinar.create({
      data: {
        title: 'Monetiza con IA: Estrategias Prácticas para 2024',
        slug: 'monetiza-con-ia-estrategias-practicas-2024',
        description: 'Descubre cómo generar ingresos utilizando inteligencia artificial. En este webinar gratuito aprenderás estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos. Perfecto para emprendedores, freelancers y profesionales que quieren aprovechar la revolución de la IA.',
        shortDescription: 'Aprende a generar ingresos con IA en este webinar gratuito',
        imageUrl: '/images/optimized/monetiza-ia.webp',
        dateTime: new Date('2024-12-15T19:00:00Z'), // 15 de diciembre a las 7 PM
        duration: 90, // 90 minutos
        maxAttendees: 100,
        isFree: true,
        price: 0,
        category: 'IA_PARA_EMPRENDER',
        tags: ['IA', 'Monetización', 'Emprendimiento', 'Tecnología'],
        hostName: 'Carlos Rodríguez',
        hostBio: 'Experto en IA y emprendimiento digital con más de 10 años de experiencia ayudando a empresas a implementar soluciones de inteligencia artificial.',
        zoomLink: 'https://zoom.us/j/123456789',
        meetingId: '123456789',
        password: 'egrow2024'
      }
    });

    console.log('✅ Webinar creado exitosamente:');
    console.log('📝 Título:', testWebinar.title);
    console.log('🔗 Slug:', testWebinar.slug);
    console.log('📅 Fecha:', testWebinar.dateTime);
    console.log('⏱️ Duración:', testWebinar.duration, 'minutos');
    console.log('👥 Cupos:', testWebinar.maxAttendees);
    console.log('💰 Precio:', testWebinar.isFree ? 'Gratis' : `$${testWebinar.price}`);
    console.log('👨‍💼 Ponente:', testWebinar.hostName);
    console.log('🏷️ Tags:', testWebinar.tags.join(', '));

    console.log('\n🌐 URL del webinar:');
    console.log(`http://localhost:3000/webinar/${testWebinar.slug}`);

    console.log('\n📧 Para probar el registro, visita la URL anterior y completa el formulario.');

  } catch (error) {
    console.error('❌ Error creando webinar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createTestWebinar(); 