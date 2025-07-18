import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCourse() {
  try {
    console.log('🎓 Creando curso de Introducción a LLMs...');

    // Crear el curso
    const course = await prisma.course.create({
      data: {
        id: 'introduccion-llms',
        title: 'Introducción a Large Language Models (LLMs)',
        slug: 'introduccion-llms',
        description: 'Aprende los fundamentos de los modelos de lenguaje grandes, desde GPT hasta Claude, y cómo implementarlos en aplicaciones reales.',
        shortDescription: 'Fundamentos de LLMs y aplicaciones prácticas',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center',
        price: 0,
        isFree: true,
        requiresAuth: true,
        difficulty: 'BEGINNER',
        durationHours: 2,
        lessonsCount: 10,
        studentsCount: 0,
        rating: 0,
        status: 'PUBLISHED'
      }
    });

    console.log('✅ Curso creado exitosamente:', course.title);

    // Crear las lecciones
    const lessons = [
      {
        title: 'Bienvenida e Introducción',
        content: 'Presentación del curso y conceptos fundamentales',
        videoUrl: null,
        duration: 8,
        order: 1,
        courseId: course.id
      },
      {
        title: '¿Qué son los LLMs?',
        content: 'Definición y características principales de los modelos de lenguaje grandes',
        videoUrl: null,
        duration: 15,
        order: 2,
        courseId: course.id
      },
      {
        title: 'Historia y Evolución',
        content: 'Evolución desde N-gramas hasta los modelos actuales',
        videoUrl: null,
        duration: 12,
        order: 3,
        courseId: course.id
      },
      {
        title: 'Arquitectura Transformer',
        content: 'Fundamentos de la arquitectura que revolucionó el PLN',
        videoUrl: null,
        duration: 20,
        order: 4,
        courseId: course.id
      },
      {
        title: 'Lab: Explorando GPT-3.5',
        content: 'Ejercicio práctico usando la API de OpenAI',
        videoUrl: null,
        duration: 25,
        order: 5,
        courseId: course.id
      },
      {
        title: 'Prompt Engineering',
        content: 'Técnicas para crear prompts efectivos',
        videoUrl: null,
        duration: 18,
        order: 6,
        courseId: course.id
      },
      {
        title: 'Lab: Prompt Engineering Avanzado',
        content: 'Ejercicios prácticos de optimización de prompts',
        videoUrl: null,
        duration: 30,
        order: 7,
        courseId: course.id
      },
      {
        title: 'Casos de Uso Reales',
        content: 'Aplicaciones en chatbots, análisis de texto y más',
        videoUrl: null,
        duration: 15,
        order: 8,
        courseId: course.id
      },
      {
        title: 'Limitaciones y Sesgos',
        content: 'Desafíos actuales y consideraciones éticas',
        videoUrl: null,
        duration: 12,
        order: 9,
        courseId: course.id
      },
      {
        title: 'Proyecto Final',
        content: 'Construye tu propio asistente de IA',
        videoUrl: null,
        duration: 35,
        order: 10,
        courseId: course.id
      }
    ];

    for (const lessonData of lessons) {
      const lesson = await prisma.lesson.create({
        data: lessonData
      });
      console.log(`✅ Lección creada: ${lesson.title}`);
    }

    console.log('🎉 Curso y lecciones creados exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Curso: ${course.title}`);
    console.log(`   - Lecciones: ${lessons.length}`);
    console.log(`   - Duración total: ${lessons.reduce((total, l) => total + l.duration, 0)} minutos`);

  } catch (error) {
    console.error('❌ Error creando el curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCourse(); 