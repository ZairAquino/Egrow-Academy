import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkWebinarRegistrations() {
  try {
    console.log('📊 Verificando registros de webinars...\n');

    // Obtener todos los webinars con sus registros
    const webinars = await prisma.webinar.findMany({
      include: {
        registrations: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { dateTime: 'asc' }
    });

    if (webinars.length === 0) {
      console.log('❌ No hay webinars en la base de datos');
      return;
    }

    console.log(`📋 Total de webinars: ${webinars.length}\n`);

    webinars.forEach((webinar, index) => {
      console.log(`🎯 Webinar ${index + 1}: ${webinar.title}`);
      console.log(`📅 Fecha: ${webinar.dateTime}`);
      console.log(`👨‍💼 Ponente: ${webinar.hostName}`);
      console.log(`👥 Registros: ${webinar.registrations.length}/${webinar.maxAttendees || 'Sin límite'}`);
      console.log(`🔗 Slug: ${webinar.slug}`);
      console.log(`✅ Activo: ${webinar.isActive ? 'Sí' : 'No'}`);

      if (webinar.registrations.length > 0) {
        console.log('\n📝 Registros:');
        webinar.registrations.forEach((registration, regIndex) => {
          console.log(`  ${regIndex + 1}. ${registration.firstName} ${registration.lastName}`);
          console.log(`     📧 ${registration.email}`);
          console.log(`     🏢 ${registration.company || 'No especificada'}`);
          console.log(`     📅 ${registration.createdAt.toLocaleString()}`);
          console.log(`     ✅ Confirmado: ${registration.isConfirmed ? 'Sí' : 'No'}`);
          if (registration.questions) {
            console.log(`     ❓ Pregunta: ${registration.questions}`);
          }
          console.log('');
        });
      } else {
        console.log('  📝 No hay registros aún\n');
      }

      console.log('─'.repeat(50));
    });

    // Estadísticas generales
    const totalRegistrations = webinars.reduce((total, webinar) => 
      total + webinar.registrations.length, 0
    );

    const confirmedRegistrations = webinars.reduce((total, webinar) => 
      total + webinar.registrations.filter(r => r.isConfirmed).length, 0
    );

    console.log('\n📊 Estadísticas Generales:');
    console.log(`- Total de webinars: ${webinars.length}`);
    console.log(`- Total de registros: ${totalRegistrations}`);
    console.log(`- Registros confirmados: ${confirmedRegistrations}`);
    console.log(`- Promedio por webinar: ${(totalRegistrations / webinars.length).toFixed(1)}`);

    // Webinar con más registros
    const mostPopularWebinar = webinars.reduce((max, webinar) => 
      webinar.registrations.length > max.registrations.length ? webinar : max
    );

    if (mostPopularWebinar.registrations.length > 0) {
      console.log(`\n🏆 Webinar más popular: ${mostPopularWebinar.title}`);
      console.log(`   Registros: ${mostPopularWebinar.registrations.length}`);
    }

  } catch (error) {
    console.error('❌ Error verificando registros:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWebinarRegistrations(); 