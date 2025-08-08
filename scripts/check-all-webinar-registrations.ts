import { prisma } from '../src/lib/prisma';

async function checkAllWebinarRegistrations() {
  try {
    console.log('🔍 VERIFICANDO TODOS LOS REGISTROS DE WEBINAR');
    console.log('⏰ Hora actual:', new Date().toISOString());
    console.log('🌍 Zona horaria local:', Intl.DateTimeFormat().resolvedOptions().timeZone);

    // Primero buscar TODOS los webinars activos recientes
    console.log('\n📊 BUSCANDO TODOS LOS WEBINARS ACTIVOS...');
    
    const allActiveWebinars = await prisma.webinar.findMany({
      where: {
        isActive: true
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
      },
      orderBy: {
        dateTime: 'desc'
      }
    });

    console.log(`📊 Total webinars activos encontrados: ${allActiveWebinars.length}`);

    for (const webinar of allActiveWebinars) {
      const webinarDate = new Date(webinar.dateTime);
      const now = new Date();
      const timeDiff = webinarDate.getTime() - now.getTime();
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      console.log(`\n🎯 WEBINAR: ${webinar.title}`);
      console.log(`📅 Fecha/Hora UTC: ${webinarDate.toISOString()}`);
      console.log(`📅 Fecha/Hora Local: ${webinarDate.toLocaleString()}`);
      console.log(`⏰ Tiempo restante: ${hoursDiff}h ${minutesDiff}m`);
      console.log(`📍 Estado: ${webinar.isActive ? 'Activo' : 'Inactivo'}`);
      console.log(`📝 Slug: ${webinar.slug}`);
      console.log(`🆔 ID: ${webinar.id}`);
      
      const totalRegistrations = webinar.registrations.length;
      const confirmedRegistrations = webinar.registrations.filter(r => r.isConfirmed).length;
      const unconfirmedRegistrations = webinar.registrations.filter(r => !r.isConfirmed).length;
      
      console.log(`\n👥 ESTADÍSTICAS DE REGISTRO:`);
      console.log(`📊 Total registros: ${totalRegistrations}`);
      console.log(`✅ Confirmados: ${confirmedRegistrations}`);
      console.log(`⚠️ Sin confirmar: ${unconfirmedRegistrations}`);

      // Si este es el webinar de hoy (con registros), mostrarlo en detalle
      if (totalRegistrations > 0 && Math.abs(timeDiff) < 24 * 60 * 60 * 1000) {
        console.log(`\n📋 PRIMEROS 10 REGISTROS:`);
        webinar.registrations.slice(0, 10).forEach((reg, index) => {
          const fullName = `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || 'Sin nombre';
          console.log(`${index + 1}. ${reg.user.email} (${fullName})`);
          console.log(`   - Confirmado: ${reg.isConfirmed ? '✅ SÍ' : '❌ NO'}`);
          console.log(`   - Email verificado: ${reg.user.emailVerified ? '✅ SÍ' : '❌ NO'}`);
          console.log(`   - ID Registro: ${reg.id}`);
        });

        if (totalRegistrations > 10) {
          console.log(`   ... y ${totalRegistrations - 10} registros más`);
        }
      }
    }

    // Buscar específicamente el webinar por slug
    console.log(`\n🔍 BÚSQUEDA ESPECÍFICA POR SLUG...`);
    const specificWebinar = await prisma.webinar.findFirst({
      where: {
        slug: 'videos-profesionales-ia',
        isActive: true
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

    if (specificWebinar) {
      console.log(`\n🎯 WEBINAR ESPECÍFICO ENCONTRADO:`);
      console.log(`📊 Total registros: ${specificWebinar.registrations.length}`);
      console.log(`✅ Confirmados: ${specificWebinar.registrations.filter(r => r.isConfirmed).length}`);
      console.log(`🆔 ID Webinar: ${specificWebinar.id}`);
      console.log(`📅 Fecha: ${specificWebinar.dateTime}`);
      
      if (specificWebinar.registrations.length > 0) {
        console.log(`\n📧 EMAILS DE REGISTRADOS:`);
        specificWebinar.registrations.forEach((reg, index) => {
          console.log(`${index + 1}. ${reg.user.email} (Confirmado: ${reg.isConfirmed})`);
        });
      }
    } else {
      console.log(`❌ NO SE ENCONTRÓ EL WEBINAR ESPECÍFICO`);
    }

    // Contar registros totales por estado
    const totalRegistrations = allActiveWebinars.reduce((acc, w) => acc + w.registrations.length, 0);
    const totalConfirmed = allActiveWebinars.reduce((acc, w) => acc + w.registrations.filter(r => r.isConfirmed).length, 0);
    
    console.log(`\n📊 RESUMEN GLOBAL:`);
    console.log(`👥 Total usuarios registrados: ${totalRegistrations}`);
    console.log(`✅ Total confirmados: ${totalConfirmed}`);
    console.log(`❌ Total sin confirmar: ${totalRegistrations - totalConfirmed}`);

  } catch (error) {
    console.error('❌ Error verificando registros:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkAllWebinarRegistrations()
  .then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });