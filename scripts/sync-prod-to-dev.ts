import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const BACKUP_PATH = process.argv[2] || '';
const devDatabaseUrl = process.env.DATABASE_URL_DEV || undefined;
if (devDatabaseUrl) process.env.DATABASE_URL = devDatabaseUrl;

const prisma = new PrismaClient();

async function sync() {
  const raw = fs.readFileSync(BACKUP_PATH, 'utf-8');
  const data = JSON.parse(raw);

  try {
    await prisma.$connect();

    // Limpieza total de destino en orden seguro (FKs)
    await prisma.lessonProgress.deleteMany({});
    await prisma.courseProgress.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.user.deleteMany({});

    // Restaurar usuarios primero
    if (Array.isArray(data.users)) {
      for (const u of data.users) {
        await prisma.user.create({
          data: {
            id: u.id,
            email: u.email,
            passwordHash: u.passwordHash || null,
            firstName: u.firstName || 'Usuario',
            lastName: u.lastName || 'Prod',
            username: u.username || null,
            profileImage: u.profileImage || null,
            bio: u.bio || null,
            membershipLevel: u.membershipLevel || 'FREE',
            isActive: u.isActive ?? true,
            emailVerified: u.emailVerified ?? false,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            lastLogin: u.lastLogin || null,
            verificationCode: u.verificationCode || null,
            stripeCustomerId: u.stripeCustomerId || null,
            verificationCodeExpires: u.verificationCodeExpires || null,
            country: u.country || null,
            hasBeenPremium: u.hasBeenPremium ?? false,
          },
        });
      }
    }

    // Cursos
    for (const c of data.courses) {
      await prisma.course.create({ data: { ...c } });
    }

    // Lecciones
    for (const l of data.lessons) {
      await prisma.lesson.create({ data: { ...l } });
    }

    // Enrollments + Progress + LessonProgress
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

    console.log('✅ Sincronización prod → dev completada (wipe & restore exacto)');
  } catch (e) {
    console.error('❌ Error sincronizando:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) sync().then(() => process.exit(0));

export {};
