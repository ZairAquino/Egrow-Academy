import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdditionalWebinar() {
  try {
    console.log('🎯 Creando tercer webinar para el carrusel...\n');

    const webinar = {
      title: 'ChatGPT para Emprendedores: Automatiza tu Negocio',
      description: 'Aprende a usar ChatGPT y otras herramientas de IA para automatizar procesos, crear contenido y escalar tu emprendimiento de manera eficiente.',
      slug: 'chatgpt-emprendedores-automatizacion',
      shortDescription: 'Automatiza tu negocio con IA',
      imageUrl: '/images/webinar-chatgpt.jpg',
      videoUrl: null,
      dateTime: new Date('2025-08-25T19:00:00.000Z'),
      duration: 90,
      maxAttendees: 200,
      currentAttendees: 0,
      isActive: true,
      isFree: true,
      price: 0,
      category: 'Emprendimiento',
      tags: ['ChatGPT', 'Automatización', 'IA', 'Emprendimiento', 'Productividad'],
      hostName: 'Ana Martínez',
      hostBio: 'Especialista en automatización con IA y emprendedora digital con más de 5 años de experiencia ayudando a empresas a implementar soluciones de IA.',
      zoomLink: 'https://zoom.us/j/123456789?pwd=abcdefghijklmnop',
      meetingId: '123456789',
      password: 'egrow2025',
      recordingUrl: null
    };

    const createdWebinar = await prisma.webinar.create({
      data: webinar
    });
    
    console.log(`✅ Webinar creado: ${createdWebinar.title}`);
    console.log(`   📅 Fecha: ${createdWebinar.dateTime}`);
    console.log(`   👨‍💼 Ponente: ${createdWebinar.hostName}`);
    console.log(`   👥 Cupos: ${createdWebinar.maxAttendees}`);
    console.log(`   🏷️ Tags: ${createdWebinar.tags.join(', ')}`);
    console.log(`   🔗 Slug: ${createdWebinar.slug}`);

    console.log('\n🎉 Tercer webinar creado exitosamente!');
    console.log('📋 Ahora tienes 3 webinars para probar el carrusel:');
    console.log('   1. Monetiza con IA: Estrategias Prácticas');
    console.log('   2. Marketing Digital: Estrategias para 2025');
    console.log('   3. ChatGPT para Emprendedores: Automatiza tu Negocio');

  } catch (error) {
    console.error('❌ Error creando webinar:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdditionalWebinar(); 