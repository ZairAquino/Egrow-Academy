import { PrismaClient } from '@prisma/client';
import fs from 'fs';

// Fuente: backup JSON
const BACKUP_PATH = process.argv[2] || 'backups/production-backup-2025-08-07T20-12-32-294Z/production-backup.json';

// Destino: BD de desarrollo
const devDatabaseUrl = process.env.DATABASE_URL_DEV || undefined;

if (devDatabaseUrl) {
  process.env.DATABASE_URL = devDatabaseUrl;
}

const prisma = new PrismaClient();

async function sync() {
  const raw = fs.readFileSync(BACKUP_PATH, 'utf-8');
  const data = JSON.parse(raw);

  try {
    await prisma.$connect();

    // Limpiar destino en orden seguro (FK)
    await prisma.lessonProgress.deleteMany({});
    await prisma.courseProgress.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.course.deleteMany({});

    // Insertar cursos
    for (const c of data.courses) {
      await prisma.course.create({ data: { ...c } });
    }

    // Insertar lecciones
    for (const l of data.lessons) {
      await prisma.lesson.create({ data: { ...l } });
    }

    // Insertar enrollments + progress + lessonProgress
    for (const e of data.enrollments) {
      await prisma.enrollment.create({
        data: {
          id: e.id,
          enrolledAt: e.enrolledAt,
          completedAt: e.completedAt,
          progressPercentage: e.progressPercentage,
          status: e.status,
          userId: e.userId,
          courseId: e.courseId,
        },
      });

      if (e.progress) {
        await prisma.courseProgress.create({
          data: {
            id: e.progress.id,
            enrollmentId: e.id,
            currentLesson: e.progress.currentLesson,
            completedLessons: e.progress.completedLessons,
            progressPercentage: e.progress.progressPercentage,
            lastAccessed: e.progress.lastAccessed,
            startedAt: e.progress.startedAt,
            completedAt: e.progress.completedAt,
            totalTimeSpent: e.progress.totalTimeSpent,
            totalSessions: e.progress.totalSessions,
            averageSessionTime: e.progress.averageSessionTime,
            longestSession: e.progress.longestSession,
            status: e.progress.status,
            courseSpecificData: e.progress.courseSpecificData,
          },
        });

        for (const lp of e.progress.lessonProgress) {
          await prisma.lessonProgress.create({
            data: {
              id: lp.id,
              courseProgressId: e.progress.id,
              lessonNumber: lp.lessonNumber,
              lessonTitle: lp.lessonTitle,
              isCompleted: lp.isCompleted,
              completedAt: lp.completedAt,
              timeSpent: lp.timeSpent,
              firstAccessed: lp.firstAccessed,
              lastAccessed: lp.lastAccessed,
              accessCount: lp.accessCount,
              completionAttempts: lp.completionAttempts,
              userNotes: lp.userNotes,
              lessonSpecificData: lp.lessonSpecificData,
            },
          });
        }
      }
    }

    console.log('✅ Sincronización prod → dev completada');
  } catch (e) {
    console.error('❌ Error sincronizando:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) sync().then(() => process.exit(0));

export {};
