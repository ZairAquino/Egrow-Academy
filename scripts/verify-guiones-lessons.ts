import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyGuionesLessons() {
  try {
    console.log('🔍 Verificando lecciones del curso de guiones...');

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' }
    });

    if (!course) {
      console.error('❌ Curso no encontrado');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title} (ID: ${course.id})`);

    // Obtener todas las lecciones del curso
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        duration: true,
        content: true
      }
    });

    console.log(`\n📚 Lecciones encontradas: ${lessons.length}`);

    if (lessons.length === 0) {
      console.log('❌ No hay lecciones en la base de datos');
      return;
    }

    // Mostrar detalles de cada lección
    lessons.forEach((lesson, index) => {
      console.log(`\n${index + 1}. ${lesson.title}`);
      console.log(`   ID: ${lesson.id}`);
      console.log(`   Orden: ${lesson.order}`);
      console.log(`   Duración: ${lesson.duration || 'No especificada'} min`);
      console.log(`   Contenido: ${lesson.content ? `${lesson.content.substring(0, 100)}...` : 'Sin contenido'}`);
    });

    // Verificar si hay inconsistencias
    const expectedLessons = [
      'MÓDULO 1: FUNDAMENTOS DEL GUIÓN DIGITAL',
      'MÓDULO 2: HERRAMIENTAS DE IA PARA GUIONES',
      'MÓDULO 3: GUIONES PARA VIDEOS PROMOCIONALES',
      'MÓDULO 4: GUIONES PARA REDES SOCIALES',
      'MÓDULO 5: OPTIMIZACIÓN Y ANÁLISIS'
    ];

    console.log('\n🔍 Verificando consistencia con la página del curso...');
    
    const foundTitles = lessons.map(l => l.title);
    const missingTitles = expectedLessons.filter(expected => 
      !foundTitles.some(found => found.includes(expected.split(':')[0]))
    );

    if (missingTitles.length > 0) {
      console.log('\n❌ Lecciones faltantes:');
      missingTitles.forEach(title => console.log(`   - ${title}`));
    } else {
      console.log('\n✅ Todas las lecciones esperadas están en la base de datos');
    }

    // Verificar IDs únicos
    const lessonIds = lessons.map(l => l.id);
    const uniqueIds = new Set(lessonIds);
    
    if (lessonIds.length !== uniqueIds.size) {
      console.log('\n❌ Hay IDs duplicados en las lecciones');
    } else {
      console.log('\n✅ Todos los IDs de lecciones son únicos');
    }

    // Verificar orden secuencial
    const orders = lessons.map(l => l.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({length: lessons.length}, (_, i) => i + 1);
    
    const orderMismatch = orders.some((order, index) => order !== expectedOrders[index]);
    
    if (orderMismatch) {
      console.log('\n❌ El orden de las lecciones no es secuencial');
      console.log('   Orden actual:', orders);
      console.log('   Orden esperado:', expectedOrders);
    } else {
      console.log('\n✅ El orden de las lecciones es correcto');
    }

  } catch (error) {
    console.error('❌ Error verificando lecciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyGuionesLessons();
