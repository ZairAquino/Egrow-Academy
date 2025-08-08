import { prisma } from '../src/lib/prisma';

async function checkRawWebinarData() {
  try {
    console.log('🔍 VERIFICACIÓN DIRECTA DE DATOS RAW');
    console.log('⏰ Hora actual:', new Date().toISOString());

    // Verificar todas las tablas relacionadas
    console.log('\n📊 CONTANDO REGISTROS EN TABLAS...');
    
    // Contar webinars
    const webinarCount = await prisma.webinar.count();
    console.log(`📋 Total Webinars: ${webinarCount}`);
    
    // Contar registros de webinar
    const registrationCount = await prisma.webinarRegistration.count();
    console.log(`📝 Total WebinarRegistrations: ${registrationCount}`);
    
    // Mostrar todos los webinars sin filtros
    console.log('\n📊 TODOS LOS WEBINARS (SIN FILTROS):');
    const allWebinars = await prisma.webinar.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        dateTime: true,
        isActive: true,
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        dateTime: 'desc'
      }
    });
    
    allWebinars.forEach((webinar, index) => {
      console.log(`${index + 1}. ${webinar.title}`);
      console.log(`   - ID: ${webinar.id}`);
      console.log(`   - Slug: ${webinar.slug}`);
      console.log(`   - Fecha: ${webinar.dateTime}`);
      console.log(`   - Activo: ${webinar.isActive}`);
      console.log(`   - Registros: ${webinar._count.registrations}`);
    });

    // Buscar registraciones por el slug específico
    console.log('\n🔍 BÚSQUEDA DIRECTA DE REGISTRACIONES...');
    const webinarWithMostRegistrations = await prisma.webinar.findFirst({
      include: {
        registrations: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        registrations: {
          _count: 'desc'
        }
      }
    });

    if (webinarWithMostRegistrations) {
      console.log(`\n📊 WEBINAR CON MÁS REGISTROS:`);
      console.log(`🎯 Título: ${webinarWithMostRegistrations.title}`);
      console.log(`🆔 ID: ${webinarWithMostRegistrations.id}`);
      console.log(`📝 Slug: ${webinarWithMostRegistrations.slug}`);
      console.log(`📅 Fecha: ${webinarWithMostRegistrations.dateTime}`);
      console.log(`📊 Total registros: ${webinarWithMostRegistrations.registrations.length}`);
      
      if (webinarWithMostRegistrations.registrations.length > 0) {
        console.log(`\n📧 PRIMEROS 5 REGISTROS:`);
        webinarWithMostRegistrations.registrations.slice(0, 5).forEach((reg, index) => {
          const name = `${reg.user.firstName || ''} ${reg.user.lastName || ''}`.trim() || 'Sin nombre';
          console.log(`${index + 1}. ${reg.user.email} (${name}) - Confirmado: ${reg.isConfirmed}`);
        });
      }
    }

    // Verificar registros por webinar específico usando diferentes métodos
    console.log('\n🔍 VERIFICANDO WEBINAR ESPECÍFICO CON DIFERENTES MÉTODOS...');
    
    // Método 1: Por slug exacto
    const webinarBySlug = await prisma.webinar.findUnique({
      where: {
        slug: 'videos-profesionales-ia'
      },
      include: {
        registrations: true
      }
    });
    
    if (webinarBySlug) {
      console.log(`✅ Encontrado por slug: ${webinarBySlug.registrations.length} registros`);
    } else {
      console.log(`❌ No encontrado por slug`);
    }

    // Método 2: Buscar por título parcial
    const webinarByTitle = await prisma.webinar.findFirst({
      where: {
        title: {
          contains: 'videos profesionales',
          mode: 'insensitive'
        }
      },
      include: {
        registrations: true
      }
    });

    if (webinarByTitle) {
      console.log(`✅ Encontrado por título: ${webinarByTitle.registrations.length} registros`);
      console.log(`   - ID: ${webinarByTitle.id}`);
      console.log(`   - Slug: ${webinarByTitle.slug}`);
    }

    // Método 3: Buscar registros directamente en WebinarRegistration
    console.log('\n🔍 BÚSQUEDA DIRECTA EN WebinarRegistration...');
    const allRegistrations = await prisma.webinarRegistration.findMany({
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
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    console.log(`📊 Últimas 10 registraciones encontradas:`);
    allRegistrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.user.email} -> ${reg.webinar.title} (${reg.webinar.slug})`);
      console.log(`   - Fecha webinar: ${reg.webinar.dateTime}`);
      console.log(`   - Confirmado: ${reg.isConfirmed}`);
      console.log(`   - Creado: ${reg.createdAt}`);
    });

  } catch (error) {
    console.error('❌ Error en verificación raw:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkRawWebinarData()
  .then(() => {
    console.log('\n✅ Verificación raw completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });