import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TARGET_LESSON_TITLES = [
  // Módulo 1
  '1.1 Introducción al Copywriting Digital',
  '1.2 Estructura de un Guión Efectivo',
  '1.3 Psicología de la Persuasión',
  // Módulo 2
  '2.1 Introducción a ChatGPT para Guiones',
  '2.2 Prompts Efectivos para Guiones',
  '2.3 Claude AI para Refinamiento',
  // Módulo 3
  '3.1 Estructura AIDA para Videos Promocionales',
  '3.2 Hook y Apertura Impactante',
  '3.3 Desarrollo del Beneficio Principal',
  // Módulo 4
  '4.1 Adaptación para Instagram',
  '4.2 Guiones para TikTok',
  '4.3 Contenido para LinkedIn',
  // Módulo 5
  '5.1 A/B Testing de Guiones',
  '5.2 Métricas de Rendimiento',
  '5.3 Optimización Continua',
];

async function normalize() {
  try {
    await prisma.$connect();

    const course = await prisma.course.findUnique({
      where: { slug: 'guiones-videos-promocionales-ia' },
      select: { id: true, title: true },
    });
    if (!course) {
      console.error('❌ Curso no encontrado');
      process.exit(1);
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, order: true },
    });

    const keepSet = new Set(TARGET_LESSON_TITLES);
    const toDelete = lessons.filter((l) => !keepSet.has(l.title));

    console.log(`Curso: ${course.title}`);
    console.log(`Total actual: ${lessons.length}`);
    console.log(`Conservar: ${TARGET_LESSON_TITLES.length}`);
    console.log(`Eliminar: ${toDelete.length}`);

    if (toDelete.length === 0) {
      console.log('No hay lecciones para eliminar.');
      return;
    }

    // Eliminar en orden inverso por seguridad
    for (const l of toDelete.reverse()) {
      await prisma.lesson.delete({ where: { id: l.id } });
      console.log(`🗑️ Eliminada: [${l.order}] ${l.title}`);
    }

    // Reasignar orders 1..15
    const kept = await prisma.lesson.findMany({
      where: { courseId: course.id, title: { in: TARGET_LESSON_TITLES } },
      orderBy: { order: 'asc' },
    });

    // Orden por módulo: ya está en TARGET_LESSON_TITLES
    for (let i = 0; i < TARGET_LESSON_TITLES.length; i++) {
      const title = TARGET_LESSON_TITLES[i];
      const rec = kept.find((k) => k.title === title);
      if (rec) {
        await prisma.lesson.update({ where: { id: rec.id }, data: { order: i + 1 } });
        console.log(`↔️ Reordenada: ${title} -> ${i + 1}`);
      }
    }

    // Actualizar contador de lecciones del curso
    await prisma.course.update({ where: { id: course.id }, data: { lessonsCount: TARGET_LESSON_TITLES.length } });

    console.log('✅ Normalización completada a 15 lecciones.');
  } catch (e) {
    console.error('❌ Error normalizando:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) normalize().then(() => process.exit(0));

export {};
