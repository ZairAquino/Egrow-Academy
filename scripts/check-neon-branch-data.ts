import { PrismaClient } from '@prisma/client';

// Conectar directamente a la rama específica
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkNeonBranchData() {
  try {
    console.log('🔍 CONECTANDO A RAMA ESPECÍFICA DE NEON');
    console.log('⏰ Hora actual:', new Date().toISOString());
    
    // Probar la conexión
    console.log('\n📡 PROBANDO CONEXIÓN...');
    await prisma.$connect();
    console.log('✅ Conexión establecida');

    // Verificar todas las tablas relacionadas con webinars
    console.log('\n📊 VERIFICANDO TABLAS...');
    
    const webinarCount = await prisma.webinar.count();
    console.log(`📋 Webinars: ${webinarCount}`);
    
    const registrationCount = await prisma.webinarRegistration.count();
    console.log(`📝 WebinarRegistrations: ${registrationCount}`);

    // Si hay registraciones, mostrarlas
    if (registrationCount > 0) {
      console.log('\n🎯 REGISTRACIONES ENCONTRADAS:');
      
      const registrations = await prisma.webinarRegistration.findMany({
        include: {
          webinar: {
            select: {
              title: true,
              slug: true,
              dateTime: true
            }
          },
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`📊 Total registraciones: ${registrations.length}`);
      
      // Agrupar por webinar
      const byWebinar = registrations.reduce((acc, reg) => {
        const key = reg.webinar.slug;
        if (!acc[key]) {
          acc[key] = {
            webinar: reg.webinar,
            registrations: []
          };
        }
        acc[key].registrations.push(reg);
        return acc;
      }, {} as any);

      Object.entries(byWebinar).forEach(([slug, data]: [string, any]) => {
        console.log(`\n🎯 WEBINAR: ${data.webinar.title}`);
        console.log(`📝 Slug: ${slug}`);
        console.log(`📅 Fecha: ${data.webinar.dateTime}`);
        console.log(`👥 Registrados: ${data.registrations.length}`);
        console.log(`✅ Confirmados: ${data.registrations.filter((r: any) => r.isConfirmed).length}`);
        
        console.log(`\n📧 PRIMEROS 10 EMAILS:`);
        data.registrations.slice(0, 10).forEach((reg: any, index: number) => {
          const name = `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || 'Sin nombre';
          console.log(`${index + 1}. ${reg.user.email} (${name}) - Confirmado: ${reg.isConfirmed}`);
        });

        if (data.registrations.length > 10) {
          console.log(`   ... y ${data.registrations.length - 10} más`);
        }
      });
    }

    // Buscar específicamente registros para el webinar de hoy
    console.log('\n🔍 BÚSQUEDA ESPECÍFICA PARA WEBINAR DE HOY...');
    const todayWebinar = await prisma.webinar.findFirst({
      where: {
        OR: [
          { slug: 'videos-profesionales-ia' },
          { title: { contains: 'videos profesionales', mode: 'insensitive' } }
        ]
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
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

    if (todayWebinar) {
      console.log(`\n🎯 WEBINAR DE HOY ENCONTRADO:`);
      console.log(`📊 Total registros: ${todayWebinar.registrations.length}`);
      console.log(`✅ Confirmados: ${todayWebinar.registrations.filter(r => r.isConfirmed).length}`);
      console.log(`🆔 ID: ${todayWebinar.id}`);
      console.log(`📅 Fecha: ${todayWebinar.dateTime}`);

      if (todayWebinar.registrations.length > 0) {
        console.log(`\n📋 TODOS LOS REGISTROS:`);
        todayWebinar.registrations.forEach((reg, index) => {
          const name = `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || 'Sin nombre';
          console.log(`${index + 1}. ${reg.user.email} (${name})`);
          console.log(`   - Confirmado: ${reg.isConfirmed ? '✅' : '❌'}`);
          console.log(`   - Email verificado: ${reg.user.emailVerified ? '✅' : '❌'}`);
          console.log(`   - Creado: ${reg.createdAt}`);
        });

        // ENVIAR RECORDATORIOS URGENTES
        const confirmedUsers = todayWebinar.registrations.filter(r => r.isConfirmed);
        if (confirmedUsers.length > 0) {
          console.log(`\n🚨 ¡ENCONTRADOS ${confirmedUsers.length} USUARIOS CONFIRMADOS!`);
          console.log(`📧 PREPARANDO ENVÍO DE RECORDATORIOS URGENTES...`);
          
          // Aquí podríamos llamar a la función de envío de emails
          console.log(`✉️ Emails confirmados para enviar recordatorios:`);
          confirmedUsers.forEach((reg, index) => {
            console.log(`${index + 1}. ${reg.user.email}`);
          });
        }
      }
    } else {
      console.log(`❌ No se encontró el webinar de hoy`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkNeonBranchData()
  .then(() => {
    console.log('\n✅ Verificación de rama completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });