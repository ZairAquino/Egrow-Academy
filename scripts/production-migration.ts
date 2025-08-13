import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Función para crear backup de producción
async function createProductionBackup() {
  // Cargar variables de entorno de producción
  dotenv.config({ path: '.env.production' });
  
  const prodDatabaseUrl = process.env.DATABASE_URL;
  if (!prodDatabaseUrl) {
    throw new Error('DATABASE_URL de producción no encontrada en .env.production');
  }
  
  console.log('🔄 Conectando a base de datos de producción...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDatabaseUrl
      }
    }
  });
  
  try {
    // Verificar conexión
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión a producción establecida');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = path.join(process.cwd(), 'backups', 'production');
    
    // Crear directorio si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log('🔄 Creando backup de base de datos de producción...');
    
    // Obtener todos los datos críticos
    const [courses, users, webinars, events, lessons, enrollments, userStreaks, webinarRegistrations] = await Promise.all([
      prisma.course.findMany({
        include: {
          lessons: true,
          enrollments: true,
          ratings: true,
          comments: true
        }
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          membershipLevel: true,
          isActive: true,
          createdAt: true,
          hasBeenPremium: true,
          country: true
        }
      }),
      prisma.webinar.findMany({
        include: {
          registrations: true
        }
      }),
      prisma.event.findMany({
        include: {
          registrations: true
        }
      }),
      prisma.lesson.findMany(),
      prisma.enrollment.findMany(),
      prisma.userStreak.findMany(),
      prisma.webinarRegistration.findMany()
    ]);
    
    const backup = {
      timestamp,
      environment: 'production',
      database: 'egrow-academy-production',
      stats: {
        courses: courses.length,
        users: users.length,
        webinars: webinars.length,
        events: events.length,
        lessons: lessons.length,
        enrollments: enrollments.length,
        userStreaks: userStreaks.length,
        webinarRegistrations: webinarRegistrations.length
      },
      data: {
        courses,
        users,
        webinars,
        events,
        lessons,
        enrollments,
        userStreaks,
        webinarRegistrations
      }
    };
    
    // Guardar backup
    const backupFile = path.join(backupDir, `production-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`✅ Backup de producción guardado en: ${backupFile}`);
    console.log('📊 Estadísticas del backup de producción:');
    console.log(`  - Cursos: ${courses.length}`);
    console.log(`  - Usuarios: ${users.length}`);
    console.log(`  - Webinars: ${webinars.length}`);
    console.log(`  - Eventos: ${events.length}`);
    console.log(`  - Lecciones: ${lessons.length}`);
    console.log(`  - Inscripciones: ${enrollments.length}`);
    console.log(`  - Rachas de usuarios: ${userStreaks.length}`);
    console.log(`  - Registros de webinars: ${webinarRegistrations.length}`);
    
    return { backupFile, stats: backup.stats };
    
  } catch (error) {
    console.error('❌ Error creando backup de producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para aplicar migración a producción
async function applyProductionMigration() {
  // Cargar variables de entorno de producción
  dotenv.config({ path: '.env.production' });
  
  const prodDatabaseUrl = process.env.DATABASE_URL;
  if (!prodDatabaseUrl) {
    throw new Error('DATABASE_URL de producción no encontrada');
  }
  
  console.log('🔄 Aplicando migración a base de datos de producción...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDatabaseUrl
      }
    }
  });
  
  try {
    // Verificar conexión
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión a producción establecida para migración');
    
    // Verificar si el campo meta ya existe
    try {
      await prisma.$queryRaw`SELECT meta FROM courses LIMIT 1`;
      console.log('⚠️ El campo meta ya existe en producción');
      return { alreadyExists: true };
    } catch (error) {
      console.log('🔄 Campo meta no existe, procediendo con la migración...');
    }
    
    // Aplicar migración - agregar campo meta
    console.log('🔄 Agregando campo meta a la tabla courses...');
    await prisma.$executeRaw`ALTER TABLE courses ADD COLUMN meta JSONB`;
    
    console.log('✅ Campo meta agregado exitosamente a producción');
    
    // Verificar que el campo se agregó correctamente
    const testResult = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'meta'`;
    console.log('✅ Verificación del campo meta:', testResult);
    
    return { success: true, testResult };
    
  } catch (error) {
    console.error('❌ Error aplicando migración a producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para verificar migración
async function verifyProductionMigration() {
  dotenv.config({ path: '.env.production' });
  
  const prodDatabaseUrl = process.env.DATABASE_URL;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDatabaseUrl
      }
    }
  });
  
  try {
    console.log('🔍 Verificando migración en producción...');
    
    // Crear curso de prueba con campo meta
    const testSlug = `test-prod-meta-${Date.now()}`;
    
    const testCourse = await prisma.course.create({
      data: {
        title: 'Test Producción Meta',
        slug: testSlug,
        description: 'Curso de prueba para verificar campo meta en producción',
        price: 0,
        status: 'DRAFT',
        category: 'HABILIDADES_IRREMPLAZABLES',
        meta: {
          templateId: 'course-v1',
          templateVersion: 1,
          pageDataV1: {
            title: 'Test Meta Production',
            description: 'Descripción de prueba',
            modules: [
              {
                title: 'Módulo de Prueba Producción',
                description: 'Descripción del módulo',
                lessons: [
                  {
                    title: 'Lección 1 Producción',
                    duration: 10
                  }
                ]
              }
            ],
            instructor: {
              name: 'Test Instructor Prod',
              title: 'Instructor de Prueba Producción'
            },
            testimonials: [],
            tools: ['Test Tool Prod'],
            prerequisites: ['Conocimientos básicos prod'],
            learningGoals: ['Objetivo 1 prod', 'Objetivo 2 prod']
          }
        }
      }
    });
    
    console.log('✅ Curso de prueba creado en producción:', testCourse.id);
    
    // Verificar que podemos leer el campo meta
    const retrievedCourse = await prisma.course.findUnique({
      where: { id: testCourse.id },
      select: {
        id: true,
        title: true,
        slug: true,
        meta: true
      }
    });
    
    if (retrievedCourse?.meta) {
      console.log('✅ Campo meta leído exitosamente en producción');
      const meta = retrievedCourse.meta as any;
      console.log('📊 Contenido del meta en producción:');
      console.log('  - Template ID:', meta.templateId);
      console.log('  - Título en pageDataV1:', meta.pageDataV1?.title);
      console.log('  - Módulos:', meta.pageDataV1?.modules?.length || 0);
    } else {
      throw new Error('No se pudo leer el campo meta en producción');
    }
    
    // Limpiar - eliminar curso de prueba
    await prisma.course.delete({
      where: { id: testCourse.id }
    });
    console.log('🗑️ Curso de prueba eliminado de producción');
    
    console.log('✅ Migración verificada exitosamente en producción');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error verificando migración en producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'backup':
        const backupResult = await createProductionBackup();
        console.log('\n🎉 Backup de producción completado exitosamente');
        console.log(`📁 Archivo: ${backupResult.backupFile}`);
        break;
        
      case 'migrate':
        const migrateResult = await applyProductionMigration();
        if (migrateResult.alreadyExists) {
          console.log('\n⚠️ El campo meta ya existe en producción');
        } else {
          console.log('\n🎉 Migración aplicada exitosamente a producción');
        }
        break;
        
      case 'verify':
        await verifyProductionMigration();
        console.log('\n🎉 Verificación de producción completada exitosamente');
        break;
        
      case 'full':
        console.log('🚀 Ejecutando proceso completo: backup + migración + verificación');
        
        // 1. Backup
        console.log('\n=== PASO 1: BACKUP ===');
        const fullBackupResult = await createProductionBackup();
        
        // 2. Migración
        console.log('\n=== PASO 2: MIGRACIÓN ===');
        const fullMigrateResult = await applyProductionMigration();
        
        // 3. Verificación
        console.log('\n=== PASO 3: VERIFICACIÓN ===');
        await verifyProductionMigration();
        
        console.log('\n🎊 PROCESO COMPLETO EXITOSO 🎊');
        console.log(`📁 Backup: ${fullBackupResult.backupFile}`);
        console.log('✅ Migración aplicada y verificada en producción');
        break;
        
      default:
        console.log('Uso: tsx scripts/production-migration.ts [backup|migrate|verify|full]');
        console.log('  backup  - Crear backup de producción');
        console.log('  migrate - Aplicar migración a producción');
        console.log('  verify  - Verificar migración en producción');
        console.log('  full    - Ejecutar todo el proceso');
        process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Error en el proceso:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}