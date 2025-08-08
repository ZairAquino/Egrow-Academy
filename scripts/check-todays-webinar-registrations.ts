import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para verificar los registros del webinar de hoy
 * y obtener la lista de todos los usuarios confirmados
 */

async function checkTodaysWebinarRegistrations() {
  try {
    console.log('🔍 Verificando webinars de hoy...');
    
    // Obtener fecha de hoy en UTC
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    console.log('📅 Buscando webinars entre:', startOfDay.toISOString(), 'y', endOfDay.toISOString());
    
    // Buscar webinars de hoy
    const webinarsToday = await prisma.webinar.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay
        },
        isActive: true
      },
      include: {
        registrations: {
          where: {
            isConfirmed: true
          }
        },
        _count: {
          select: {
            registrations: {
              where: {
                isConfirmed: true
              }
            }
          }
        }
      }
    });

    console.log(`📊 Encontrados ${webinarsToday.length} webinars activos para hoy`);
    
    if (webinarsToday.length === 0) {
      console.log('❌ No hay webinars programados para hoy');
      return;
    }

    // Mostrar información de cada webinar
    for (const webinar of webinarsToday) {
      console.log('\n' + '='.repeat(60));
      console.log('🎯 WEBINAR:', webinar.title);
      console.log('📅 Fecha y hora:', webinar.dateTime.toLocaleString('es-MX'));
      console.log('👥 Registrados confirmados:', webinar._count.registrations);
      console.log('🔗 Slug:', webinar.slug);
      console.log('✅ Activo:', webinar.isActive);
      
      if (webinar.registrations.length > 0) {
        console.log('\n📧 LISTA DE REGISTRADOS CONFIRMADOS:');
        console.log('-'.repeat(40));
        
        webinar.registrations.forEach((registration, index) => {
          console.log(`${index + 1}. ${registration.firstName} ${registration.lastName} - ${registration.email}`);
        });
        
        console.log(`\n📊 Total de correos a enviar: ${webinar.registrations.length}`);
        
        // Generar lista de emails para copiar
        const emailList = webinar.registrations.map(r => r.email);
        console.log('\n📋 Lista de emails (separados por coma):');
        console.log(emailList.join(', '));
        
      } else {
        console.log('⚠️ No hay registrados confirmados para este webinar');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Verificación completada');
    
    return webinarsToday;

  } catch (error) {
    console.error('❌ Error verificando registros:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
checkTodaysWebinarRegistrations()
  .then((webinars) => {
    console.log(`\n🏁 Verificación completada. ${webinars?.length || 0} webinars encontrados.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });