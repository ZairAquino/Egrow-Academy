const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkWebinarTables() {
  console.log('🔍 Verificando tablas de webinars en la base de datos...');
  
  try {
    // Verificar si existen las tablas básicas
    console.log('\n📊 Verificando tablas básicas:');
    
    try {
      const webinarsCount = await prisma.webinars.count();
      console.log(`✅ Tabla 'webinars': ${webinarsCount} registros`);
    } catch (error) {
      console.log('❌ Tabla "webinars" no existe');
    }
    
    try {
      const registrationsCount = await prisma.webinar_registrations.count();
      console.log(`✅ Tabla 'webinar_registrations': ${registrationsCount} registros`);
    } catch (error) {
      console.log('❌ Tabla "webinar_registrations" no existe');
    }
    
    // Verificar tablas complejas
    console.log('\n📊 Verificando tablas complejas:');
    
    const complexTables = [
      'webinar_chat',
      'webinar_emails', 
      'webinar_poll_votes',
      'webinar_polls',
      'webinar_questions'
    ];
    
    for (const table of complexTables) {
      try {
        const count = await prisma[table].count();
        console.log(`⚠️ Tabla '${table}': ${count} registros (DEBE ELIMINARSE)`);
      } catch (error) {
        console.log(`✅ Tabla '${table}' no existe`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWebinarTables(); 