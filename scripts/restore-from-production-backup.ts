import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreFromDevelopmentBackup() {
  try {
    console.log('🔄 Iniciando restauración desde backup de desarrollo...');
    
    // Leer el backup de desarrollo más reciente
    const backupPath = path.join(process.cwd(), 'backups', 'egrow-academy-desarrollo-2025-08-02T18-54-05.json');
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    
    console.log(`📅 Backup encontrado: ${backupData.timestamp}`);
    console.log(`🌍 Ambiente: ${backupData.environment}`);
    
    // Limpiar solo las tablas principales que sabemos que existen
    console.log('🧹 Limpiando tablas existentes...');
    
    const tablesToClean = [
      'Enrollment',
      'Lesson',
      'Course',
      'Resource'
    ];
    
    for (const table of tablesToClean) {
      try {
        await prisma.$executeRaw`DELETE FROM "${table}"`;
        console.log(`✅ Limpiada tabla: ${table}`);
      } catch (error) {
        console.log(`⚠️ Error limpiando ${table}:`, error);
      }
    }
    
    // Restaurar datos de usuarios
    console.log('👥 Restaurando usuarios...');
    for (const user of backupData.tables.users) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            profileImage: user.profileImage,
            bio: user.bio,
            membershipLevel: user.membershipLevel,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
            verificationCode: user.verificationCode,
            stripeCustomerId: user.stripeCustomerId,
            verificationCodeExpires: user.verificationCodeExpires ? new Date(user.verificationCodeExpires) : null,
            country: user.country,
            hasBeenPremium: user.hasBeenPremium
          }
        });
      } catch (error) {
        console.log(`⚠️ Error creando usuario ${user.email}:`, error);
      }
    }
    console.log(`✅ Restaurados usuarios`);
    
    // Restaurar cursos
    if (backupData.tables.courses) {
      console.log('📚 Restaurando cursos...');
      for (const course of backupData.tables.courses) {
        try {
          await prisma.course.create({
            data: {
              id: course.id,
              title: course.title,
              slug: course.slug,
              description: course.description,
              shortDescription: course.shortDescription,
              imageUrl: course.imageUrl,
              price: course.price,
              isFree: course.isFree,
              requiresAuth: course.requiresAuth,
              difficulty: course.difficulty,
              durationHours: course.durationHours,
              lessonsCount: course.lessonsCount,
              studentsCount: course.studentsCount,
              rating: course.rating,
              status: course.status,
              createdAt: new Date(course.createdAt),
              updatedAt: new Date(course.updatedAt),
              instructorId: course.instructorId,
              category: course.category
            }
          });
        } catch (error) {
          console.log(`⚠️ Error creando curso ${course.title}:`, error);
        }
      }
      console.log(`✅ Restaurados cursos`);
    }
    
    // Restaurar lecciones
    if (backupData.tables.lessons) {
      console.log('📖 Restaurando lecciones...');
      for (const lesson of backupData.tables.lessons) {
        try {
          await prisma.lesson.create({
            data: {
              id: lesson.id,
              title: lesson.title,
              content: lesson.content,
              videoUrl: lesson.videoUrl,
              duration: lesson.duration,
              order: lesson.order,
              createdAt: new Date(lesson.createdAt),
              updatedAt: new Date(lesson.updatedAt),
              courseId: lesson.courseId
            }
          });
        } catch (error) {
          console.log(`⚠️ Error creando lección ${lesson.title}:`, error);
        }
      }
      console.log(`✅ Restauradas lecciones`);
    }
    
    // Restaurar inscripciones
    if (backupData.tables.enrollments) {
      console.log('📝 Restaurando inscripciones...');
      for (const enrollment of backupData.tables.enrollments) {
        try {
          await prisma.enrollment.create({
            data: {
              id: enrollment.id,
              enrolledAt: new Date(enrollment.enrolledAt),
              completedAt: enrollment.completedAt ? new Date(enrollment.completedAt) : null,
              progressPercentage: enrollment.progressPercentage,
              status: enrollment.status,
              userId: enrollment.userId,
              courseId: enrollment.courseId
            }
          });
        } catch (error) {
          console.log(`⚠️ Error creando inscripción:`, error);
        }
      }
      console.log(`✅ Restauradas inscripciones`);
    }
    
    // Restaurar recursos
    if (backupData.tables.resources) {
      console.log('📁 Restaurando recursos...');
      for (const resource of backupData.tables.resources) {
        try {
          await prisma.resource.create({
            data: {
              id: resource.id,
              title: resource.title,
              slug: resource.slug,
              description: resource.description,
              shortDescription: resource.shortDescription,
              imageUrl: resource.imageUrl,
              category: resource.category,
              type: resource.type,
              author: resource.author,
              fileUrl: resource.fileUrl,
              requiresAuth: resource.requiresAuth,
              isFree: resource.isFree,
              rating: resource.rating,
              downloadsCount: resource.downloadsCount,
              status: resource.status,
              createdAt: new Date(resource.createdAt),
              updatedAt: new Date(resource.updatedAt)
            }
          });
        } catch (error) {
          console.log(`⚠️ Error creando recurso ${resource.title}:`, error);
        }
      }
      console.log(`✅ Restaurados recursos`);
    }
    
    console.log('✅ Restauración completada exitosamente');
    console.log('📊 Resumen de datos restaurados:');
    console.log(`   👥 Usuarios: ${backupData.tables.users.length}`);
    if (backupData.tables.courses) console.log(`   📚 Cursos: ${backupData.tables.courses.length}`);
    if (backupData.tables.lessons) console.log(`   📖 Lecciones: ${backupData.tables.lessons.length}`);
    if (backupData.tables.enrollments) console.log(`   📝 Inscripciones: ${backupData.tables.enrollments.length}`);
    if (backupData.tables.resources) console.log(`   📁 Recursos: ${backupData.tables.resources.length}`);
    
  } catch (error) {
    console.error('❌ Error durante la restauración:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreFromDevelopmentBackup(); 