import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createEventsTable() {
  try {
    console.log('🔍 Creando tabla events...');
    
    // Crear la tabla events con la estructura correcta
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TIMESTAMP,
        time TEXT,
        type TEXT,
        category TEXT,
        instructor TEXT,
        image TEXT,
        max_attendees INTEGER,
        is_active BOOLEAN DEFAULT true,
        attendees INTEGER DEFAULT 0,
        status TEXT DEFAULT 'UPCOMING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Tabla events creada exitosamente');
    
    // Insertar algunos eventos de prueba
    await prisma.$executeRaw`
      INSERT INTO events (id, title, description, date, time, type, category, instructor, attendees, status) VALUES
      ('evt_001', 'Lanzamiento: Monetiza con IA', 'Descubre cómo crear múltiples fuentes de ingresos usando inteligencia artificial', '2025-07-25 12:00:00', '12:00 - 13:30', 'LANZAMIENTO', 'Lanzamiento de Curso', 'eGrow Academy', 45, 'UPCOMING'),
      ('evt_002', 'Workshop: ChatGPT Avanzado', 'Aprende técnicas avanzadas para maximizar el potencial de ChatGPT', '2025-08-12 15:00:00', '15:00 - 17:00', 'WORKSHOP', 'Workshop Práctico', 'eGrow Academy', 32, 'UPCOMING'),
      ('evt_003', 'Webinar: IA en Marketing', 'Descubre cómo implementar IA en tu estrategia de marketing digital', '2025-08-20 20:00:00', '20:00 - 21:30', 'WEBINAR', 'Webinar Gratuito', 'eGrow Academy', 78, 'UPCOMING'),
      ('evt_004', 'Masterclass: Prompt Engineering', 'Domina el arte del prompt engineering para obtener mejores resultados', '2025-08-28 18:00:00', '18:00 - 19:30', 'MASTERCLASS', 'Masterclass Premium', 'eGrow Academy', 28, 'UPCOMING'),
      ('evt_005', 'Meetup: IA y Automatización', 'Conecta con otros profesionales y comparte experiencias', '2025-09-05 19:00:00', '19:00 - 21:00', 'MEETUP', 'Networking', 'eGrow Academy', 15, 'UPCOMING')
    `;
    
    console.log('✅ Eventos de prueba insertados');
    
    // Verificar que la tabla existe y tiene datos
    const events = await prisma.$queryRaw`SELECT * FROM events`;
    console.log('📅 Eventos en la base de datos:', events);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createEventsTable(); 