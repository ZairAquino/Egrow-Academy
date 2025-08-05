import { PrismaClient } from '@prisma/client';

async function safeMigration() {
  console.log('🔄 Iniciando migración segura a producción...');

  try {
    // Conectar a producción
    console.log('🔌 Conectando a la base de datos de producción...');
    const prodPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.PROD_DATABASE_URL
        }
      }
    });

    await prodPrisma.$connect();
    console.log('✅ Conexión exitosa a producción\n');

    // Verificar estado ANTES de la migración
    console.log('📊 Verificando estado ANTES de la migración:');
    const beforeMigration = {
      users: await prodPrisma.user.count(),
      courses: await prodPrisma.course.count(),
      lessons: await prodPrisma.lesson.count(),
      enrollments: await prodPrisma.enrollment.count(),
      courseProgress: await prodPrisma.courseProgress.count(),
      lessonProgress: await prodPrisma.lessonProgress.count(),
      resources: await prodPrisma.resource.count(),
      promotions: await prodPrisma.promotion.count()
    };

    console.log(`Usuarios: ${beforeMigration.users}`);
    console.log(`Cursos: ${beforeMigration.courses}`);
    console.log(`Lecciones: ${beforeMigration.lessons}`);
    console.log(`Inscripciones: ${beforeMigration.enrollments}`);
    console.log(`Progreso de cursos: ${beforeMigration.courseProgress}`);
    console.log(`Progreso de lecciones: ${beforeMigration.lessonProgress}`);
    console.log(`Recursos: ${beforeMigration.resources}`);
    console.log(`Promociones: ${beforeMigration.promotions}`);

    // Verificar si las tablas de webinars ya existen
    console.log('\n🔍 Verificando tablas de webinars...');
    try {
      await prodPrisma.webinar.count();
      console.log('✅ Tabla de webinars ya existe');
    } catch (error) {
      console.log('⚠️ Tabla de webinars no existe, necesitamos migrar');
    }

    try {
      await prodPrisma.webinarRegistration.count();
      console.log('✅ Tabla de registros de webinars ya existe');
    } catch (error) {
      console.log('⚠️ Tabla de registros de webinars no existe, necesitamos migrar');
    }

    console.log('\n🚀 Ejecutando migraciones...');
    
    // Ejecutar migraciones
    const { execSync } = require('child_process');
    
    try {
      console.log('📦 Ejecutando: npx prisma migrate deploy');
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.PROD_DATABASE_URL }
      });
      console.log('✅ Migraciones ejecutadas exitosamente');
    } catch (error) {
      console.error('❌ Error ejecutando migraciones:', error);
      throw error;
    }

    // Verificar estado DESPUÉS de la migración
    console.log('\n📊 Verificando estado DESPUÉS de la migración:');
    const afterMigration = {
      users: await prodPrisma.user.count(),
      courses: await prodPrisma.course.count(),
      lessons: await prodPrisma.lesson.count(),
      enrollments: await prodPrisma.enrollment.count(),
      courseProgress: await prodPrisma.courseProgress.count(),
      lessonProgress: await prodPrisma.lessonProgress.count(),
      resources: await prodPrisma.resource.count(),
      promotions: await prodPrisma.promotion.count()
    };

    console.log(`Usuarios: ${afterMigration.users}`);
    console.log(`Cursos: ${afterMigration.courses}`);
    console.log(`Lecciones: ${afterMigration.lessons}`);
    console.log(`Inscripciones: ${afterMigration.enrollments}`);
    console.log(`Progreso de cursos: ${afterMigration.courseProgress}`);
    console.log(`Progreso de lecciones: ${afterMigration.lessonProgress}`);
    console.log(`Recursos: ${afterMigration.resources}`);
    console.log(`Promociones: ${afterMigration.promotions}`);

    // Verificar si las tablas de webinars ahora existen
    console.log('\n🔍 Verificando tablas de webinars después de migración...');
    try {
      const webinarCount = await prodPrisma.webinar.count();
      console.log(`✅ Tabla de webinars existe con ${webinarCount} registros`);
    } catch (error) {
      console.log('❌ Tabla de webinars aún no existe');
    }

    try {
      const registrationCount = await prodPrisma.webinarRegistration.count();
      console.log(`✅ Tabla de registros de webinars existe con ${registrationCount} registros`);
    } catch (error) {
      console.log('❌ Tabla de registros de webinars aún no existe');
    }

    // Comparar registros
    console.log('\n📈 Comparación de registros:');
    const comparison = {
      users: afterMigration.users - beforeMigration.users,
      courses: afterMigration.courses - beforeMigration.courses,
      lessons: afterMigration.lessons - beforeMigration.lessons,
      enrollments: afterMigration.enrollments - beforeMigration.enrollments,
      courseProgress: afterMigration.courseProgress - beforeMigration.courseProgress,
      lessonProgress: afterMigration.lessonProgress - beforeMigration.lessonProgress,
      resources: afterMigration.resources - beforeMigration.resources,
      promotions: afterMigration.promotions - beforeMigration.promotions
    };

    let hasChanges = false;
    Object.entries(comparison).forEach(([table, difference]) => {
      if (difference !== 0) {
        console.log(`⚠️ ${table}: ${difference > 0 ? '+' : ''}${difference} registros`);
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      console.log('✅ No se perdieron registros durante la migración');
    } else {
      console.log('⚠️ Se detectaron cambios en los registros');
    }

    await prodPrisma.$disconnect();
    console.log('\n🎉 Migración segura completada');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    console.log('\n💡 Si se perdieron registros, puedes restaurar desde el backup:');
    console.log('1. Usar el archivo: prod-safe-backup-2025-08-05T20-18-31-080Z.json');
    console.log('2. Ejecutar un script de restauración');
  }
}

safeMigration().catch(console.error); 