import { prisma } from '../src/lib/prisma';

async function checkProductionDirect() {
  console.log('🔍 Verificando DIRECTAMENTE en la BD de PRODUCCIÓN\n');
  console.log('Hora actual:', new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }));
  console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
  console.log('='.repeat(60));
  
  try {
    // 1. Buscar TODOS los webinars
    console.log('\n📅 TODOS LOS WEBINARS:');
    const allWebinars = await prisma.webinar.findMany({
      orderBy: { dateTime: 'desc' },
      take: 10,
      include: {
        registrations: true
      }
    });
    
    for (const w of allWebinars) {
      const date = new Date(w.dateTime);
      console.log(`\n${w.title}`);
      console.log(`  - ID: ${w.id}`);
      console.log(`  - Slug: ${w.slug}`);
      console.log(`  - Fecha UTC: ${w.dateTime}`);
      console.log(`  - Fecha México: ${date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`  - Activo: ${w.isActive}`);
      console.log(`  - Registros: ${w.registrations.length}`);
      
      if (w.registrations.length > 0) {
        console.log('  - Emails registrados:');
        w.registrations.forEach(r => {
          console.log(`    • ${r.email} (Confirmado: ${r.isConfirmed})`);
        });
      }
    }
    
    // 2. Buscar registros específicos del usuario
    console.log('\n' + '='.repeat(60));
    console.log('\n👤 BUSCANDO USUARIO luisdavid.ls47@gmail.com:');
    const userRegs = await prisma.webinarRegistration.findMany({
      where: { 
        email: { 
          contains: 'luisdavid',
          mode: 'insensitive'
        }
      },
      include: {
        webinar: true
      }
    });
    
    if (userRegs.length > 0) {
      console.log(`✅ Encontrados ${userRegs.length} registros:`);
      userRegs.forEach(r => {
        console.log(`  - Webinar: ${r.webinar.title}`);
        console.log(`    Email: ${r.email}`);
        console.log(`    Confirmado: ${r.isConfirmed}`);
      });
    } else {
      console.log('❌ No se encontraron registros con ese email');
    }
    
    // 3. Buscar webinars que contengan "monetiza"
    console.log('\n' + '='.repeat(60));
    console.log('\n💰 WEBINARS CON "MONETIZA":');
    const monetizaWebinars = await prisma.webinar.findMany({
      where: {
        OR: [
          { title: { contains: 'monetiza', mode: 'insensitive' } },
          { slug: { contains: 'monetiza', mode: 'insensitive' } }
        ]
      },
      include: {
        registrations: true
      }
    });
    
    monetizaWebinars.forEach(w => {
      const date = new Date(w.dateTime);
      console.log(`\n${w.title}`);
      console.log(`  - Fecha México: ${date.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}`);
      console.log(`  - Registros: ${w.registrations.length}`);
      if (w.registrations.length > 0) {
        w.registrations.forEach(r => {
          console.log(`    • ${r.email}`);
        });
      }
    });
    
    // 4. Verificar el total de registros
    console.log('\n' + '='.repeat(60));
    const totalWebinars = await prisma.webinar.count();
    const totalRegistrations = await prisma.webinarRegistration.count();
    console.log('\n📊 ESTADÍSTICAS TOTALES:');
    console.log(`- Total webinars: ${totalWebinars}`);
    console.log(`- Total registros: ${totalRegistrations}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductionDirect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());