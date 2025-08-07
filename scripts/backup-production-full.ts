import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backupAll() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join('backups', `production-backup-${timestamp}`);
  fs.mkdirSync(outDir, { recursive: true });

  try {
    await prisma.$connect();

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'asc' },
    });

    const lessons = await prisma.lesson.findMany({
      orderBy: [{ courseId: 'asc' }, { order: 'asc' }],
    });

    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            membershipLevel: true,
            isActive: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        progress: { include: { lessonProgress: true } },
      },
      orderBy: { enrolledAt: 'asc' },
    });

    // Extraer usuarios únicos
    const userMap = new Map<string, any>();
    for (const e of enrollments) {
      if (e.user) userMap.set(e.user.id, e.user);
    }
    const users = Array.from(userMap.values());

    const payload = {
      meta: {
        createdAt: new Date().toISOString(),
        databaseUrlHash: (process.env.DATABASE_URL || 'env-missing').slice(0, 16) + '...',
        tables: ['courses', 'lessons', 'users', 'enrollments', 'course_progress', 'lesson_progress'],
      },
      courses,
      lessons,
      users,
      enrollments,
    };

    const file = path.join(outDir, 'production-backup.json');
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`✅ Backup completo guardado en: ${file}`);
  } catch (error) {
    console.error('❌ Error realizando backup completo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) backupAll().then(() => process.exit(0));

export {};
