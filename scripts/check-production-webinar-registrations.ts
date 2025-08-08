import { PrismaClient } from '@prisma/client';

// URL de base de datos de producción
const DATABASE_URL = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

/**
 * Script para verificar los registros del webinar de hoy en PRODUCCIÓN
 * y obtener la lista de todos los usuarios confirmados
 */

async function checkProductionWebinarRegistrations() {
  try {
    console.log('🔍 Verificando webinars de hoy en PRODUCCIÓN...');
    console.log('🌐 Base de datos: ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech');
    
    // Obtener fecha de hoy en UTC
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    console.log('📅 Fecha actual:', today.toISOString());
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
      console.log('❌ No hay webinars programados para hoy en producción');
      
      // Buscar webinars cercanos para debug
      console.log('\n🔍 Buscando webinars en los próximos 7 días...');
      const upcomingWebinars = await prisma.webinar.findMany({
        where: {
          dateTime: {
            gte: today,
            lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          }
        },
        take: 5
      });
      
      console.log(`📅 Webinars próximos encontrados: ${upcomingWebinars.length}`);
      upcomingWebinars.forEach(w => {
        console.log(`   - ${w.title} - ${w.dateTime.toISOString()} (Activo: ${w.isActive})`);
      });
      
      return [];
    }

    // Mostrar información de cada webinar
    for (const webinar of webinarsToday) {
      console.log('\n' + '='.repeat(60));
      console.log('🎯 WEBINAR:', webinar.title);
      console.log('📅 Fecha y hora:', webinar.dateTime.toLocaleString('es-MX'));
      console.log('🌐 Fecha y hora UTC:', webinar.dateTime.toISOString());
      console.log('👥 Registrados confirmados:', webinar._count.registrations);
      console.log('🔗 Slug:', webinar.slug);
      console.log('✅ Activo:', webinar.isActive);
      console.log('🆔 ID:', webinar.id);
      
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
    console.log('✅ Verificación en PRODUCCIÓN completada');
    
    return webinarsToday;

  } catch (error) {
    console.error('❌ Error verificando registros en producción:', error);
    console.error('💡 Detalles:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
checkProductionWebinarRegistrations()
  .then((webinars) => {
    console.log(`\n🏁 Verificación en PRODUCCIÓN completada. ${webinars?.length || 0} webinars encontrados.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });