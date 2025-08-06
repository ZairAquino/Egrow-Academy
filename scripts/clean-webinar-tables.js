const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanWebinarTables() {
  console.log('🧹 Limpiando tablas complejas de Webinar Jam...');
  
  try {
    // Eliminar datos de tablas complejas
    console.log('🗑️ Eliminando datos de webinar_chat...');
    await prisma.webinar_chat.deleteMany({});
    
    console.log('🗑️ Eliminando datos de webinar_emails...');
    await prisma.webinar_emails.deleteMany({});
    
    console.log('🗑️ Eliminando datos de webinar_poll_votes...');
    await prisma.webinar_poll_votes.deleteMany({});
    
    console.log('🗑️ Eliminando datos de webinar_polls...');
    await prisma.webinar_polls.deleteMany({});
    
    console.log('🗑️ Eliminando datos de webinar_questions...');
    await prisma.webinar_questions.deleteMany({});
    
    console.log('✅ Datos de tablas complejas eliminados');
    console.log('📊 Solo quedan webinars y webinar_registrations');
    
  } catch (error) {
    console.error('❌ Error limpiando tablas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanWebinarTables(); 