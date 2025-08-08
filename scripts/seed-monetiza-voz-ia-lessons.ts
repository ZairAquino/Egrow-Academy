import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMonetizaVozIALessons() {
  console.log('🎙️ Iniciando seed de lecciones para Monetiza tu Voz con IA...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Primero, crear o verificar que existe el curso
    const courseData = {
      id: 'monetiza-voz-ia-elevenlabs',
      title: 'Monetiza tu Voz con IA: ElevenLabs para anuncios, cursos y podcasts (sin curva técnica)',
      slug: 'monetiza-voz-ia-elevenlabs',
      description: 'Aprende a monetizar tu voz utilizando inteligencia artificial con ElevenLabs. Crea anuncios profesionales, cursos narrados y podcasts de alta calidad sin conocimientos técnicos. Desde la configuración básica hasta estrategias avanzadas de monetización.',
      shortDescription: 'Monetiza tu voz con ElevenLabs sin conocimientos técnicos',
      imageUrl: '/images/courses/monetiza-voz-ia.png',
      price: 97.00,
      isFree: false,
      requiresAuth: true,
      difficulty: 'BEGINNER',
      durationHours: 8,
      lessonsCount: 11,
      studentsCount: 0,
      rating: 0,
      status: 'PUBLISHED',
      category: 'IA_PARA_EMPRENDER'
    };

    // Verificar si el curso ya existe
    let course = await prisma.course.findUnique({
      where: { slug: courseData.slug }
    });

    if (!course) {
      // Crear el curso si no existe
      course = await prisma.course.create({
        data: courseData as any
      });
      console.log(`✅ Curso creado: "${course.title}" (ID: ${course.id})`);
    } else {
      console.log(`📚 Curso encontrado: "${course.title}" (ID: ${course.id})`);
    }

    // Definir las lecciones del MÓDULO 1
    const module1Lessons = [
      {
        title: '1.1 Origen de ElevenLabs (story breve)',
        content: `## Origen de ElevenLabs

### Fundadores y motivación
Fundada en 2022 por Mati Staniszewski y Piotr Dobkowski; la inspiración vino de crecer con doblajes monótonos y querer voces sintéticas realistas. 

### Significado del nombre
"Eleven" alude al:
- 11 (divisibilidad matemática)
- Apollo 11 (exploración espacial)  
- "Turn it up to 11" (referencia cultural)

### Momentum empresarial
- Modelo propio de IA
- Locuciones naturales de alta calidad
- En dos años alcanzó ~$100M ARR

### Por qué importa
- 30+ idiomas soportados
- Velocidad de procesamiento
- Coste bajo por palabra
- Accesibilidad global
- Ronda Serie B de ~$80M

### Entregable
Crear un mini-pitch (3 frases) de cómo usarás ElevenLabs en tu proyecto personal o empresarial.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-1-1',
        duration: 25,
        order: 1
      },
      {
        title: '1.2 Alcances y límites (ética y uso responsable)',
        content: `## Alcances y límites de ElevenLabs

### Alcances principales
- **Clonación de voz** para identidad de marca
- **Doblaje exprés multilingüe** para contenido global
- **Asistentes con emoción** para mejor UX
- **Storytelling inmersivo** para audiencias cautivadas

### Límites importantes
- **Deepfakes/fraude**: Riesgo de uso malintencionado
- **Derechos de autor/contratos**: Consideraciones legales
- **Costo de tiempo real**: Limitaciones económicas
- **Emociones extremas**: Aún imperfectas tecnológicamente

### Principio ético clave
> "Amplifica tu mensaje, no reemplaces tu humanidad."

### Entregable
Crear una política breve de uso ético para tu marca usando la plantilla incluida en el curso.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-1-2',
        duration: 30,
        order: 2
      },
      {
        title: '1.3 Panorama TTS (comparativa rápida)',
        content: `## Panorama de Text-to-Speech (TTS)

### Quién es quién
- **Amazon Polly**: Enfocado en precio competitivo
- **Google TTS Neural**: Versatilidad y ecosistema
- **ElevenLabs**: Realismo y control emocional

### Niveles de calidad
- **Nivel A**: Correcto pero robótico
- **Nivel B**: Entonación natural
- **Nivel C**: Timbre y respiración realistas

### Facilidad de uso
- **AWS Polly**: Requiere IAM y configuración técnica
- **Google TTS**: UI sencilla e intuitiva
- **ElevenLabs**: Dashboard no-code + SDK avanzado

### Costos aproximados (por 1M caracteres)
- **Amazon**: ~$16 neural (~$4 estándar)
- **Google**: ~$12–17 según configuración
- **ElevenLabs**: Premium por realismo, con modo turbo

### Casos de uso recomendados
- **IVR masivo**: Amazon Polly
- **Micro-learning**: Google TTS
- **Audiolibros/podcasts premium**: ElevenLabs

### Entregable
Identificar qué herramienta usar según tu caso específico de negocio.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-1-3',
        duration: 25,
        order: 3
      }
    ];

    // Crear las lecciones
    for (const lessonData of module1Lessons) {
      // Verificar si la lección ya existe
      const existingLesson = await prisma.lesson.findFirst({
        where: {
          courseId: course.id,
          title: lessonData.title
        }
      });

      if (existingLesson) {
        console.log(`⏭️ Lección "${lessonData.title}" ya existe, saltando...`);
        continue;
      }

      // Crear la lección
      const lesson = await prisma.lesson.create({
        data: {
          title: lessonData.title,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          duration: lessonData.duration,
          order: lessonData.order,
          courseId: course.id
        }
      });

      console.log(`✅ Lección creada: "${lesson.title}" (Order: ${lesson.order})`);
    }

    // Actualizar el contador de lecciones del curso si es necesario
    const actualLessonsCount = await prisma.lesson.count({
      where: { courseId: course.id }
    });

    if (course.lessonsCount !== actualLessonsCount) {
      await prisma.course.update({
        where: { id: course.id },
        data: { lessonsCount: actualLessonsCount }
      });
      console.log(`📊 Contador de lecciones actualizado: ${actualLessonsCount}`);
    }

    console.log('\n🎉 Seed de lecciones del MÓDULO 1 completado exitosamente!');
    
    // Mostrar resumen
    const totalLessons = await prisma.lesson.count({
      where: { courseId: course.id }
    });
    
    console.log(`\n📊 Resumen para "${course.title}":`);
    console.log(`- Lecciones totales: ${totalLessons}`);
    console.log(`- MÓDULO 1 completado: 3/3 lecciones`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedMonetizaVozIALessons()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedMonetizaVozIALessons };