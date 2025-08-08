import { prisma } from '../src/lib/prisma';

async function checkWebinarRegistrations() {
  try {
    console.log('🔍 VERIFICANDO REGISTROS DE WEBINAR EN PRODUCCIÓN');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Buscar webinars de hoy
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const webinars = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                emailVerified: true
              }
            }
          }
        }
      }
    });

    console.log(`\n📊 Webinars encontrados hoy: ${webinars.length}`);

    for (const webinar of webinars) {
      console.log(`\n🎯 WEBINAR: ${webinar.title}`);
      console.log(`📅 Fecha/Hora: ${webinar.dateTime}`);
      console.log(`📍 Estado: ${webinar.isActive ? 'Activo' : 'Inactivo'}`);
      console.log(`📝 Slug: ${webinar.slug}`);
      
      const totalRegistrations = webinar.registrations.length;
      const confirmedRegistrations = webinar.registrations.filter(r => r.isConfirmed).length;
      const unconfirmedRegistrations = webinar.registrations.filter(r => !r.isConfirmed).length;
      
      console.log(`\n👥 ESTADÍSTICAS DE REGISTRO:`);
      console.log(`📊 Total registros: ${totalRegistrations}`);
      console.log(`✅ Confirmados: ${confirmedRegistrations}`);
      console.log(`⚠️ Sin confirmar: ${unconfirmedRegistrations}`);

      if (totalRegistrations > 0) {
        console.log(`\n📋 DETALLE DE REGISTROS:`);
        webinar.registrations.forEach((reg, index) => {
          const fullName = `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || 'Sin nombre';
          console.log(`${index + 1}. ${reg.user.email} (${fullName})`);
          console.log(`   - Confirmado: ${reg.isConfirmed ? '✅ SÍ' : '❌ NO'}`);
          console.log(`   - Email verificado: ${reg.user.emailVerified ? '✅ SÍ' : '❌ NO'}`);
          console.log(`   - Fecha registro: ${reg.createdAt}`);
        });

        // Mostrar registros no confirmados que podrían confirmarse
        const unconfirmed = webinar.registrations.filter(r => !r.isConfirmed);
        if (unconfirmed.length > 0) {
          console.log(`\n⚠️ REGISTROS SIN CONFIRMAR:`);
          unconfirmed.forEach((reg, index) => {
            console.log(`${index + 1}. ${reg.user.email} - ID: ${reg.id}`);
          });
        }
      } else {
        console.log(`❌ NO HAY REGISTROS PARA ESTE WEBINAR`);
      }
    }

    // Verificar si el cron job se ejecutó
    console.log(`\n🔍 VERIFICANDO HISTORIAL DE CRON JOBS...`);
    
    // Buscar en los metadatos si hay registros de envío
    const webinarsWithMetadata = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      select: {
        id: true,
        title: true,
        // metadata: true // Si el campo existe
      }
    });

    console.log(`\n📊 RESUMEN FINAL:`);
    const totalUsers = webinars.reduce((acc, w) => acc + w.registrations.length, 0);
    const totalConfirmed = webinars.reduce((acc, w) => acc + w.registrations.filter(r => r.isConfirmed).length, 0);
    
    console.log(`👥 Total usuarios registrados hoy: ${totalUsers}`);
    console.log(`✅ Total confirmados: ${totalConfirmed}`);
    console.log(`❌ Total sin confirmar: ${totalUsers - totalConfirmed}`);

  } catch (error) {
    console.error('❌ Error verificando registros:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkWebinarRegistrations()
  .then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });