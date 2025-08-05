import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createMoreWebinars() {
  try {
    console.log('🎯 Creando 3 webinars adicionales para completar el carrusel...\n');

    const webinars = [
      {
        title: 'Desarrollo Web Full Stack con IA: De Cero a Profesional',
        description: 'Aprende a crear aplicaciones web completas integrando herramientas de IA. Desde el frontend hasta el backend, incluyendo ChatGPT, GitHub Copilot y más.',
        slug: 'desarrollo-web-fullstack-ia',
        shortDescription: 'Desarrollo web completo con IA',
        imageUrl: '/images/webinar-fullstack.jpg',
        videoUrl: null,
        dateTime: new Date('2025-08-30T18:00:00.000Z'),
        duration: 120,
        maxAttendees: 150,
        currentAttendees: 0,
        isActive: true,
        isFree: true,
        price: 0,
        category: 'Desarrollo Web',
        tags: ['Full Stack', 'IA', 'Desarrollo Web', 'ChatGPT', 'GitHub Copilot'],
        hostName: 'David López',
        hostBio: 'Desarrollador full stack senior con 8 años de experiencia. Especialista en integración de IA en aplicaciones web y mentor de más de 500 desarrolladores.',
        zoomLink: 'https://zoom.us/j/111222333?pwd=abcdefghijklmnop',
        meetingId: '111222333',
        password: 'fullstack2025',
        recordingUrl: null
      },
      {
        title: 'Data Science para Negocios: Análisis Predictivo con Python',
        description: 'Domina el análisis de datos y machine learning para tomar decisiones empresariales basadas en datos. Aprende Python, pandas, scikit-learn y más.',
        slug: 'data-science-negocios-python',
        shortDescription: 'Análisis predictivo para negocios',
        imageUrl: '/images/webinar-datascience.jpg',
        videoUrl: null,
        dateTime: new Date('2025-09-02T20:00:00.000Z'),
        duration: 150,
        maxAttendees: 100,
        currentAttendees: 0,
        isActive: true,
        isFree: true,
        price: 0,
        category: 'Data Science',
        tags: ['Python', 'Data Science', 'Machine Learning', 'Análisis Predictivo', 'Pandas'],
        hostName: 'Dr. Laura Fernández',
        hostBio: 'PhD en Ciencias de la Computación con especialización en machine learning. Ha trabajado en empresas Fortune 500 y es autora de varios papers científicos.',
        zoomLink: 'https://zoom.us/j/444555666?pwd=abcdefghijklmnop',
        meetingId: '444555666',
        password: 'datascience2025',
        recordingUrl: null
      },
      {
        title: 'Ciberseguridad en la Era de la IA: Protege tu Empresa',
        description: 'Aprende las mejores prácticas de ciberseguridad en un mundo dominado por la IA. Desde amenazas emergentes hasta estrategias de protección avanzadas.',
        slug: 'ciberseguridad-ia-proteccion',
        shortDescription: 'Ciberseguridad en la era de la IA',
        imageUrl: '/images/webinar-cybersecurity.jpg',
        videoUrl: null,
        dateTime: new Date('2025-09-05T19:00:00.000Z'),
        duration: 90,
        maxAttendees: 120,
        currentAttendees: 0,
        isActive: true,
        isFree: true,
        price: 0,
        category: 'Ciberseguridad',
        tags: ['Ciberseguridad', 'IA', 'Protección', 'Amenazas', 'Seguridad Digital'],
        hostName: 'Carlos Mendoza',
        hostBio: 'Experto en ciberseguridad con 12 años de experiencia. Certificado CISSP, CEH y ha trabajado protegiendo infraestructuras críticas de gobiernos y empresas.',
        zoomLink: 'https://zoom.us/j/777888999?pwd=abcdefghijklmnop',
        meetingId: '777888999',
        password: 'security2025',
        recordingUrl: null
      }
    ];

    for (const webinar of webinars) {
      const createdWebinar = await prisma.webinar.create({
        data: webinar
      });
      
      console.log(`✅ Webinar creado: ${createdWebinar.title}`);
      console.log(`   📅 Fecha: ${createdWebinar.dateTime}`);
      console.log(`   👨‍💼 Ponente: ${createdWebinar.hostName}`);
      console.log(`   👥 Cupos: ${createdWebinar.maxAttendees}`);
      console.log(`   🏷️ Tags: ${createdWebinar.tags.join(', ')}`);
      console.log(`   🔗 Slug: ${createdWebinar.slug}`);
      console.log('');
    }

    console.log('🎉 3 webinars adicionales creados exitosamente!');
    console.log('\n📋 Ahora tienes 6 webinars para probar el carrusel:');
    console.log('   Página 1:');
    console.log('   1. Monetiza con IA: Estrategias Prácticas');
    console.log('   2. Marketing Digital: Estrategias para 2025');
    console.log('   3. ChatGPT para Emprendedores: Automatiza tu Negocio');
    console.log('   Página 2:');
    console.log('   4. Desarrollo Web Full Stack con IA');
    console.log('   5. Data Science para Negocios: Análisis Predictivo');
    console.log('   6. Ciberseguridad en la Era de la IA');

  } catch (error) {
    console.error('❌ Error creando webinars:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMoreWebinars(); 