import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Listar todas las tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tablas disponibles en la base de datos:');
    console.log(tables);
    
    // Verificar si existe la tabla events
    const eventsTable = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'events'
    `;
    
    if (eventsTable && Array.isArray(eventsTable) && eventsTable.length > 0) {
      console.log('✅ La tabla "events" existe');
      
      // Verificar estructura de la tabla events
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'events'
        ORDER BY ordinal_position
      `;
      
      console.log('📊 Estructura de la tabla events:');
      console.log(columns);
      
      // Intentar obtener datos
      const events = await prisma.$queryRaw`SELECT * FROM events LIMIT 3`;
      console.log('📅 Datos de eventos:');
      console.log(events);
      
    } else {
      console.log('❌ La tabla "events" NO existe');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 