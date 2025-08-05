import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockupLessons = [
  // MÓDULO 1 - Introducción a los Mockups con IA (4 lecciones)
  {
    title: '1.1 ¿Qué es un mockup?',
    content: 'Un mockup es una representación visual estática y detallada de un diseño o producto antes de su implementación real. Sirve como una maqueta o presentación visual que simula cómo se verá algo en el mundo real (una app, un sitio web, un envase, etc.). Incluye conceptos fundamentales, importancia y casos de uso en negocios y marketing.',
    order: 1,
    duration: 10,
    videoUrl: 'https://www.youtube.com/watch?v=example1-1'
  },
  {
    title: '1.2 Tipologías',
    content: 'Explora los diferentes tipos de mockups: mockups web (landing pages, blogs, tiendas online), mockups móviles (apps, redes sociales, navegación móvil), y mockups de producto y branding (tazas, bolsas, camisetas, empaques).',
    order: 2,
    duration: 12,
    videoUrl: 'https://www.youtube.com/watch?v=example1-2'
  },
  {
    title: '1.3 Diferencias entre wireframes, prototipos y mockups',
    content: 'Comprende las diferencias clave entre wireframes (bajo detalle, estructura general), mockups (alto detalle, apariencia visual real), y prototipos (muy alto detalle, simulación con interacciones). Incluye tabla comparativa completa.',
    order: 3,
    duration: 15,
    videoUrl: 'https://www.youtube.com/watch?v=example1-3'
  },
  {
    title: '1.4 Actividad Práctica 1: Análisis Rápido de Mockups Exitosos',
    content: 'Aprende a identificar qué hace visualmente atractivo y funcional a un mockup mediante análisis práctico. Analiza mockups existentes respondiendo 3 preguntas clave para desarrollar tu ojo crítico para el diseño.',
    order: 4,
    duration: 8,
    videoUrl: 'https://www.youtube.com/watch?v=example1-4'
  },

  // MÓDULO 2 - Principales herramientas de IA (1 lección)
  {
    title: '2.1 Familiarizarte con las principales herramientas de IA',
    content: 'Explora y configura las principales herramientas: Figma AI (diseños avanzados), Uizard.io (ideas a interfaces), Canva (herramienta principal), y Mockup World (plantillas gratuitas). Incluye guía completa de Canva, prompts para ChatGPT y actividades prácticas.',
    order: 5,
    duration: 25,
    videoUrl: 'https://www.youtube.com/watch?v=example2-1'
  },

  // MÓDULO 3 - Landing page completa (1 lección)
  {
    title: '3.1 Crear una landing page completa',
    content: 'Crea una landing page completa y funcional con estructura profesional: header con logo y menú, hero con imagen y CTA, sección de beneficios, testimonios o cifras, y CTA final. Incluye actividades en Canva y prompts específicos.',
    order: 6,
    duration: 30,
    videoUrl: 'https://www.youtube.com/watch?v=example3-1'
  },

  // MÓDULO 4 - Mockups para apps móviles (1 lección)
  {
    title: '4.1 Aprender a diseñar mockups',
    content: 'Diseña mockups para apps móviles modernas siguiendo principios mobile-first: diseño vertical, pantallas simples, navegación táctil clara, y énfasis en contraste y legibilidad. Incluye diseño de 3 pantallas clave y recursos UI de Canva.',
    order: 7,
    duration: 35,
    videoUrl: 'https://www.youtube.com/watch?v=example4-1'
  },

  // MÓDULO 5 - Identidad visual de marca (1 lección)
  {
    title: '5.1 Crear una identidad visual de marca',
    content: 'Proyecto final: crea identidad visual completa (nombre, tono, colores, tipografía, slogan), presenta producto en redes sociales y genera mockups con Sora. Incluye branding con IA, diseño en Canva, mockups directos desde Sora y presentación final.',
    order: 8,
    duration: 40,
    videoUrl: 'https://www.youtube.com/watch?v=example5-1'
  }
];

async function seedMockupLessons() {
  console.log('🌱 Iniciando seed de lecciones para curso mockup-cero...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso mockup-cero
    const course = await prisma.course.findUnique({
      where: { slug: 'mockup-cero' }
    });

    if (!course) {
      console.error('❌ Curso mockup-cero no encontrado en la base de datos');
      return;
    }

    console.log(`✅ Curso encontrado: ${course.title} (ID: ${course.id})`);

    // Eliminar lecciones existentes del curso
    await prisma.lesson.deleteMany({
      where: { courseId: course.id }
    });
    console.log('🗑️ Lecciones existentes eliminadas');

    // Crear las nuevas lecciones
    const createdLessons = [];
    for (const lessonData of mockupLessons) {
      const lesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          order: lessonData.order,
          duration: lessonData.duration,
          videoUrl: lessonData.videoUrl,
          courseId: course.id
        }
      });

      createdLessons.push(lesson);
      console.log(`✅ Lección creada: "${lesson.title}" (ID: ${lesson.id})`);
    }

    // Actualizar el conteo de lecciones en el curso
    await prisma.course.update({
      where: { id: course.id },
      data: { lessonsCount: mockupLessons.length }
    });

    console.log(`📊 Curso actualizado con ${mockupLessons.length} lecciones`);
    console.log('🎉 Seed de lecciones completado exitosamente!');

    // Mostrar resumen
    const totalLessons = await prisma.lesson.count({
      where: { courseId: course.id }
    });
    
    console.log(`\n📋 Resumen:`);
    console.log(`- Curso: ${course.title}`);
    console.log(`- Lecciones creadas: ${totalLessons}`);
    console.log(`- Módulos: 5`);
    console.log(`- Duración total: ${mockupLessons.reduce((acc, lesson) => acc + lesson.duration, 0)} minutos`);

    // Mostrar estructura por módulos
    console.log(`\n📚 Estructura por módulos:`);
    console.log(`- Módulo 1: 4 lecciones (1.1 - 1.4)`);
    console.log(`- Módulo 2: 1 lección (2.1)`);
    console.log(`- Módulo 3: 1 lección (3.1)`); 
    console.log(`- Módulo 4: 1 lección (4.1)`);
    console.log(`- Módulo 5: 1 lección (5.1)`);

    // Mostrar IDs generados para actualizar la página
    console.log(`\n🔑 IDs de lecciones generados (para actualizar en la página):`);
    createdLessons.forEach((lesson, index) => {
      const moduleNum = index < 4 ? 1 : index === 4 ? 2 : index === 5 ? 3 : index === 6 ? 4 : 5;
      const lessonNum = index < 4 ? index + 1 : 1;
      console.log(`mockup_m${moduleNum}_l${lessonNum}: '${lesson.id}' // ${lesson.title}`);
    });

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedMockupLessons()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedMockupLessons };