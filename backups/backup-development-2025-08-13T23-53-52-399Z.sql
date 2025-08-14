-- Backup de base de datos: development
-- Fecha: 2025-08-13T23:53:52.400Z
-- Generado por: backup-databases.ts

-- Usuarios (6 registros)
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cmdhyu3bi0005jx048jinmv6t', 'aquinozair3@gmail.com', NULL, NULL, 'ADMIN', '2025-07-24T22:30:16.398Z', '2025-08-07T00:01:43.166Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cmdhipu140000la04lk6x6aqe', 'rickflo528@gmail.com', NULL, NULL, 'USER', '2025-07-24T14:59:03.881Z', '2025-08-05T23:26:36.962Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cme0hkdp50000jv04arpy1qx2', 'solismartinezluisdavid@gmail.com', NULL, NULL, 'USER', '2025-08-06T21:34:27.162Z', '2025-08-13T23:45:01.315Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cme3d7va10002e5acs9gcat1n', 'luissolis.17@outlook.com', NULL, NULL, 'USER', '2025-08-08T21:56:03.481Z', '2025-08-13T23:45:44.858Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cme37m5uh0002vqiw9dd0thj5', 'mallotomendoza@gmail.com', NULL, NULL, 'USER', '2025-08-08T19:19:12.665Z', '2025-08-08T19:19:33.382Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt") VALUES ('cme1ybn260003e5q4dpppa9tb', 'luisdavid.ls47@gmail.com', NULL, NULL, 'ADMIN', '2025-08-07T22:11:19.038Z', '2025-08-13T23:28:19.576Z') ON CONFLICT (id) DO NOTHING;

