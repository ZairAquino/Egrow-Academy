import { PrismaClient } from '@prisma/client';

async function checkDevDatabase() {
  console.log('🔍 Verificando registros en la base de datos de desarrollo...\n');

  const prisma = new PrismaClient();

  try {
    // Verificar tablas principales
    const tables = [
      'user', 'course', 'lesson', 'webinar', 'webinarRegistration', 
      'resource', 'promotion', 'enrollment', 'courseProgress'
    ];

    for (const table of tables) {
      try {
        // @ts-ignore - Acceso dinámico a las tablas
        const count = await prisma[table].count();
        console.log(`📊 ${table}: ${count} registros`);
        
        if (count > 0) {
          // Mostrar algunos ejemplos
          // @ts-ignore
          const samples = await prisma[table].findMany({ take: 3 });
          samples.forEach((sample: any, index: number) => {
            if (sample.title) {
              console.log(`  ${index + 1}. ${sample.title}`);
            } else if (sample.name) {
              console.log(`  ${index + 1}. ${sample.name}`);
            } else if (sample.email) {
              console.log(`  ${index + 1}. ${sample.email}`);
            } else {
              console.log(`  ${index + 1}. ID: ${sample.id}`);
            }
          });
        }
        console.log('');
      } catch (error) {
        console.log(`❌ Error en ${table}:`, error);
      }
    }

    // Verificar específicamente los webinars
    console.log('🎯 Verificando webinars específicamente:');
    const webinars = await prisma.webinar.findMany();
    console.log(`Webinars encontrados: ${webinars.length}`);
    webinars.forEach((webinar, index) => {
      console.log(`${index + 1}. ${webinar.title} - ${webinar.dateTime}`);
    });

    console.log('\n🎯 Verificando registros de webinars:');
    const registrations = await prisma.webinarRegistration.findMany();
    console.log(`Registros de webinars: ${registrations.length}`);
    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.email} - ${reg.firstName} ${reg.lastName}`);
    });

  } catch (error) {
    console.error('❌ Error verificando la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDevDatabase().catch(console.error); 