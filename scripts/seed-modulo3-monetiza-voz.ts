import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedModulo3MonetizaVoz() {
  console.log('🎙️ Iniciando seed del MÓDULO 3 para Monetiza tu Voz con IA...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'monetiza-voz-ia-elevenlabs' }
    });

    if (!course) {
      throw new Error('Curso "monetiza-voz-ia-elevenlabs" no encontrado. Ejecuta primero el seed de los módulos anteriores.');
    }

    console.log(`📚 Curso encontrado: "${course.title}" (ID: ${course.id})`);

    // Definir las lecciones del MÓDULO 3
    const module3Lessons = [
      {
        title: '3.1 Casos de la vida real',
        content: `## Casos de la vida real con ElevenLabs

### Aplicaciones prácticas concretas

En esta lección transformaremos los conceptos teóricos en prácticas reales que puedes implementar inmediatamente en tu día a día o negocio.

### 1. Grabación en casa - Mejora de voz personal

#### Problemas comunes:
- **Audio casero con ruido de fondo**
- **Calidad de micrófono limitada**
- **Nerviosismo al grabar**
- **Inconsistencia en la energía**

#### Solución con ElevenLabs:
1. **Clona tu voz** con muestras de tu mejor grabación
2. **Genera el contenido** con calidad consistente
3. **Elimina imperfecciones** automáticamente
4. **Mantén tu personalidad** pero mejorada

### 2. Traducción de audios existentes

#### Casos de uso:
- **Podcasts multiidioma** sin regrabar
- **Cursos en línea** para mercados internacionales
- **Testimonios de clientes** localizados
- **Contenido de marketing** globalizado

#### Proceso paso a paso:
1. Transcribir audio original
2. Traducir manteniendo el tono
3. Generar con voz similar al original
4. Ajustar timing y pausas
5. Sincronizar con video si es necesario

### 3. Creación de audiolibros

#### Ventajas de ElevenLabs:
- **Consistencia** en largas grabaciones
- **Control emocional** según el contenido
- **Velocidad de producción** exponencial
- **Costos reducidos** vs narrador profesional

#### Flujo de trabajo:
- Preparar manuscrito con marcas emocionales
- Dividir por capítulos
- Generar con voz apropiada
- Postproducir cada sección
- Compilar en formato final

### 4. Accesibilidad digital

#### Impacto social:
- **Contenido web** accesible para personas con discapacidad visual
- **Navegación por voz** en aplicaciones
- **Documentos** convertidos a audio
- **Subtítulos hablados** para contenido multimedia

### 5. Contenidos cortos para redes sociales

#### Formatos optimizados:
- **TikTok/Reels**: 15-60 segundos, alta energía
- **YouTube Shorts**: Storytelling rápido
- **Instagram Stories**: Mensajes directos
- **Twitter Spaces**: Intervenciones precisas

### Práctica guiada: Tu proyecto específico

#### Selecciona tu caso:
1. **Emprendedor**: Mejorar presentaciones de pitch
2. **Creador de contenido**: Automatizar narración
3. **Empresa**: Crear IVR personalizado
4. **Educador**: Generar material accesible
5. **Podcaster**: Expandir a otros idiomas

### Técnicas de postproducción para cada caso:

#### EQ/Compresión ligera:
- **High-pass filter** a 80Hz para limpieza
- **Compresión suave** 2:1 ratio
- **EQ boost** ligero en 2-5kHz para claridad

#### Gestión de pausas:
- **Pausas cortas**: 0.5 segundos entre frases
- **Pausas largas**: 1.5 segundos entre ideas
- **Respiraciones**: Añadir naturalidad

#### Ambience sutil:
- **Room tone** muy bajo (-40dB)
- **Reverb** mínimo para calidez
- **Noise floor** consistente

### Entregable del módulo
Crear un caso aplicado específicamente a tu nicho:
- **Opción A**: 1 video promocional completo (60-90s)
- **Opción B**: 1 audio/podcast optimizado (3-5min)

### Plantillas incluidas:
- ✅ **Preset de audio** para diferentes casos de uso
- ✅ **Plantilla replicable** de postproducción
- ✅ **Checklist de calidad** por tipo de proyecto
- ✅ **Guía de timing** para diferentes formatos`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-3-1',
        duration: 40,
        order: 8
      },
      {
        title: '3.2 ElevenLabs como negocio',
        content: `## Monetizando ElevenLabs: Tu negocio de voz IA

### Estructura de ofertas comerciales

Convierte tu conocimiento de ElevenLabs en un negocio rentable con ofertas específicas y precios competitivos.

### 1. Servicios principales que puedes ofrecer

#### A) Doblaje exprés
**Propuesta de valor**: "Doblaje profesional en 24-48h vs 2-4 semanas tradicional"

**Casos de uso:**
- Videos corporativos urgentes
- Campañas de marketing con deadline apretado
- Localización rápida para lanzamientos
- Corrección de errores en producciones

**Precio sugerido**: $25-50 por minuto de audio final

#### B) "Podcast en 3 idiomas"
**Propuesta de valor**: "Expande tu audiencia 300% manteniendo tu voz y personalidad"

**Proceso:**
1. Grabar episodio original en español
2. Transcribir y traducir culturalmente
3. Generar en inglés y portugués con tu voz clonada
4. Postproducir manteniendo el estilo original

**Precio sugerido**: $200-400 por episodio de 20-30min

#### C) IVR con marca
**Propuesta de valor**: "Sistema telefónico que suena como tu equipo, 24/7"

**Incluye:**
- Clonación de voz del CEO/representante
- Grabación de menús y mensajes
- Variantes emocionales según el contexto
- Updates ilimitados por 6 meses

**Precio sugerido**: $800-1,500 setup + $100/mes mantenimiento

#### D) Packs para cursos online
**Propuesta de valor**: "Curso completo narrado en tiempo récord"

**Paquetes:**
- **Básico**: Hasta 2h de contenido, 1 voz
- **Estándar**: Hasta 5h, 2 voces, intro/outro
- **Premium**: Hasta 10h, múltiples voces, música

**Precio sugerido**: $500 / $1,200 / $2,500

### 2. Costeo y estructura financiera

#### Costos base (mensual):
- **ElevenLabs Pro**: ~$22/mes (100k caracteres)
- **ElevenLabs Creator**: ~$99/mes (500k caracteres) 
- **Herramientas de edición**: $20-50/mes
- **Tiempo de trabajo**: Tu tarifa horaria

#### Cálculo por minuto generado:
- **1 minuto de audio** ≈ 150-200 palabras ≈ 900-1,200 caracteres
- **Costo ElevenLabs**: $0.02-0.05 por minuto
- **Tu margen objetivo**: 300-500% sobre costos

### 3. Tiempos de entrega realistas

#### Proyectos estándar:
- **Hasta 5 minutos**: 24-48 horas
- **5-15 minutos**: 2-3 días laborales
- **15-30 minutos**: 1 semana
- **Más de 30 minutos**: 2+ semanas

#### Factores que afectan tiempo:
- Complejidad del guión
- Número de revisiones incluidas
- Postproducción requerida
- Traducción/localización

### 4. Aspectos legales y consentimiento

#### Cláusulas esenciales para contratos:

**Uso de voz clonada:**
- Consentimiento explícito por escrito
- Limitaciones de uso específicas
- Derechos de distribución clarificados
- Cláusula de no uso malicioso

**Plantilla de consentimiento:**
\`\`\`
"Autorizo el uso de mi voz para generar contenido sintético exclusivamente para:
- [Propósito específico]
- [Duración del permiso]  
- [Territorios/idiomas autorizados]  
- [Limitaciones expresas]"
\`\`\`

### 5. Estrategia de precios inicial

#### Estructura de 3 niveles:

**Nivel 1 - Básico ($):**
- Voz estándar
- 1 revisión incluida
- Entrega en 5 días

**Nivel 2 - Profesional ($$):**
- Voz clonada personalizada
- 3 revisiones incluidas
- Entrega en 3 días
- Postproducción básica

**Nivel 3 - Premium ($$$):**
- Múltiples voces
- Revisiones ilimitadas
- Entrega express (24-48h)
- Postproducción avanzada
- Soporte prioritario

### 6. Página de oferta - Elementos clave

#### Headline poderoso:
"Transforma tu contenido con IA de voz en 24-48 horas"

#### Propuesta de valor clara:
- Antes: 2-4 semanas, $500-2000
- Después: 24-48 horas, $200-800

#### Casos de éxito:
- Testimonios con resultados específicos
- Antes/después audibles
- Métricas de satisfacción

#### Call to action directo:
"Reserva tu consulta gratuita de 15 minutos"

### Entregables de esta lección:
1. **Página de oferta completa** con tu propuesta de valor
2. **Tabla de precios detallada** con 3 niveles de servicio
3. **Contratos y cláusulas** de uso responsable
4. **Calculadora de costos** para tus proyectos`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-3-2',
        duration: 35,
        order: 9
      },
      {
        title: '3.3 Conclusión y siguientes pasos',
        content: `## Conclusión: Tu camino hacia la monetización con IA de voz

### Recapitulación de conceptos clave

¡Felicidades! Has completado un viaje transformador que te lleva desde los fundamentos de ElevenLabs hasta la creación de un negocio rentable con IA de voz.

### Lo que has dominado:

#### MÓDULO 1 - Fundamentos sólidos:
- ✅ **Origen y contexto** de ElevenLabs en el mercado
- ✅ **Ética y uso responsable** de la tecnología
- ✅ **Panorama competitivo** vs Amazon Polly y Google TTS

#### MÓDULO 2 - Habilidades técnicas:
- ✅ **Flujo de trabajo** completo y optimizado
- ✅ **Text-to-Speech profesional** con postproducción
- ✅ **Traducción multiidioma** manteniendo la esencia
- ✅ **Calidad broadcast-ready** para medios comerciales

#### MÓDULO 3 - Aplicación práctica:
- ✅ **Casos de uso reales** en diferentes industrias
- ✅ **Estructura de negocio** con precios competitivos
- ✅ **Aspectos legales** y consentimiento responsable

### Tu checklist final de implementación

#### Checklist técnico:
- [ ] Cuenta ElevenLabs configurada (Pro o Creator)
- [ ] Herramientas de postproducción instaladas
- [ ] Templates y presets guardados
- [ ] Flujo de trabajo documentado
- [ ] Calidad de audio validada

#### Checklist de negocio:
- [ ] Servicios principales definidos
- [ ] Estructura de precios establecida
- [ ] Página de oferta publicada
- [ ] Contratos y cláusulas preparadas
- [ ] Primeros clientes identificados

#### Checklist legal/ético:
- [ ] Políticas de uso responsable escritas
- [ ] Formularios de consentimiento listos
- [ ] Limitaciones de uso clarificadas
- [ ] Casos de uso prohibidos identificados

### Plan de acción: Próximos 30 días

#### Semana 1: Validación
- **Días 1-3**: Perfecciona tu caso de uso principal
- **Días 4-7**: Crea 2-3 ejemplos de tu trabajo

#### Semana 2: Construcción
- **Días 8-10**: Finaliza tu página de oferta
- **Días 11-14**: Establece precios y paquetes

#### Semana 3: Lanzamiento suave
- **Días 15-17**: Comparte con tu red cercana
- **Días 18-21**: Refina basado en feedback inicial

#### Semana 4: Escalamiento
- **Días 22-24**: Lanza públicamente
- **Días 25-30**: Optimiza y documenta lecciones aprendidas

### Recursos adicionales incluidos

#### Plantillas descargables:
1. **📋 Política de uso responsable** - Template completo
2. **📊 Matriz de plataformas** - Especificaciones técnicas
3. **🔄 Flujo TTS optimizado** - Paso a paso visual
4. **💼 Página de oferta** - Template con copy probado

#### Herramientas recomendadas:
- **Edición de audio**: Audacity (gratis), Reaper ($60)
- **Gestión de proyectos**: Notion, Trello
- **Pagos**: Stripe, PayPal Business
- **Comunicación**: Calendly, Zoom

### Comunidad y soporte continuo

#### Próximos pasos para seguir creciendo:
1. **Únete a nuestra comunidad** de estudiantes
2. **Comparte tus resultados** y casos de éxito
3. **Solicita feedback** en proyectos específicos
4. **Mantente actualizado** con nuevas funcionalidades

### Mensaje final

La IA de voz no es solo una herramienta tecnológica; es una oportunidad de **democratizar la comunicación** y **amplificar voces** que antes tenían barreras técnicas o económicas.

Recuerda nuestro principio fundamental:
> **"Amplifica tu mensaje, no reemplaces tu humanidad."**

### Tu entregable final:

Crea tu **plan de acción personalizado** que incluya:
- [ ] Tu nicho específico elegido
- [ ] Servicios principales que ofrecerás
- [ ] Primeros 3 clientes potenciales identificados
- [ ] Timeline de lanzamiento (30-60-90 días)
- [ ] Métricas de éxito definidas

### ¡Es hora de monetizar tu voz con IA!

El futuro de la comunicación está en tus manos. Tienes las herramientas, el conocimiento y la estructura para construir un negocio exitoso.

**Tu próxima acción**: Implementa tu primer caso de uso en las próximas 48 horas.

¡Esperamos ver tus resultados! 🎙️✨`,
        videoUrl: 'https://www.youtube.com/watch?v=ejemplo-3-3',
        duration: 15,
        order: 10
      }
    ];

    // Crear las lecciones del MÓDULO 3
    for (const lessonData of module3Lessons) {
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
    console.log('\n🎉 Seed del MÓDULO 3 completado exitosamente!');
    
    // Mostrar resumen completo del curso
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

    const module3Count = await prisma.lesson.count({
      where: { 
        courseId: course.id,
        title: { startsWith: '3.' }
      }
    });
    
    console.log(`\n📊 Resumen FINAL para "${course.title}":`);
    console.log(`- Lecciones totales: ${actualLessonsCount}`);
    console.log(`- MÓDULO 1: ${module1Count}/3 lecciones ✅`);
    console.log(`- MÓDULO 2: ${module2Count}/4 lecciones ✅`);
    console.log(`- MÓDULO 3: ${module3Count}/3 lecciones ✅`);
    console.log('\n🎓 CURSO COMPLETO IMPLEMENTADO! 🎓');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedModulo3MonetizaVoz()
    .then(() => {
      console.log('✅ Script completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { seedModulo3MonetizaVoz };