-- Cursos (9 registros)
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cmddav1bv0001e5ko3o5dt2cv', 'Desarrollo Web Full Stack con React y Node.js', 'desarrollo-web-fullstack', 'Aprende a crear aplicaciones web completas desde cero. Domina React, Node.js, Express, MongoDB y despliegue en la nube.', 'Curso completo de desarrollo web full stack con las tecnologías más demandadas del mercado.', '/images/16.png', 99.98999999999999, 'DESARROLLO_WEB', 'INTERMEDIATE', 25, 15, 'PUBLISHED', NULL, NULL, 4.8, '2025-07-21T16:08:04.987Z', '2025-08-02T21:32:57.975Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cmdf4hcn50000e5isc57n04xy', 'Monetiza con la IA', 'monetiza-ia', 'Descubre cómo generar ingresos utilizando inteligencia artificial. Aprende estrategias prácticas para monetizar herramientas de IA y crear fuentes de ingresos pasivos.', 'Aprende a generar ingresos con inteligencia artificial', '/images/monetiza-ia.png', 0, 'IA_PARA_EMPRENDER', 'INTERMEDIATE', 3, 8, 'PUBLISHED', NULL, 1250, 4.8, '2025-07-22T22:45:01.121Z', '2025-07-31T22:15:36.585Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cmds0r34u0000e5048x4gkzi7', 'Asistentes virtuales con IA', 'asistentes-virtuales-ia', 'Descubre cómo crear y configurar asistentes virtuales inteligentes para automatizar tareas y mejorar la productividad en tu organización. Domina Google Gemini, ChatGPT y otras herramientas de IA.', 'Domina la creación de asistentes virtuales personalizados para potenciar tu negocio utilizando Google Gemini y ChatGPT', '/images/18.png', 0, 'IA_PARA_EMPRENDER', 'INTERMEDIATE', 4, 21, 'PUBLISHED', NULL, NULL, 0, '2025-07-31T23:21:37.183Z', '2025-08-04T23:13:50.825Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cmdupxdio0000e51oeuyvbqns', 'Aprende a crear videos profesionales con IA', 'videos-profesionales-ia', 'Domina las herramientas de IA para crear contenido audiovisual profesional. Aprende a generar videos, editar con inteligencia artificial y optimizar para diferentes plataformas.', 'Crea contenido audiovisual profesional usando inteligencia artificial', '/images/15.png', 0, 'MARKETING_DIGITAL', 'INTERMEDIATE', 18, 11, 'PUBLISHED', NULL, NULL, 0, '2025-08-02T20:41:53.328Z', '2025-08-02T21:32:47.206Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('mockup-cero', 'Crea Mockups con IA desde cero sin saber nada de diseño', 'mockup-cero', 'Diseñar presentaciones visuales atractivas usando inteligencia artificial. Aprende a crear mockups profesionales sin experiencia previa en diseño, utilizando herramientas de IA para presentar ideas, productos y servicios.', 'Aprende a crear mockups profesionales sin experiencia previa en diseño usando IA', '/images/19.png', 0, 'HABILIDADES_IRREMPLAZABLES', 'BEGINNER', 5, 8, 'PUBLISHED', NULL, NULL, 0, '2025-08-05T15:39:32.076Z', '2025-08-05T16:54:09.675Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cme1s4sb90001e5zo9it0330m', 'Guiones para videos promocionales con IA', 'guiones-videos-promocionales-ia', 'En este curso aprenderás a crear guiones efectivos para videos promocionales y contenido en redes sociales utilizando herramientas de inteligencia artificial como ChatGPT, Claude y Copy.ai. A través de ejercicios prácticos, entenderás las diferencias entre los formatos, aprenderás técnicas de persuasión, y dominarás la estructura de contenido que convierte. Este curso es ideal para emprendedores, creadores de contenido, freelancers y equipos de marketing que buscan ahorrar tiempo, optimizar su mensaje y conectar con su audiencia usando IA.', 'Aprende a crear guiones efectivos para videos promocionales usando herramientas de IA como ChatGPT y Claude.', '/images/20.png', 0, 'MARKETING_DIGITAL', 'BEGINNER', 2, 15, 'PUBLISHED', NULL, NULL, 0, '2025-08-07T19:18:01.558Z', '2025-08-07T20:09:42.550Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('vibe-coding-claude-cursor', 'Vibe coding con Claude code y Cursor', 'vibe-coding-claude-cursor', 'Domina el desarrollo de código con inteligencia artificial. Aprende a usar Claude Code y Cursor para acelerar tu productividad como desarrollador y crear código más eficiente.', 'Desarrollo de código con IA usando Claude Code y Cursor', '/images/17.png', 99.98999999999999, 'HABILIDADES_IRREMPLAZABLES', 'INTERMEDIATE', 20, 6, 'PUBLISHED', NULL, NULL, 0, '2025-08-02T20:24:19.807Z', '2025-08-07T23:08:18.308Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cme30lnzr0001e5lk928moflk', 'Monetiza tu Voz con IA: ElevenLabs para anuncios, cursos y podcasts (sin curva técnica)', 'monetiza-voz-ia-elevenlabs', 'Aprende a monetizar tu voz utilizando inteligencia artificial con ElevenLabs. Crea anuncios profesionales, cursos narrados y podcasts de alta calidad sin conocimientos técnicos. Desde la configuración básica hasta estrategias avanzadas de monetización.', 'Monetiza tu voz con IA usando ElevenLabs para anuncios, cursos y podcasts sin complejidad técnica.', '/images/21.png', 97, 'IA_PARA_EMPRENDER', 'BEGINNER', 8, 10, 'PUBLISHED', NULL, NULL, 0, '2025-08-08T16:02:52.214Z', '2025-08-08T18:51:51.550Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Course" (id, title, slug, description, "shortDescription", "imageUrl", price, category, difficulty, "durationHours", "lessonsCount", status, meta, "studentsCount", rating, "createdAt", "updatedAt") VALUES ('cmeaiyylw0000e5jg9xd2r6ng', 'Curso prueba final', 'curso-prueba-final', 'Prueba final de la implementacion de crear cursos desde el formulario optimizando tiempos de proceso.', 'Es el curso de prueba final', 'https://utfs.io/f/P2bnXUoat3WfQYZpKZeafq9bogy3hEzJGkOS7vWndVPx5260', 4, 'DESARROLLO_WEB', 'INTERMEDIATE', 8, 9, 'PUBLISHED', '{"pageDataV1":{"price":4,"title":"Curso prueba final","tools":["google","Spotify","Facebook"],"isFree":false,"rating":3.6,"modules":[{"title":"Modulo 1","lessons":[{"title":"Lección 1","isFree":false,"duration":10}],"description":"Modulo de prueba"},{"title":"Módulo 2","lessons":[{"title":"Lección 1","isFree":false,"duration":10},{"title":"Lección 2","isFree":false,"duration":10}],"description":"prueba 2"},{"title":"Módulo 3","lessons":[{"title":"Lección 1","isFree":false,"duration":10},{"title":"Lección 2","isFree":false,"duration":10},{"title":"Lección 3","isFree":false,"duration":10},{"title":"Lección 4","isFree":false,"duration":10},{"title":"Lección 5","isFree":false,"duration":10}],"description":"prueba 3"},{"title":"Módulo 4","lessons":[{"title":"Lección 1","isFree":false,"duration":10}],"description":"prueba 4"}],"sidebar":{"includes":[],"durationHours":8},"thumbnail":"https://utfs.io/f/P2bnXUoat3WfQYZpKZeafq9bogy3hEzJGkOS7vWndVPx5260","instructor":{"bio":"graduado del ITP","name":"Flores Erick","image":"https://utfs.io/f/P2bnXUoat3WfR9MfhotSAvJp48uVEPjmsYXd7ODoCeGrQxHZ","title":"Experto en cursos de IA"},"description":"Prueba final de la implementacion de crear cursos desde el formulario optimizando tiempos de proceso.","testimonials":[{"rating":5,"content":"Testtesttesttesttest","studentName":"David","studentTitle":"estudiante"}],"learningGoals":["cursos nuevos rapido"],"originalPrice":12,"prerequisites":["test","test"],"studentsCount":150,"objectivesLead":"Cursos rapidamente creados","shortDescription":"Es el curso de prueba final"},"templateId":"course-v1","templateVersion":1}', 150, 3.6, '2025-08-13T22:11:28.820Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;

-- Lecciones (103 registros)
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32go3u0001e5jk05eq8352', 'cme30lnzr0001e5lk928moflk', '1.1 Origen de ElevenLabs (story breve)', '## Origen de ElevenLabs

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
Crear un mini-pitch (3 frases) de cómo usarás ElevenLabs en tu proyecto personal o empresarial.', 'https://www.youtube.com/watch?v=ejemplo-1-1', 25, 1, '2025-08-08T16:54:58.314Z', '2025-08-08T16:54:58.314Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32goam0003e5jk3mkyp4ee', 'cme30lnzr0001e5lk928moflk', '1.2 Alcances y límites (ética y uso responsable)', '## Alcances y límites de ElevenLabs

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
Crear una política breve de uso ético para tu marca usando la plantilla incluida en el curso.', 'https://www.youtube.com/watch?v=ejemplo-1-2', 30, 2, '2025-08-08T16:54:58.559Z', '2025-08-08T16:54:58.559Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32goey0005e5jkpt31edta', 'cme30lnzr0001e5lk928moflk', '1.3 Panorama TTS (comparativa rápida)', '## Panorama de Text-to-Speech (TTS)

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
Identificar qué herramienta usar según tu caso específico de negocio.', 'https://www.youtube.com/watch?v=ejemplo-1-3', 25, 3, '2025-08-08T16:54:58.714Z', '2025-08-08T16:54:58.714Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32lcta0001e5fgd5kgyuq0', 'cme30lnzr0001e5lk928moflk', '2.1 Introducción al flujo', '## Introducción al flujo de trabajo con ElevenLabs

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
Crear tu propio flujo de 5 pasos personalizado para tu proyecto específico usando la plantilla proporcionada.', 'https://www.youtube.com/watch?v=ejemplo-2-1', 25, 4, '2025-08-08T16:58:36.958Z', '2025-08-08T16:58:36.958Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32ld000003e5fgq9w1ydfu', 'cme30lnzr0001e5lk928moflk', '2.2 Text-to-Speech (TTS) base', '## Text-to-Speech: Fundamentos prácticos

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
Video promocional corto (60-90s) con voice-over generado por TTS, completamente terminado y listo para publicar.', 'https://www.youtube.com/watch?v=ejemplo-2-2', 35, 5, '2025-08-08T16:58:37.200Z', '2025-08-08T16:58:37.200Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32ld4f0005e5fgde8rgcq0', 'cme30lnzr0001e5lk928moflk', '2.3 Mejora, cambio y traducción de voz', '## Personalización avanzada de la voz

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
2 variantes del mismo video en diferentes idiomas (inglés y portugués), optimizadas para sus respectivos mercados.', 'https://www.youtube.com/watch?v=ejemplo-2-3', 40, 6, '2025-08-08T16:58:37.359Z', '2025-08-08T16:58:37.359Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod1-les3', 'cmdupxdio0000e51oeuyvbqns', '1.3 Casos de Uso y Aplicaciones Comerciales', 'Identifica oportunidades de negocio y aplicaciones prácticas', NULL, 18, 3, '2025-08-02T21:32:46.511Z', '2025-08-02T21:32:46.511Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod2-les1', 'cmdupxdio0000e51oeuyvbqns', '2.1 Dominio de Synthesia', 'Aprende a crear presentadores virtuales profesionales', NULL, 25, 4, '2025-08-02T21:32:46.589Z', '2025-08-02T21:32:46.589Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod2-les2', 'cmdupxdio0000e51oeuyvbqns', '2.2 Generación con Runway ML', 'Explora la creación de videos desde texto y conceptos', NULL, 30, 5, '2025-08-02T21:32:46.666Z', '2025-08-02T21:32:46.666Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod2-les3', 'cmdupxdio0000e51oeuyvbqns', '2.3 Edición Inteligente con Herramientas IA', 'Optimiza tu flujo de trabajo con edición automatizada', NULL, 22, 6, '2025-08-02T21:32:46.744Z', '2025-08-02T21:32:46.744Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod3-les1', 'cmdupxdio0000e51oeuyvbqns', '3.1 Optimización para Diferentes Plataformas', 'Adapta tu contenido para YouTube, TikTok, Instagram y más', NULL, 18, 7, '2025-08-02T21:32:46.821Z', '2025-08-02T21:32:46.821Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod3-les2', 'cmdupxdio0000e51oeuyvbqns', '3.2 SEO y Metadatos para Videos', 'Maximiza el alcance orgánico de tu contenido audiovisual', NULL, 15, 8, '2025-08-02T21:32:46.899Z', '2025-08-02T21:32:46.899Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod4-les1', 'cmdupxdio0000e51oeuyvbqns', '4.1 Modelos de Monetización con Videos IA', 'Convierte tu habilidad en videos IA en fuentes de ingresos sostenibles', NULL, 20, 9, '2025-08-02T21:32:46.976Z', '2025-08-02T21:32:46.976Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod4-les2', 'cmdupxdio0000e51oeuyvbqns', '4.2 Automatización del Flujo de Trabajo', 'Escala tu producción mediante automatización inteligente', NULL, 25, 10, '2025-08-02T21:32:47.052Z', '2025-08-02T21:32:47.052Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod4-les3', 'cmdupxdio0000e51oeuyvbqns', '4.3 Casos de Éxito y Mejores Prácticas', 'Aprende de casos reales y estrategias probadas', NULL, 15, 11, '2025-08-02T21:32:47.129Z', '2025-08-02T21:32:47.129Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4sft0003e5zoajkhytmn', 'cme1s4sb90001e5zo9it0330m', '1.1 Introducción al Copywriting Digital', 'Fundamentos básicos del copywriting aplicado a contenido digital', NULL, 15, 1, '2025-08-07T19:18:01.722Z', '2025-08-07T20:09:41.289Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4smg0007e5zozsau178f', 'cme1s4sb90001e5zo9it0330m', '1.2 Estructura de un Guión Efectivo', 'Cómo estructurar guiones que convierten y mantienen la atención', NULL, 20, 2, '2025-08-07T19:18:01.961Z', '2025-08-07T20:09:41.444Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4st1000de5zoxcjgqoq7', 'cme1s4sb90001e5zo9it0330m', '1.3 Psicología de la Persuasión', 'Principios psicológicos para crear contenido persuasivo', NULL, 18, 3, '2025-08-07T19:18:02.198Z', '2025-08-07T20:09:41.523Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4t1s000le5zo94wvokdz', 'cme1s4sb90001e5zo9it0330m', '2.1 Introducción a ChatGPT para Guiones', 'Configuración y primeros pasos con ChatGPT', NULL, 15, 4, '2025-08-07T19:18:02.513Z', '2025-08-07T20:09:41.602Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4t3y000ne5zole6zszqv', 'cme1s4sb90001e5zo9it0330m', '2.2 Prompts Efectivos para Guiones', 'Cómo escribir prompts que generen guiones de calidad', NULL, 20, 5, '2025-08-07T19:18:02.590Z', '2025-08-07T20:09:41.681Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4t64000pe5zo7003920w', 'cme1s4sb90001e5zo9it0330m', '2.3 Claude AI para Refinamiento', 'Uso de Claude para mejorar y pulir guiones', NULL, 15, 6, '2025-08-07T19:18:02.668Z', '2025-08-07T20:09:41.760Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tah000te5zogehx69u9', 'cme1s4sb90001e5zo9it0330m', '3.1 Estructura AIDA para Videos Promocionales', 'Aplicación del método AIDA en videos promocionales', NULL, 20, 7, '2025-08-07T19:18:02.825Z', '2025-08-07T20:09:41.839Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tco000ve5zob3pbncum', 'cme1s4sb90001e5zo9it0330m', '3.2 Hook y Apertura Impactante', 'Cómo crear aperturas que capten la atención inmediatamente', NULL, 18, 8, '2025-08-07T19:18:02.904Z', '2025-08-07T20:09:41.918Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tev000xe5zoszjiuj2z', 'cme1s4sb90001e5zo9it0330m', '3.3 Desarrollo del Beneficio Principal', 'Presentación efectiva del beneficio principal del producto/servicio', NULL, 20, 9, '2025-08-07T19:18:02.983Z', '2025-08-07T20:09:41.997Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tj80011e5zot8zjw35z', 'cme1s4sb90001e5zo9it0330m', '4.1 Adaptación para Instagram', 'Creación de guiones optimizados para Instagram', NULL, 20, 10, '2025-08-07T19:18:03.140Z', '2025-08-07T20:09:42.075Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tle0013e5zoag46olae', 'cme1s4sb90001e5zo9it0330m', '4.2 Guiones para TikTok', 'Estructura y estilo para contenido de TikTok', NULL, 18, 11, '2025-08-07T19:18:03.219Z', '2025-08-07T20:09:42.154Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tnm0015e5zov3hnazbu', 'cme1s4sb90001e5zo9it0330m', '4.3 Contenido para LinkedIn', 'Guiones profesionales para LinkedIn', NULL, 20, 12, '2025-08-07T19:18:03.298Z', '2025-08-07T20:09:42.234Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4trx0019e5zomcv9kagv', 'cme1s4sb90001e5zo9it0330m', '5.1 A/B Testing de Guiones', 'Cómo probar diferentes versiones de guiones', NULL, 15, 13, '2025-08-07T19:18:03.453Z', '2025-08-07T20:09:42.313Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tu3001be5zobudyywsx', 'cme1s4sb90001e5zo9it0330m', '5.2 Métricas de Rendimiento', 'Análisis de métricas para medir el éxito de los guiones', NULL, 18, 14, '2025-08-07T19:18:03.531Z', '2025-08-07T20:09:42.391Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme1s4tw9001de5zoea0oomu3', 'cme1s4sb90001e5zo9it0330m', '5.3 Optimización Continua', 'Proceso de mejora continua basado en datos', NULL, 12, 15, '2025-08-07T19:18:03.609Z', '2025-08-07T20:09:42.469Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkg80001e5sklyq6zhc3', 'mockup-cero', '1.1 ¿Qué es un mockup?', 'Un mockup es una representación visual estática y detallada de un diseño o producto antes de su implementación real. Sirve como una maqueta o presentación visual que simula cómo se verá algo en el mundo real (una app, un sitio web, un envase, etc.). Incluye conceptos fundamentales, importancia y casos de uso en negocios y marketing.', 'https://www.youtube.com/watch?v=example1-1', 10, 1, '2025-08-05T16:15:40.040Z', '2025-08-05T16:15:40.040Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkkj0003e5skpj6xocji', 'mockup-cero', '1.2 Tipologías', 'Explora los diferentes tipos de mockups: mockups web (landing pages, blogs, tiendas online), mockups móviles (apps, redes sociales, navegación móvil), y mockups de producto y branding (tazas, bolsas, camisetas, empaques).', 'https://www.youtube.com/watch?v=example1-2', 12, 2, '2025-08-05T16:15:40.196Z', '2025-08-05T16:15:40.196Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkmq0005e5skd7awa7hf', 'mockup-cero', '1.3 Diferencias entre wireframes, prototipos y mockups', 'Comprende las diferencias clave entre wireframes (bajo detalle, estructura general), mockups (alto detalle, apariencia visual real), y prototipos (muy alto detalle, simulación con interacciones). Incluye tabla comparativa completa.', 'https://www.youtube.com/watch?v=example1-3', 15, 3, '2025-08-05T16:15:40.274Z', '2025-08-05T16:15:40.274Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkox0007e5skmk20laur', 'mockup-cero', '1.4 Actividad Práctica 1: Análisis Rápido de Mockups Exitosos', 'Aprende a identificar qué hace visualmente atractivo y funcional a un mockup mediante análisis práctico. Analiza mockups existentes respondiendo 3 preguntas clave para desarrollar tu ojo crítico para el diseño.', 'https://www.youtube.com/watch?v=example1-4', 8, 4, '2025-08-05T16:15:40.354Z', '2025-08-05T16:15:40.354Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkr40009e5skmm3hwpfb', 'mockup-cero', '2.1 Familiarizarte con las principales herramientas de IA', 'Explora y configura las principales herramientas: Figma AI (diseños avanzados), Uizard.io (ideas a interfaces), Canva (herramienta principal), y Mockup World (plantillas gratuitas). Incluye guía completa de Canva, prompts para ChatGPT y actividades prácticas.', 'https://www.youtube.com/watch?v=example2-1', 25, 5, '2025-08-05T16:15:40.433Z', '2025-08-05T16:15:40.433Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqktb000be5skivefjiex', 'mockup-cero', '3.1 Crear una landing page completa', 'Crea una landing page completa y funcional con estructura profesional: header con logo y menú, hero con imagen y CTA, sección de beneficios, testimonios o cifras, y CTA final. Incluye actividades en Canva y prompts específicos.', 'https://www.youtube.com/watch?v=example3-1', 30, 6, '2025-08-05T16:15:40.512Z', '2025-08-05T16:15:40.512Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32ld8u0007e5fgx1xvewoa', 'cme30lnzr0001e5lk928moflk', '2.4 Postproducción (toques pro)', '## Postproducción profesional para calidad broadcast

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
Audio postproducido con calidad broadcast professional, listo para usar en cualquier medio comercial.', 'https://www.youtube.com/watch?v=ejemplo-2-4', 20, 7, '2025-08-08T16:58:37.518Z', '2025-08-08T16:58:37.518Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32r9vf0001e5oomp7hne2b', 'cme30lnzr0001e5lk928moflk', '3.1 Casos de la vida real', '## Casos de la vida real con ElevenLabs

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
- ✅ **Guía de timing** para diferentes formatos', 'https://www.youtube.com/watch?v=ejemplo-3-1', 40, 8, '2025-08-08T17:03:13.082Z', '2025-08-08T17:03:13.082Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32ra2o0003e5ooh7f4rnci', 'cme30lnzr0001e5lk928moflk', '3.2 ElevenLabs como negocio', '## Monetizando ElevenLabs: Tu negocio de voz IA

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
```
"Autorizo el uso de mi voz para generar contenido sintético exclusivamente para:
- [Propósito específico]
- [Duración del permiso]  
- [Territorios/idiomas autorizados]  
- [Limitaciones expresas]"
```

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
4. **Calculadora de costos** para tus proyectos', 'https://www.youtube.com/watch?v=ejemplo-3-2', 35, 9, '2025-08-08T17:03:13.345Z', '2025-08-08T17:03:13.345Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cme32ra740005e5oo1x58gr72', 'cme30lnzr0001e5lk928moflk', '3.3 Conclusión y siguientes pasos', '## Conclusión: Tu camino hacia la monetización con IA de voz

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

¡Esperamos ver tus resultados! 🎙️✨', 'https://www.youtube.com/watch?v=ejemplo-3-3', 15, 10, '2025-08-08T17:03:13.504Z', '2025-08-08T17:03:13.504Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1g90003e5kov39obh94', 'cmddav1bv0001e5ko3o5dt2cv', 'Introducción al Desarrollo Full Stack', 'Conceptos fundamentales del desarrollo web full stack y las tecnologías que aprenderás.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 15, 1, '2025-07-21T16:08:05.146Z', '2025-07-21T16:08:05.146Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1kh0005e5kow4mgzmct', 'cmddav1bv0001e5ko3o5dt2cv', 'Configuración del Entorno de Desarrollo', 'Instalación y configuración de Node.js, npm, Git y herramientas de desarrollo.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 2, '2025-07-21T16:08:05.298Z', '2025-07-21T16:08:05.298Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1mn0007e5kohizki664', 'cmddav1bv0001e5ko3o5dt2cv', 'Fundamentos de HTML5 y CSS3', 'Estructura semántica, flexbox, grid y diseño responsive moderno.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 3, '2025-07-21T16:08:05.375Z', '2025-07-21T16:08:05.375Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1os0009e5koev6dgbpe', 'cmddav1bv0001e5ko3o5dt2cv', 'JavaScript Moderno (ES6+)', 'Arrow functions, destructuring, async/await, módulos y promesas.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 4, '2025-07-21T16:08:05.452Z', '2025-07-21T16:08:05.452Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1qy000be5kouysaarac', 'cmddav1bv0001e5ko3o5dt2cv', 'Introducción a React', 'Componentes, props, estado, hooks y ciclo de vida de componentes.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 35, 5, '2025-07-21T16:08:05.530Z', '2025-07-21T16:08:05.530Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1t3000de5kofiq8ig9o', 'cmddav1bv0001e5ko3o5dt2cv', 'Estado Global con Context API', 'Gestión de estado global, useContext y patrones de diseño.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 6, '2025-07-21T16:08:05.607Z', '2025-07-21T16:08:05.607Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1v8000fe5kocwfdvahi', 'cmddav1bv0001e5ko3o5dt2cv', 'Routing con React Router', 'Navegación, rutas dinámicas, protected routes y lazy loading.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 7, '2025-07-21T16:08:05.685Z', '2025-07-21T16:08:05.685Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1xd000he5koloq5uiz6', 'cmddav1bv0001e5ko3o5dt2cv', 'Backend con Node.js y Express', 'Servidor HTTP, middleware, rutas, controladores y validación.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 40, 8, '2025-07-21T16:08:05.761Z', '2025-07-21T16:08:05.761Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav1zj000je5koc6apfrhg', 'cmddav1bv0001e5ko3o5dt2cv', 'Base de Datos MongoDB', 'CRUD operations, Mongoose ODM, esquemas y relaciones.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 35, 9, '2025-07-21T16:08:05.839Z', '2025-07-21T16:08:05.839Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav21p000le5ko97szwugj', 'cmddav1bv0001e5ko3o5dt2cv', 'Autenticación JWT', 'Registro, login, tokens JWT, middleware de autenticación.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 10, '2025-07-21T16:08:05.917Z', '2025-07-21T16:08:05.917Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav23u000ne5koz2liprvy', 'cmddav1bv0001e5ko3o5dt2cv', 'API RESTful', 'Diseño de APIs, endpoints, status codes y documentación.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 11, '2025-07-21T16:08:05.995Z', '2025-07-21T16:08:05.995Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav25z000pe5ko4qvr1yso', 'cmddav1bv0001e5ko3o5dt2cv', 'Integración Frontend-Backend', 'Consumo de APIs, manejo de errores, loading states.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 30, 12, '2025-07-21T16:08:06.071Z', '2025-07-21T16:08:06.071Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav284000re5koh7bjruv2', 'cmddav1bv0001e5ko3o5dt2cv', 'Despliegue en la Nube', 'Vercel, Heroku, MongoDB Atlas y variables de entorno.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 20, 13, '2025-07-21T16:08:06.148Z', '2025-07-21T16:08:06.148Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav2a9000te5kojph0ctfh', 'cmddav1bv0001e5ko3o5dt2cv', 'Optimización y Performance', 'Lazy loading, code splitting, caching y métricas de rendimiento.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 25, 14, '2025-07-21T16:08:06.225Z', '2025-07-21T16:08:06.225Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmddav2ce000ve5kojb1tytg5', 'cmddav1bv0001e5ko3o5dt2cv', 'Proyecto Final: E-commerce', 'Desarrollo completo de una aplicación de e-commerce full stack.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 60, 15, '2025-07-21T16:08:06.302Z', '2025-07-21T16:08:06.302Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7ygs80001e5ro8cgyad7s', 'cmdf4hcn50000e5isc57n04xy', '1.1 Fundamentos de Monetización con IA', 'Introducción a los conceptos básicos de monetización utilizando inteligencia artificial. Descubre las oportunidades del mercado digital.', 'https://www.youtube.com/watch?v=example1', 20, 1, '2025-07-23T00:22:18.488Z', '2025-07-23T00:22:18.488Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7ygwn0003e5roxziuhqgp', 'cmdf4hcn50000e5isc57n04xy', '2.1 Estrategias de ChatGPT para Negocios', 'Aprende a utilizar ChatGPT para crear productos digitales, automatizar procesos y generar ingresos online.', 'https://www.youtube.com/watch?v=example2', 25, 2, '2025-07-23T00:22:18.647Z', '2025-07-23T00:22:18.647Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7ygyv0005e5roa99bawm8', 'cmdf4hcn50000e5isc57n04xy', '3.1 Creación de Productos Digitales', 'Descubre cómo crear ebooks, cursos online, plantillas y otros productos digitales con herramientas de IA.', 'https://www.youtube.com/watch?v=example3', 30, 3, '2025-07-23T00:22:18.727Z', '2025-07-23T00:22:18.727Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7yh110007e5ro0b6lxxk0', 'cmdf4hcn50000e5isc57n04xy', '4.1 Automatización de Ventas', 'Implementa sistemas automatizados de venta, marketing y atención al cliente utilizando IA.', 'https://www.youtube.com/watch?v=example4', 25, 4, '2025-07-23T00:22:18.806Z', '2025-07-23T00:22:18.806Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7yh370009e5roitshayuk', 'cmdf4hcn50000e5isc57n04xy', '5.1 Marketing Digital con IA', 'Optimiza tus campañas de marketing digital, SEO y redes sociales con herramientas de inteligencia artificial.', 'https://www.youtube.com/watch?v=example5', 30, 5, '2025-07-23T00:22:18.884Z', '2025-07-23T00:22:18.884Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7yh5f000be5rorgf8ujq6', 'cmdf4hcn50000e5isc57n04xy', '6.1 Ingresos Pasivos con IA', 'Crea múltiples fuentes de ingresos pasivos utilizando estrategias de automatización e inteligencia artificial.', 'https://www.youtube.com/watch?v=example6', 25, 6, '2025-07-23T00:22:18.963Z', '2025-07-23T00:22:18.963Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7yh7k000de5roe70p5f0n', 'cmdf4hcn50000e5isc57n04xy', '7.1 Analytics y Optimización', 'Utiliza herramientas de analytics y IA para analizar, optimizar y escalar tus resultados de monetización.', 'https://www.youtube.com/watch?v=example7', 20, 7, '2025-07-23T00:22:19.041Z', '2025-07-23T00:22:19.041Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdf7yh9s000fe5rotp7aikd0', 'cmdf4hcn50000e5isc57n04xy', '8.1 Escalabilidad y Tendencias Futuras', 'Aprende a escalar tu negocio digital y descubre las tendencias futuras en monetización con IA.', 'https://www.youtube.com/watch?v=example8', 20, 8, '2025-07-23T00:22:19.120Z', '2025-07-23T00:22:19.120Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziu3w0001e5ao9kf1iqnh', 'cmds0r34u0000e5048x4gkzi7', '1.1 Introducción a los Asistentes Virtuales con IA', 'Contenido de la lección 1.1: 1.1 Introducción a los Asistentes Virtuales con IA', NULL, 0, 1, '2025-08-01T15:34:58.796Z', '2025-08-01T15:34:58.796Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziu8p0003e5aof9isqghh', 'cmds0r34u0000e5048x4gkzi7', '1.2 Beneficios Empresariales Clave', 'Contenido de la lección 1.2: 1.2 Beneficios Empresariales Clave', NULL, 0, 2, '2025-08-01T15:34:58.969Z', '2025-08-01T15:34:58.969Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziub30005e5aose3jmlkc', 'cmds0r34u0000e5048x4gkzi7', '1.3 Comparación: Google Gemini vs ChatGPT', 'Contenido de la lección 1.3: 1.3 Casos de Uso Empresariales', NULL, 0, 3, '2025-08-01T15:34:59.056Z', '2025-08-01T15:39:11.791Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziudi0007e5aod3itk745', 'cmds0r34u0000e5048x4gkzi7', '1.4 Planificación Estratégica', 'Contenido de la lección 1.4: 1.4 Planificación Estratégica', NULL, 0, 4, '2025-08-01T15:34:59.143Z', '2025-08-01T15:34:59.143Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziufw0009e5aol87339z2', 'cmds0r34u0000e5048x4gkzi7', '2.1 Preparación de Documentación Empresarial', 'Contenido de la lección 2.1: 2.1 Preparación de Documentación Empresarial', NULL, 0, 5, '2025-08-01T15:34:59.228Z', '2025-08-01T15:34:59.228Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuia000be5aoonmaky6k', 'cmds0r34u0000e5048x4gkzi7', '2.2 Configuración de Procesos', 'Contenido de la lección 2.2: 2.2 Configuración de Procesos', NULL, 0, 6, '2025-08-01T15:34:59.314Z', '2025-08-01T15:34:59.314Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuko000de5aog4u9lxz5', 'cmds0r34u0000e5048x4gkzi7', '2.3 Establecimiento de Metodologías', 'Contenido de la lección 2.3: 2.3 Establecimiento de Metodologías', NULL, 0, 7, '2025-08-01T15:34:59.401Z', '2025-08-01T15:34:59.401Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziun2000fe5ao1jtbran3', 'cmds0r34u0000e5048x4gkzi7', '3.1 Introducción a Google Gemini', 'Contenido de la lección 3.1: 3.1 Introducción a Google Gemini', NULL, 0, 8, '2025-08-01T15:34:59.487Z', '2025-08-01T15:34:59.487Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuph000he5aourkr5t1i', 'cmds0r34u0000e5048x4gkzi7', '3.2 Configuración de Gemini', 'Contenido de la lección 3.2: 3.2 Configuración de Gemini', NULL, 0, 9, '2025-08-01T15:34:59.573Z', '2025-08-01T15:34:59.573Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziurw000je5ao9omf2odc', 'cmds0r34u0000e5048x4gkzi7', '3.3 Creación de Asistente con Gemini', 'Contenido de la lección 3.3: 3.3 Creación de Asistente con Gemini', NULL, 0, 10, '2025-08-01T15:34:59.660Z', '2025-08-01T15:34:59.660Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuu9000le5aobg7je8p6', 'cmds0r34u0000e5048x4gkzi7', '3.4 Optimización de Prompts', 'Contenido de la lección 3.4: 3.4 Optimización de Prompts', NULL, 0, 11, '2025-08-01T15:34:59.746Z', '2025-08-01T15:34:59.746Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuwo000ne5aolwpkgsl1', 'cmds0r34u0000e5048x4gkzi7', '4.1 Introducción a ChatGPT', 'Contenido de la lección 4.1: 4.1 Introducción a ChatGPT', NULL, 0, 12, '2025-08-01T15:34:59.832Z', '2025-08-01T15:34:59.832Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziuz2000pe5aoco6iiuje', 'cmds0r34u0000e5048x4gkzi7', '4.2 Configuración de ChatGPT', 'Contenido de la lección 4.2: 4.2 Configuración de ChatGPT', NULL, 0, 13, '2025-08-01T15:34:59.918Z', '2025-08-01T15:34:59.918Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziv1h000re5ao0a2w1mkf', 'cmds0r34u0000e5048x4gkzi7', '4.3 Creación de Asistente con ChatGPT', 'Contenido de la lección 4.3: 4.3 Creación de Asistente con ChatGPT', NULL, 0, 14, '2025-08-01T15:35:00.005Z', '2025-08-01T15:35:00.005Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziv3v000te5aoo22nck44', 'cmds0r34u0000e5048x4gkzi7', '4.4 GPTs Personalizados', 'Contenido de la lección 4.4: 4.4 GPTs Personalizados', NULL, 0, 15, '2025-08-01T15:35:00.092Z', '2025-08-01T15:35:00.092Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziv69000ve5ao5tog460x', 'cmds0r34u0000e5048x4gkzi7', '5.1 Optimización de Rendimiento', 'Contenido de la lección 5.1: 5.1 Optimización de Rendimiento', NULL, 0, 16, '2025-08-01T15:35:00.178Z', '2025-08-01T15:35:00.178Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdsziv8o000xe5aoxqhkk651', 'cmds0r34u0000e5048x4gkzi7', '5.2 Pruebas y Validación', 'Contenido de la lección 5.2: 5.2 Pruebas y Validación', NULL, 0, 17, '2025-08-01T15:35:00.264Z', '2025-08-01T15:35:00.264Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdszivb2000ze5ao3eccaj4f', 'cmds0r34u0000e5048x4gkzi7', '5.3 Mantenimiento Continuo', 'Contenido de la lección 5.3: 5.3 Mantenimiento Continuo', NULL, 0, 18, '2025-08-01T15:35:00.350Z', '2025-08-01T15:35:00.350Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdszivdg0011e5aorowmnx4l', 'cmds0r34u0000e5048x4gkzi7', '5.4 Escalabilidad y Mejoras', 'Contenido de la lección 5.4: 5.4 Escalabilidad y Mejoras', NULL, 0, 19, '2025-08-01T15:35:00.437Z', '2025-08-01T15:35:00.437Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdszivfv0013e5aowzs8cmd9', 'cmds0r34u0000e5048x4gkzi7', '5.5 Monitoreo y Analytics', 'Contenido de la lección 5.5: 5.5 Monitoreo y Analytics', NULL, 0, 20, '2025-08-01T15:35:00.523Z', '2025-08-01T15:35:00.523Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdszivi90015e5aog2xc0rl2', 'cmds0r34u0000e5048x4gkzi7', '5.6 Conclusiones y Próximos Pasos', 'Contenido de la lección 5.6: 5.6 Conclusiones y Próximos Pasos', NULL, 0, 21, '2025-08-01T15:35:00.610Z', '2025-08-01T15:35:00.610Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod1-les1', 'cmdupxdio0000e51oeuyvbqns', '1.1 Introducción a la Creación de Videos con IA', 'Descubre el potencial de la inteligencia artificial en la producción audiovisual moderna', NULL, 15, 1, '2025-08-02T21:32:46.275Z', '2025-08-02T21:32:46.275Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vpc-mod1-les2', 'cmdupxdio0000e51oeuyvbqns', '1.2 Panorama de Herramientas de IA para Video', 'Explora las principales plataformas y herramientas disponibles en el mercado', NULL, 20, 2, '2025-08-02T21:32:46.432Z', '2025-08-02T21:32:46.432Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkvi000de5skwui8tlc5', 'mockup-cero', '4.1 Aprender a diseñar mockups', 'Diseña mockups para apps móviles modernas siguiendo principios mobile-first: diseño vertical, pantallas simples, navegación táctil clara, y énfasis en contraste y legibilidad. Incluye diseño de 3 pantallas clave y recursos UI de Canva.', 'https://www.youtube.com/watch?v=example4-1', 35, 7, '2025-08-05T16:15:40.591Z', '2025-08-05T16:15:40.591Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmdyqqkxq000fe5ska1d3r6ru', 'mockup-cero', '5.1 Crear una identidad visual de marca', 'Proyecto final: crea identidad visual completa (nombre, tono, colores, tipografía, slogan), presenta producto en redes sociales y genera mockups con Sora. Incluye branding con IA, diseño en Canva, mockups directos desde Sora y presentación final.', 'https://www.youtube.com/watch?v=example5-1', 40, 8, '2025-08-05T16:15:40.670Z', '2025-08-05T16:15:40.670Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod1-les1', 'vibe-coding-claude-cursor', '1.1 Introducción al Vibe Coding con IA', 'Descubre el nuevo paradigma de programación asistida por IA y cómo transformará tu forma de codificar', 'https://www.youtube.com/watch?v=example1-1', 15, 1, '2025-08-04T16:53:44.776Z', '2025-08-04T16:53:44.776Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod1-les2', 'vibe-coding-claude-cursor', '1.2 Configuración del Entorno de Desarrollo', 'Prepara tu máquina con todas las herramientas necesarias para comenzar tu viaje en el Vibe Coding', 'https://www.youtube.com/watch?v=example1-2', 20, 2, '2025-08-04T16:53:44.935Z', '2025-08-04T16:53:44.935Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod1-les3', 'vibe-coding-claude-cursor', '1.3 Principios del Desarrollo Asistido por IA', 'Comprende los fundamentos y mejores prácticas para trabajar eficientemente con asistentes de IA', 'https://www.youtube.com/watch?v=example1-3', 18, 3, '2025-08-04T16:53:45.015Z', '2025-08-04T16:53:45.015Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod1-les4', 'vibe-coding-claude-cursor', '1.4 Tu Primera Sesión de Vibe Coding', 'Experimenta tu primera sesión práctica creando una aplicación simple con asistencia de IA', 'https://www.youtube.com/watch?v=example1-4', 25, 4, '2025-08-04T16:53:45.095Z', '2025-08-04T16:53:45.095Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod2-les1', 'vibe-coding-claude-cursor', '2.1 Dominio Avanzado de Claude Code', 'Explora las capacidades avanzadas de Claude Code para proyectos complejos', 'https://www.youtube.com/watch?v=example2-1', 22, 5, '2025-08-04T16:53:45.175Z', '2025-08-04T16:53:45.175Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('vcc-mod2-les2', 'vibe-coding-claude-cursor', '2.2 Proyecto Final Integrado', 'Construye una aplicación completa aplicando todo lo aprendido en el curso', 'https://www.youtube.com/watch?v=example2-2', 45, 6, '2025-08-04T16:53:45.254Z', '2025-08-04T16:53:45.254Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0001e5jgi2jkgt9i', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 1', NULL, NULL, 10, 1, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0002e5jgymplvwus', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 1', NULL, NULL, 10, 101, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0003e5jgcs0ecgd8', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 2', NULL, NULL, 10, 102, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0004e5jg84024v3k', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 1', NULL, NULL, 10, 201, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0005e5jgp8ifur8a', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 2', NULL, NULL, 10, 202, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0006e5jgu0w0779k', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 3', NULL, NULL, 10, 203, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0007e5jgfr9t768y', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 4', NULL, NULL, 10, 204, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0008e5jgklflrfgj', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 5', NULL, NULL, 10, 205, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Lesson" (id, "courseId", title, content, "videoUrl", duration, "order", "createdAt", "updatedAt") VALUES ('cmeaj5jdl0009e5jgi1fugack', 'cmeaiyylw0000e5jg9xd2r6ng', 'Lección 1', NULL, NULL, 10, 301, '2025-08-13T22:16:35.673Z', '2025-08-13T22:16:35.673Z') ON CONFLICT (id) DO NOTHING;
