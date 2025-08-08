import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedModulo2MonetizaVoz() {
  console.log('🎙️ Iniciando seed del MÓDULO 2 para Monetiza tu Voz con IA...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'monetiza-voz-ia-elevenlabs' }
    });

    if (!course) {
      throw new Error('Curso "monetiza-voz-ia-elevenlabs" no encontrado. Ejecuta primero el seed del curso y MÓDULO 1.');
    }

    console.log(`📚 Curso encontrado: "${course.title}" (ID: ${course.id})`);

    // Definir las lecciones del MÓDULO 2
    const module2Lessons = [
      {
        title: '2.1 Introducción al flujo',
        content: `## Introducción al flujo de trabajo con ElevenLabs

### Visión general del proceso
En esta lección obtendrás una vista panorámica de todo el flujo de trabajo que dominarás en este módulo, desde la configuración inicial hasta la producción final.

### Funciones que cubriremos:
1. **Text-to-Speech básico**: Conversión de texto a voz
2. **Configuración de parámetros**: Ajuste de velocidad, tono y emoción
3. **Postproducción**: Efectos y mejoras de calidad
4. **Exportación**: Formatos y configuraciones óptimas
5. **Integración**: Uso en diferentes plataformas y proyectos

### Metodología paso a paso
- **Paso 1**: Preparación del texto y selección de voz
- **Paso 2**: Configuración de parámetros básicos
- **Paso 3**: Generación y revisión inicial
- **Paso 4**: Ajustes y refinamientos
- **Paso 5**: Postproducción y exportación final

### Casos de uso principales:
- Anuncios publicitarios
- Cursos online y e-learning
- Podcasts y contenido de audio
- Videos promocionales
- Asistentes virtuales

### Entregable
Crear tu propio flujo de 5 pasos personalizado para tu proyecto específico usando la plantilla proporcionada.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-1',
        duration: 25,
        order: 4
      },
      {
        title: '2.2 Text-to-Speech (TTS) base',
        content: `## Text-to-Speech: Fundamentos prácticos

### Generación de voz desde texto
Aprende a convertir texto en voz natural y profesional, y cómo integrarla efectivamente en videos promocionales.

### Práctica guiada paso a paso:

#### 1. Preparación del guión
- Redacción para voz (60-90 segundos)
- Puntuación y pausas estratégicas
- Marcas de énfasis y emoción

#### 2. Configuración en ElevenLabs
- Selección de voz apropiada
- Ajuste de velocidad y tono
- Preview y refinamiento

#### 3. Generación y exportación
- **Formatos disponibles**: MP3, WAV, FLAC
- **Configuraciones de calidad**: 44.1kHz, 48kHz
- **Optimización por uso**: web, broadcast, móvil

#### 4. Montaje en editor de video
- Sincronización con imagen
- Ajuste de niveles de audio
- Corrección de timing

### Herramientas recomendadas para montaje:
- **Gratuitas**: DaVinci Resolve, Audacity
- **Profesionales**: Adobe Premiere, Final Cut Pro
- **Online**: Kapwing, InVideo

### Consejos pro:
- Usa formato WAV para máxima calidad
- Exporta siempre un backup en MP3
- Ajusta el volumen a -12dB para broadcast

### Entregable
Video promocional corto (60-90s) con voice-over generado por TTS, completamente terminado y listo para publicar.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-2',
        duration: 35,
        order: 5
      },
      {
        title: '2.3 Mejora, cambio y traducción de voz',
        content: `## Personalización avanzada de la voz

### Cambio de timbre y características
Aprende a modificar las características de la voz para diferentes contextos y audiencias.

#### Ajustes de timbre:
- **Grave/Agudo**: Para diferentes demografías
- **Calidez**: Más personal vs más corporativo
- **Claridad**: Optimización para diferentes medios

### Ajuste emocional
Control fino de las emociones y estados de ánimo en la voz:

#### Emociones disponibles:
- **Neutral**: Presentaciones formales
- **Entusiasta**: Marketing y promociones  
- **Calmada**: Meditación y relajación
- **Urgente**: Llamadas a la acción
- **Amigable**: Atención al cliente

### Traducción multilenguaje

#### Práctica guiada: ES → EN/PR
Tomaremos el mismo spot creado en la lección anterior y lo adaptaremos:

1. **Versión en inglés**:
   - Traducción cultural (no literal)
   - Ajuste de timing para diferencias de idioma
   - Selección de voz en inglés apropiada

2. **Versión en portugués**:
   - Adaptación para mercado brasileño
   - Consideraciones culturales específicas
   - Optimización de pronunciación

### Proceso de localización:
- **Paso 1**: Traducción y adaptación cultural
- **Paso 2**: Ajuste de duración y timing
- **Paso 3**: Selección de voz nativa
- **Paso 4**: Generación y refinamiento
- **Paso 5**: Sincronización con video original

### Consideraciones técnicas:
- Diferentes idiomas tienen diferentes velocidades naturales
- Ajustar pausas entre frases
- Mantener la energía del mensaje original

### Entregable
2 variantes del mismo video en diferentes idiomas (inglés y portugués), optimizadas para sus respectivos mercados.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-3',
        duration: 40,
        order: 6
      },
      {
        title: '2.4 Postproducción (toques pro)',
        content: `## Postproducción profesional para calidad broadcast

### Técnicas de postproducción avanzada
Transforma tu audio generado por IA en contenido con calidad profesional de emisión comercial.

### Pipeline de postproducción:

#### 1. Normalización de audio
- **Niveles óptimos**: -23 LUFS para broadcast, -16 LUFS para streaming
- **Peak limiting**: Evitar distorsión
- **Consistencia**: Volumen uniforme en todo el proyecto

#### 2. EQ (Ecualización)
- **Frecuencias graves**: Limpieza de rumble (80Hz)
- **Medios**: Claridad vocal (1-3kHz)
- **Agudos**: Presencia y brillo (8-12kHz)

#### 3. Compresión dinámica
- **Ratio**: 3:1 a 4:1 para voz
- **Attack/Release**: Naturales pero controlados
- **Makeup gain**: Compensación de nivel

#### 4. Efectos broadcast:
- **De-esser**: Control de sibilantes
- **Gate/Expander**: Eliminar ruido de fondo
- **Limiter**: Protección contra picos

### Herramientas profesionales:
- **Plugins recomendados**: FabFilter, Waves, iZotope
- **DAW profesionales**: Pro Tools, Logic Pro, Cubase
- **Alternativas gratuitas**: Reaper, Audacity con plugins

### Estándares de calidad:

#### Para diferentes medios:
- **Radio comercial**: -12 LUFS, procesado pesado
- **Podcast**: -16 LUFS, procesado moderado
- **Audiolibros**: -18 LUFS, procesado mínimo
- **Streaming**: -14 LUFS, procesado dinámico

### Checklist de calidad broadcast:
- ✅ Sin clipping ni distorsión
- ✅ Niveles consistentes
- ✅ EQ balanceado
- ✅ Compresión apropiada
- ✅ Sin ruido de fondo
- ✅ Transiciones suaves
- ✅ Formato y sample rate correctos

### Entregable final
Audio postproducido con calidad broadcast professional, listo para usar en cualquier medio comercial.`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-2-4',
        duration: 20,
        order: 7
      }
    ];

    // Crear las lecciones del MÓDULO 2
    for (const lessonData of module2Lessons) {
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

    // Actualizar el contador de lecciones del curso
    const actualLessonsCount = await prisma.lesson.count({
      where: { courseId: course.id }
    });

    await prisma.course.update({
      where: { id: course.id },
      data: { lessonsCount: actualLessonsCount }
    });

    console.log(`📊 Contador de lecciones actualizado: ${actualLessonsCount}`);
    console.log('\n🎉 Seed del MÓDULO 2 completado exitosamente!');
    
    // Mostrar resumen
    const module1Count = await prisma.lesson.count({
      where: { 
        courseId: course.id,
        title: { startsWith: '1.' }
      }
    });

    const module2Count = await prisma.lesson.count({
      where: { 
        courseId: course.id,
        title: { startsWith: '2.' }
      }
    });
    
    console.log(`\n📊 Resumen para "${course.title}":`);
    console.log(`- Lecciones totales: ${actualLessonsCount}`);
    console.log(`- MÓDULO 1: ${module1Count}/3 lecciones`);
    console.log(`- MÓDULO 2: ${module2Count}/4 lecciones ✨`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedModulo2MonetizaVoz()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedModulo2MonetizaVoz };