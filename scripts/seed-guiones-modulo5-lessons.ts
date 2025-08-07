import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGuionesModulo5() {
  try {
    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' }
    });

    if (!course) {
      console.error('Curso no encontrado');
      return;
    }

    console.log('Creando lecciones del Módulo 5...');

    // Lección 13: Métricas clave para evaluar guiones
    await prisma.lesson.create({
      data: {
        title: 'Métricas clave para evaluar guiones',
        order: 13,
        duration: 25,
        courseId: course.id,
        content: `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">📊 Métricas clave para evaluar guiones</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Aprende a medir la efectividad real de tus guiones con datos concretos</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Por qué medir?</h3>
            <p>Para medir la efectividad de un guión, necesitas analizar datos específicos que te digan qué funciona y qué no. Sin métricas, solo tienes intuiciones.</p>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📊 Retención de Audiencia</h3>
            <p><strong>¿Qué es?</strong> Porcentaje de personas que ven el video completo o abandonan en cierta parte.</p>
            
            <h4>Métricas clave de retención:</h4>
            <ul>
              <li><strong>Retención promedio:</strong> % del video que ve la audiencia</li>
              <li><strong>Momento de abandono:</strong> Segundo exacto donde se van</li>
              <li><strong>Picos de retención:</strong> Momentos más enganchantes</li>
              <li><strong>Caídas bruscas:</strong> Elementos que no funcionan</li>
            </ul>
            
            <h4>Benchmarks por plataforma:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>TikTok:</strong> >70% en primeros 3 seg, >50% total<br>
              <strong>Instagram Reels:</strong> >65% en primeros 3 seg, >45% total<br>
              <strong>YouTube Shorts:</strong> >60% en primeros 5 seg, >40% total<br>
              <strong>Stories:</strong> >80% por story (duración completa)</p>
            </div>
            
            <h4>Cómo interpretar la retención:</h4>
            <ul>
              <li><strong>Abandono en seg 1-3:</strong> Hook débil</li>
              <li><strong>Abandono gradual:</strong> Contenido aburrido o lento</li>
              <li><strong>Abandono abrupto:</strong> Momento específico que falla</li>
              <li><strong>Subidas en retención:</strong> Elementos que funcionan</li>
            </ul>
          </div>

          <div style="background-color: #d1ecf1; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0;">🔗 CTR (Click Through Rate)</h3>
            <p><strong>¿Qué es?</strong> Cuántos hacen clic en el enlace o botón del CTA.</p>
            
            <h4>Tipos de CTR importantes:</h4>
            <ul>
              <li><strong>CTR de perfil:</strong> Clics al perfil desde el video</li>
              <li><strong>CTR de link:</strong> Clics en link en bio o directo</li>
              <li><strong>CTR de CTA:</strong> Acciones específicas solicitadas</li>
              <li><strong>CTR de hashtags:</strong> Clics en hashtags del post</li>
            </ul>
            
            <h4>Benchmarks por objetivo:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Brand awareness:</strong> 2-5% CTR<br>
              <strong>Lead generation:</strong> 5-10% CTR<br>
              <strong>Sales/Conversión:</strong> 8-15% CTR<br>
              <strong>Engagement:</strong> 1-3% CTR</p>
            </div>
            
            <h4>Factores que afectan el CTR:</h4>
            <ul>
              <li><strong>Claridad del CTA:</strong> Instrucción específica</li>
              <li><strong>Urgencia:</strong> "Solo hoy", "Últimas horas"</li>
              <li><strong>Valor percibido:</strong> Beneficio claro</li>
              <li><strong>Momento del CTA:</strong> Cuándo aparece en el video</li>
            </ul>
          </div>

          <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">❤️ Interacciones (Engagement)</h3>
            <h4>Métricas de interacción por plataforma:</h4>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📱 Instagram/TikTok:</strong></p>
              <ul>
                <li><strong>Likes:</strong> Indicador básico de resonancia</li>
                <li><strong>Comentarios:</strong> Engagement profundo y conversación</li>
                <li><strong>Guardados:</strong> Valor percibido alto</li>
                <li><strong>Compartidos:</strong> Máxima validación social</li>
              </ul>
              
              <p><strong>🎬 YouTube:</strong></p>
              <ul>
                <li><strong>Watch time:</strong> Tiempo total de visualización</li>
                <li><strong>Suscripciones:</strong> Generadas desde el video</li>
                <li><strong>Comentarios:</strong> Discusión y comunidad</li>
                <li><strong>Likes/Dislikes:</strong> Sentiment analysis</li>
              </ul>
            </div>
            
            <h4>Engagement Rate fórmulas:</h4>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 15px 0;">
              <p><strong>ER básico:</strong> (Likes + Comentarios + Guardados) / Alcance × 100</p>
              <p><strong>ER avanzado:</strong> (Interacciones + Shares + CTR) / Impresiones × 100</p>
              <p><strong>ER por seguidor:</strong> Interacciones totales / Seguidores × 100</p>
            </div>
            
            <h4>Benchmarks de engagement:</h4>
            <ul>
              <li><strong>Excelente:</strong> >6% ER</li>
              <li><strong>Bueno:</strong> 3-6% ER</li>
              <li><strong>Promedio:</strong> 1-3% ER</li>
              <li><strong>Bajo:</strong> <1% ER</li>
            </ul>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🔄 Reproducciones Repetidas</h3>
            <p><strong>¿Por qué importa?</strong> Indica que el contenido es atractivo y memorable.</p>
            
            <h4>Indicadores de replay value:</h4>
            <ul>
              <li><strong>Replay rate:</strong> % de usuarios que ven 2+ veces</li>
              <li><strong>Loop completion:</strong> Videos que se ven en bucle</li>
              <li><strong>Timestamp replays:</strong> Segundos más repetidos</li>
              <li><strong>Progressive views:</strong> Vistas que aumentan con el tiempo</li>
            </ul>
            
            <h4>Elementos que generan replays:</h4>
            <ul>
              <li><strong>Información densa:</strong> Contenido que requiere procesamiento</li>
              <li><strong>Detalles visuales:</strong> Elementos que se notan en segunda vista</li>
              <li><strong>Punchlines:</strong> Momentos cómicos o impactantes</li>
              <li><strong>Transitions:</strong> Efectos visuales llamativos</li>
            </ul>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📊 Meta óptima:</strong> 15-25% de replay rate indica contenido de alta calidad</p>
            </div>
          </div>

          <div style="background-color: #e9ecef; padding: 20px; border-radius: 10px; border-left: 4px solid #6c757d;">
            <h3 style="color: #495057; margin-top: 0;">🔧 Herramientas de Analítica</h3>
            <h4>Por plataforma:</h4>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📱 Instagram Insights:</strong></p>
              <ul>
                <li>Alcance e impresiones detalladas</li>
                <li>Retención por segundo (Reels)</li>
                <li>Navegación entre Stories</li>
                <li>Acciones en perfil generadas</li>
              </ul>
              
              <p><strong>🎵 TikTok Analytics:</strong></p>
              <ul>
                <li>Tiempo de visualización promedio</li>
                <li>Fuentes de tráfico</li>
                <li>Demografía de audiencia</li>
                <li>Rendimiento por hashtag</li>
              </ul>
              
              <p><strong>🎬 YouTube Studio:</strong></p>
              <ul>
                <li>Retención de audiencia detallada</li>
                <li>Fuentes de descubrimiento</li>
                <li>CTR de miniatura</li>
                <li>Revenue per mille (RPM)</li>
              </ul>
            </div>
            
            <h4>Herramientas externas:</h4>
            <ul>
              <li><strong>Hootsuite Analytics:</strong> Vista unificada multiplataforma</li>
              <li><strong>Sprout Social:</strong> Análisis comparativo</li>
              <li><strong>Later:</strong> Optimización de hashtags</li>
              <li><strong>Socialblade:</strong> Tracking histórico</li>
            </ul>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
            <p><strong>Utilizar herramientas de analítica de cada plataforma para obtener datos precisos y cruzarlos con el tipo de guión utilizado:</strong></p>
            
            <h4>Rutina de análisis semanal:</h4>
            <ol>
              <li><strong>Lunes:</strong> Recopilar datos de la semana anterior</li>
              <li><strong>Martes:</strong> Identificar patrones en guiones exitosos</li>
              <li><strong>Miércoles:</strong> Correlacionar métricas con elementos específicos</li>
              <li><strong>Jueves:</strong> Documentar insights en tu base de datos</li>
              <li><strong>Viernes:</strong> Aplicar aprendizajes a próximos guiones</li>
            </ol>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p><strong>📊 Template de seguimiento:</strong></p>
              <div style="font-family: monospace; font-size: 12px;">
                Fecha | Plataforma | Tipo Guión | Hook | Retención 3seg | ER | CTR | Notas
              </div>
            </div>
          </div>
        `
      }
    });

    // Lección 14: A/B testing de guiones
    await prisma.lesson.create({
      data: {
        title: 'A/B testing de guiones',
        order: 14,
        duration: 20,
        courseId: course.id,
        content: `
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; color: #8b4513; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">🔬 A/B testing de guiones</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">La forma más científica de optimizar tus guiones con datos reales</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🎯 ¿Qué es el A/B Testing?</h3>
            <p><strong>Definición:</strong> Consiste en comparar dos versiones de un mismo contenido para determinar cuál genera mejores resultados. Es la forma más científica de optimizar tus guiones.</p>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📋 Principios fundamentales</h3>
            <ul>
              <li><strong>Un solo cambio:</strong> Modifica únicamente un elemento por test</li>
              <li><strong>Condiciones iguales:</strong> Mismo horario, día y audiencia</li>
              <li><strong>Muestra significativa:</strong> Suficientes datos para conclusiones válidas</li>
              <li><strong>Tiempo suficiente:</strong> Mínimo 7 días para obtener patrones</li>
            </ul>
            
            <h4>Variables que puedes testear:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>🎯 Hook (gancho inicial):</strong></p>
              <ul>
                <li>Pregunta vs. estadística</li>
                <li>Personal vs. general</li>
                <li>Emocional vs. racional</li>
              </ul>
              
              <p><strong>📢 CTA (llamada a la acción):</strong></p>
              <ul>
                <li>Directa vs. sutil</li>
                <li>Principio vs. final</li>
                <li>Urgente vs. casual</li>
              </ul>
              
              <p><strong>⏱️ Duración:</strong></p>
              <ul>
                <li>15 vs. 30 segundos</li>
                <li>Información condensada vs. detallada</li>
                <li>Ritmo rápido vs. pausado</li>
              </ul>
            </div>
          </div>

          <div style="background-color: #d1ecf1; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0;">📊 Metodología de Testing</h3>
            <h4>Paso 1: Definir hipótesis</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Ejemplo de hipótesis:</strong></p>
              <p style="font-style: italic;">"Si cambio el hook de pregunta general a resultado específico, entonces la retención en los primeros 3 segundos aumentará del 65% al 75%."</p>
            </div>
            
            <h4>Paso 2: Crear las versiones</h4>
            <ul>
              <li><strong>Versión A (Control):</strong> Tu guión actual</li>
              <li><strong>Versión B (Variante):</strong> Con el elemento modificado</li>
              <li><strong>Todo lo demás igual:</strong> Duración, estructura, CTA</li>
            </ul>
            
            <h4>Paso 3: Publicar en condiciones similares</h4>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Variables a controlar:</strong></p>
              <ul>
                <li><strong>Horario:</strong> Mismo día y hora de la semana</li>
                <li><strong>Hashtags:</strong> Idénticos para ambas versiones</li>
                <li><strong>Audiencia:</strong> Sin segmentación diferente</li>
                <li><strong>Contenido visual:</strong> Similar calidad y estilo</li>
              </ul>
            </div>
            
            <h4>Paso 4: Medir con las mismas métricas</h4>
            <ul>
              <li><strong>Métricas primarias:</strong> Las que buscas optimizar</li>
              <li><strong>Métricas secundarias:</strong> Efectos colaterales</li>
              <li><strong>Periodo de medición:</strong> Mínimo 7 días</li>
            </ul>
          </div>

          <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🎯 Ejemplos Prácticos de Tests</h3>
            <h4>Test 1: Hook Emocional vs. Racional</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Versión A (Emocional):</strong> "Esto cambió mi vida por completo..."</p>
              <p><strong>Versión B (Racional):</strong> "3 datos que demuestran que esto funciona..."</p>
              <p><strong>Métrica objetivo:</strong> Retención en primeros 5 segundos</p>
              <p><strong>Resultado esperado:</strong> Determinar qué resonancia funciona mejor con tu audiencia</p>
            </div>
            
            <h4>Test 2: CTA Temprano vs. Tardío</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Versión A:</strong> CTA en los primeros 10 segundos</p>
              <p><strong>Versión B:</strong> CTA en los últimos 10 segundos</p>
              <p><strong>Métrica objetivo:</strong> CTR y completitud de video</p>
              <p><strong>Resultado esperado:</strong> Optimizar timing del CTA</p>
            </div>
            
            <h4>Test 3: Duración Rápida vs. Detallada</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Versión A:</strong> 15 segundos, información condensada</p>
              <p><strong>Versión B:</strong> 45 segundos, información detallada</p>
              <p><strong>Métrica objetivo:</strong> Engagement total y compartidos</p>
              <p><strong>Resultado esperado:</strong> Encontrar duración óptima</p>
            </div>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">📈 Interpretación de Resultados</h3>
            <h4>Significancia estadística:</h4>
            <ul>
              <li><strong>Diferencia mínima:</strong> >20% para ser considerada relevante</li>
              <li><strong>Muestra mínima:</strong> 1000 visualizaciones por versión</li>
              <li><strong>Confianza:</strong> 95% de certeza en los resultados</li>
            </ul>
            
            <h4>Qué hacer con los resultados:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>✅ Ganador claro (>20% diferencia):</strong></p>
              <ul>
                <li>Implementar el elemento ganador</li>
                <li>Aplicar aprendizaje a futuros guiones</li>
                <li>Documentar en base de mejores prácticas</li>
              </ul>
              
              <p><strong>⚖️ Resultados similares (<20% diferencia):</strong></p>
              <ul>
                <li>Extender periodo de medición</li>
                <li>Aumentar tamaño de muestra</li>
                <li>Considerar variables externas</li>
              </ul>
              
              <p><strong>❌ Ambas versiones con mal rendimiento:</strong></p>
              <ul>
                <li>El problema puede estar en otro elemento</li>
                <li>Replantear hipótesis inicial</li>
                <li>Testear variable diferente</li>
              </ul>
            </div>
          </div>

          <div style="background-color: #e9ecef; padding: 20px; border-radius: 10px; border-left: 4px solid #6c757d;">
            <h3 style="color: #495057; margin-top: 0;">📅 Planificación de Tests</h3>
            <h4>Calendario mensual sugerido:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 15px 0;">
              <p><strong>Semana 1:</strong> Test de Hook (3 variantes)<br>
              <strong>Semana 2:</strong> Test de CTA (2 variantes)<br>
              <strong>Semana 3:</strong> Test de Duración (2 variantes)<br>
              <strong>Semana 4:</strong> Test de Estructura narrativa (2 variantes)</p>
            </div>
            
            <h4>Template de documentación:</h4>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px; margin: 15px 0;">
              <p><strong>Test #:</strong> ___________<br>
              <strong>Fecha:</strong> ___________<br>
              <strong>Hipótesis:</strong> ___________<br>
              <strong>Variable testeda:</strong> ___________<br>
              <strong>Versión A:</strong> ___________<br>
              <strong>Versión B:</strong> ___________<br>
              <strong>Métrica objetivo:</strong> ___________<br>
              <strong>Resultado:</strong> ___________<br>
              <strong>Acción a tomar:</strong> ___________</p>
            </div>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
            <p><strong>Planificar mínimo 3 pruebas A/B al mes y documentar los resultados para ir construyendo una base de "mejores prácticas" adaptada a tu marca:</strong></p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h4>📋 Proceso obligatorio mensual:</h4>
              <ol>
                <li><strong>Planificar:</strong> 3 tests mínimo con hipótesis clara</li>
                <li><strong>Ejecutar:</strong> En condiciones controladas</li>
                <li><strong>Medir:</strong> Durante periodo mínimo establecido</li>
                <li><strong>Documentar:</strong> Resultados y aprendizajes</li>
                <li><strong>Implementar:</strong> Cambios en estrategia general</li>
              </ol>
            </div>
            
            <p><strong>Meta:</strong> Al final de 6 meses, tener 18+ insights documentados específicos para tu marca y audiencia.</p>
          </div>
        `
      }
    });

    // Lección 15: Mejora continua del contenido (con actividad integrada)
    await prisma.lesson.create({
      data: {
        title: 'Mejora continua del contenido',
        order: 15,
        duration: 20,
        courseId: course.id,
        content: `
          <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 20px; border-radius: 10px; color: #2d3748; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 24px;">🔄 Mejora continua del contenido</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Crea un sistema que evoluciona con tu audiencia y las plataformas</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">🔄 Filosofía de Mejora Continua</h3>
            <p>La optimización no es un proceso único, sino constante. Aquí aprenderás a crear un sistema de mejora continua que evoluciona con tu audiencia y las plataformas.</p>
            
            <h4>¿Por qué es necesaria?</h4>
            <ul>
              <li><strong>Algoritmos cambiantes:</strong> Las plataformas actualizan constantemente</li>
              <li><strong>Audiencia evolutiva:</strong> Gustos y comportamientos cambian</li>
              <li><strong>Competencia creciente:</strong> El nivel del contenido sube constantemente</li>
              <li><strong>Nuevas tendencias:</strong> Formatos y estilos emergen regularmente</li>
            </ul>
            
            <h4>Mentalidad de crecimiento:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>❌ Mentalidad fija:</strong> "Mi contenido ya está bien"</p>
              <p><strong>✅ Mentalidad de crecimiento:</strong> "¿Cómo puedo mejorar cada video?"</p>
            </div>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">📊 Revisión Mensual del Rendimiento</h3>
            <h4>Proceso de revisión sistemática:</h4>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📈 Análisis cuantitativo (Semana 1 del mes):</strong></p>
              <ul>
                <li>Recopilar métricas de todos los videos del mes</li>
                <li>Calcular promedios y identificar outliers</li>
                <li>Comparar con meses anteriores</li>
                <li>Identificar tendencias de crecimiento/declive</li>
              </ul>
              
              <p><strong>🔍 Análisis cualitativo (Semana 2 del mes):</strong></p>
              <ul>
                <li>Revisar comentarios y feedback de audiencia</li>
                <li>Analizar qué temas generaron más interacción</li>
                <li>Evaluar calidad de engagement (no solo cantidad)</li>
                <li>Identificar patrones en contenido más guardado/compartido</li>
              </ul>
            </div>
            
            <h4>Herramientas para la revisión:</h4>
            <ul>
              <li><strong>Hoja de cálculo:</strong> Para tracking histórico</li>
              <li><strong>Analytics nativos:</strong> Datos detallados por plataforma</li>
              <li><strong>Herramientas externas:</strong> Vista consolidada</li>
              <li><strong>Feedback directo:</strong> Encuestas y polls</li>
            </ul>
            
            <p><strong>Revisar mensualmente el rendimiento de los guiones.</strong></p>
          </div>

          <div style="background-color: #d1ecf1; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0;">🔍 Identificación de Patrones</h3>
            <h4>Patrones a identificar en guiones exitosos:</h4>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📚 Temas que funcionan:</strong></p>
              <ul>
                <li>¿Qué topics generan más engagement?</li>
                <li>¿Hay estacionalidad en ciertos temas?</li>
                <li>¿Qué problemas de tu audiencia resuenan más?</li>
              </ul>
              
              <p><strong>🎭 Tono y estilo:</strong></p>
              <ul>
                <li>¿Formal vs casual? ¿Qué prefiere tu audiencia?</li>
                <li>¿Humor vs serio? ¿En qué contextos funciona cada uno?</li>
                <li>¿Personal vs profesional? ¿Cuál genera más confianza?</li>
              </ul>
              
              <p><strong>🏗️ Estructura narrativa:</strong></p>
              <ul>
                <li>¿Qué tipos de hooks tienen mejor retención?</li>
                <li>¿Cuál es la duración óptima para tu audiencia?</li>
                <li>¿Dónde colocar el CTA para máximo CTR?</li>
              </ul>
            </div>
            
            <h4>Método de análisis de patrones:</h4>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 15px 0;">
              <p><strong>Top 10 videos del mes:</strong><br>
              1. ¿Qué tienen en común?<br>
              2. ¿Qué elementos únicos destacan?<br>
              3. ¿Hay patrones en timing de publicación?<br>
              4. ¿Qué hashtags se repiten?<br>
              5. ¿Qué tipo de CTA utilizan?</p>
              
              <p><strong>Bottom 5 videos del mes:</strong><br>
              1. ¿Qué falló en común?<br>
              2. ¿Hay elementos que evitar?<br>
              3. ¿El timing fue inadecuado?<br>
              4. ¿El hook no funcionó?</p>
            </div>
            
            <p><strong>Identificar patrones en guiones que funcionaron mejor (temas, tono, estructura).</strong></p>
          </div>

          <div style="background-color: #f8d7da; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🚀 Aplicación de Aprendizajes</h3>
            <h4>De insight a acción:</h4>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>📝 Creación de templates:</strong></p>
              <ul>
                <li>Desarrollar templates basados en patrones exitosos</li>
                <li>Crear biblioteca de hooks que funcionan</li>
                <li>Establecer estructura narrativa optimizada</li>
                <li>Definir guidelines de tono y estilo</li>
              </ul>
              
              <p><strong>🎯 Refinamiento de targeting:</strong></p>
              <ul>
                <li>Ajustar buyer persona basado en engagement real</li>
                <li>Identificar subtemas que resuenan más</li>
                <li>Adaptar horarios de publicación</li>
                <li>Optimizar strategy de hashtags</li>
              </ul>
            </div>
            
            <h4>Implementación gradual:</h4>
            <ul>
              <li><strong>20% experimento:</strong> Nuevos elementos/formatos</li>
              <li><strong>80% optimizado:</strong> Aplicar aprendizajes comprobados</li>
              <li><strong>Testing continuo:</strong> Validar cambios con A/B tests</li>
              <li><strong>Documentación:</strong> Registrar resultados de cambios</li>
            </ul>
            
            <p><strong>Aplicar los aprendizajes a la creación de nuevos guiones.</strong></p>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">🆕 Experimentación con Nuevos Formatos</h3>
            <h4>Mantente al día con tendencias:</h4>
            <ul>
              <li><strong>Nuevas features:</strong> Instagram Reels Templates, TikTok Effects</li>
              <li><strong>Formatos emergentes:</strong> Carousel posts, Stories interactivos</li>
              <li><strong>Tendencias de contenido:</strong> Educational, Behind-the-scenes</li>
              <li><strong>Cambios de algoritmo:</strong> Adaptación a nuevas prioridades</li>
            </ul>
            
            <h4>Proceso de experimentación:</h4>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p><strong>Semana 1:</strong> Research de nueva tendencia/formato</p>
              <p><strong>Semana 2:</strong> Crear content piloto adaptado a tu marca</p>
              <p><strong>Semana 3:</strong> Publicar y medir performance inicial</p>
              <p><strong>Semana 4:</strong> Analizar resultados y decidir escalamiento</p>
            </div>
            
            <h4>Criterios para adoptar nuevos formatos:</h4>
            <ul>
              <li><strong>Alineación con brand:</strong> ¿Encaja con tu personalidad?</li>
              <li><strong>Capacidad de ejecución:</strong> ¿Tienes recursos necesarios?</li>
              <li><strong>Potencial de ROI:</strong> ¿Vale la pena la inversión?</li>
              <li><strong>Longevidad:</strong> ¿Es una moda pasajera o tendencia duradera?</li>
            </ul>
            
            <p><strong>Experimentar con nuevos formatos y tendencias.</strong></p>
          </div>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; color: white; margin: 30px 0 20px 0;">
            <h2 style="margin: 0; font-size: 24px;">🎯 Actividad Práctica 5: Plan de contenido mensual con IA</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Crea un calendario estratégico de contenido usando IA y tus aprendizajes</p>
          </div>

          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">📝 Instrucciones del Proyecto</h3>
            
            <p><strong>Tu misión:</strong> Crear un calendario de contenido para 1 mes con 4 pilares temáticos para tu tipo de negocio o marca usando IA como herramienta de apoyo.</p>
            
            <h4>Pasos del proyecto:</h4>
            
            <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h5 style="color: #0056b3; margin-top: 0;">1. Elige un negocio o perfil real (5 min)</h5>
              <ul>
                <li>Define tu nicho específico (ej: coach de productividad)</li>
                <li>Identifica tu audiencia objetivo</li>
                <li>Establece objetivos del mes (awareness, ventas, comunidad)</li>
              </ul>
            </div>

            <div style="background-color: #fff2e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h5 style="color: #d63384; margin-top: 0;">2. Define 4 pilares de contenido (10 min)</h5>
              <p>Ejemplos de pilares:</p>
              <ul>
                <li><strong>Educativo:</strong> Tips y tutoriales</li>
                <li><strong>Inspiracional:</strong> Motivación y casos de éxito</li>
                <li><strong>Behind the scenes:</strong> Proceso y vida personal</li>
                <li><strong>Promocional:</strong> Productos/servicios (máximo 20%)</li>
              </ul>
            </div>

            <div style="background-color: #e7f5e7; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h5 style="color: #198754; margin-top: 0;">3. Usa el prompt para generar el calendario (20 min)</h5>
              <p><strong>Prompt sugerido:</strong></p>
              <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px;">
                "Crea un calendario de contenido para 1 mes con 4 pilares temáticos para [tipo de negocio o marca]. Por cada semana, sugiere un guión corto para TikTok o Reels, con su enfoque, llamado a la acción y hashtags sugeridos. Formato: tabla o lista organizada."
              </div>
            </div>

            <div style="background-color: #f8f0ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h5 style="color: #6f42c1; margin-top: 0;">4. Revisa que cada guión esté optimizado para red social (10 min)</h5>
              <ul>
                <li>Hook fuerte en primeros 3 segundos</li>
                <li>CTA claro y específico</li>
                <li>Hashtags balanceados (viral + nicho + marca)</li>
                <li>Duración apropiada para la plataforma</li>
                <li>Valor entregado en cada post</li>
              </ul>
            </div>
          </div>

          <div style="background-color: #d4edda; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">📋 Template de Calendario Mensual</h3>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 12px; line-height: 1.4;">
              <p><strong>NEGOCIO/MARCA:</strong> _____________________</p>
              <p><strong>MES:</strong> _____________ <strong>OBJETIVO:</strong> _____________</p>
              <br>
              <p><strong>PILARES DE CONTENIDO:</strong></p>
              <p>1. _________________ 2. _________________</p>
              <p>3. _________________ 4. _________________</p>
              <br>
              <p><strong>SEMANA 1:</strong></p>
              <p>Pilar: _____________ Guión: _____________</p>
              <p>Hook: _____________ CTA: _____________</p>
              <p>Hashtags: #___ #___ #___ #___ #___</p>
              <br>
              <p><strong>SEMANA 2:</strong></p>
              <p>Pilar: _____________ Guión: _____________</p>
              <p>Hook: _____________ CTA: _____________</p>
              <p>Hashtags: #___ #___ #___ #___ #___</p>
              <br>
              <p><strong>SEMANA 3:</strong></p>
              <p>Pilar: _____________ Guión: _____________</p>
              <p>Hook: _____________ CTA: _____________</p>
              <p>Hashtags: #___ #___ #___ #___ #___</p>
              <br>
              <p><strong>SEMANA 4:</strong></p>
              <p>Pilar: _____________ Guión: _____________</p>
              <p>Hook: _____________ CTA: _____________</p>
              <p>Hashtags: #___ #___ #___ #___ #___</p>
            </div>
          </div>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 10px; margin-top: 20px; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">🎯 Instrucción específica</h3>
            <p><strong>Mantener un registro de guiones con sus métricas de rendimiento, fecha de publicación y observaciones para ir afinando la estrategia de contenido con IA:</strong></p>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h4>📊 Sistema de seguimiento obligatorio:</h4>
              <ol>
                <li><strong>Revisar mensualmente</strong> el rendimiento de los guiones</li>
                <li><strong>Identificar patrones</strong> en guiones que funcionaron mejor</li>
                <li><strong>Aplicar aprendizajes</strong> a la creación de nuevos guiones</li>
                <li><strong>Experimentar</strong> con nuevos formatos y tendencias</li>
              </ol>
            </div>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 12px; margin: 15px 0;">
              <p><strong>REGISTRO DE PERFORMANCE:</strong></p>
              <p>Fecha | Plataforma | Pilar | Hook | Retención | ER | CTR | Observaciones</p>
              <p>_____|___________|______|______|__________|____|____|_____________</p>
            </div>
            
            <p><strong>Meta:</strong> Después de 3 meses usando este sistema, deberías tener insights claros sobre qué funciona mejor para tu marca específica y cómo la IA puede potenciar tu estrategia de contenido.</p>
          </div>
        `
      }
    });

    console.log('✅ Lecciones del Módulo 5 creadas exitosamente');
    
  } catch (error) {
    console.error('Error creando lecciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGuionesModulo5();