import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backupCourseData(slug: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = path.join('backups', `safe-sync-backup-${timestamp}`);
  fs.mkdirSync(outDir, { recursive: true });

  try {
    await prisma.$connect();

    const course = await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        lessonsCount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!course) {
      console.error(`❌ Curso no encontrado: ${slug}`);
      return;
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
    });

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: { progress: { include: { lessonProgress: true } }, user: { select: { id: true, email: true } } },
      orderBy: { enrolledAt: 'asc' },
    });

    const payload = {
      meta: {
        createdAt: new Date().toISOString(),
        databaseUrlHash: (process.env.DATABASE_URL || 'env-missing').slice(0, 16) + '...',
        courseSlug: slug,
      },
      course,
      lessons,
      enrollments,
    };

    const file = path.join(outDir, `${slug}-backup.json`);
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`✅ Backup guardado en: ${file}`);
  } catch (error) {
    console.error('❌ Error realizando backup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  const slug = process.argv[2] || 'guiones-videos-promocionales-ia';
  backupCourseData(slug).then(() => process.exit(0));
}

export {};
