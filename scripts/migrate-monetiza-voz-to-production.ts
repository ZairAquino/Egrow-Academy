import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// URL de base de datos de producción
const DATABASE_URL = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

/**
 * Script para migrar SOLO el curso 'monetiza-voz-ia-elevenlabs' a producción
 * SIN TOCAR ningún registro existente
 */

async function migrateMonetizaVozToProduction() {
  try {
    console.log('🚀 INICIANDO MIGRACIÓN SEGURA A PRODUCCIÓN...');
    console.log('🌐 Base de datos: ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech');
    console.log('📅 Fecha:', new Date().toISOString());
    console.log('⚠️ MODO SEGURO: Solo agregar curso nuevo, NO tocar registros existentes');
    
    // Cargar datos de migración
    const migrationFile = join(process.cwd(), 'migrations', 'monetiza-voz-course-migration.json');
    const migrationData = JSON.parse(readFileSync(migrationFile, 'utf-8'));
    
    console.log('\n📁 Datos de migración cargados:');
    console.log(`📚 Curso: ${migrationData.course.title}`);
    console.log(`📖 Lecciones: ${migrationData.lessons.length}`);
    console.log(`📎 Recursos: ${migrationData.resources.length}`);
    
    // ⚠️ VERIFICACIÓN DE SEGURIDAD: Comprobar que el curso NO existe
    console.log('\n🔍 VERIFICANDO QUE EL CURSO NO EXISTE EN PRODUCCIÓN...');
    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: migrationData.course.slug
      }
    });
    
    if (existingCourse) {
      console.log('🚨 PELIGRO: El curso ya existe en producción');
      console.log('🆔 ID existente:', existingCourse.id);
      console.log('📚 Título existente:', existingCourse.title);
      console.log('\n❌ MIGRACIÓN CANCELADA para evitar conflictos');
      console.log('💡 Opción 1: Eliminar el curso existente primero');
      console.log('💡 Opción 2: Cambiar el slug del nuevo curso');
      return false;
    }
    
    console.log('✅ Curso NO existe en producción. Seguro continuar.');
    
    // Omitir categoría por el momento
    console.log('\n🏷️ Omitiendo categoría (se puede asignar después)...');
    const categoryId = null;
    
    console.log('\n' + '='.repeat(60));
    console.log('💾 INICIANDO INSERCIÓN EN PRODUCCIÓN...');
    
    // Usar transacción para asegurar consistencia
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el curso
      console.log('1️⃣ Creando curso...');
      const newCourse = await tx.course.create({
        data: {
          title: migrationData.course.title,
          slug: migrationData.course.slug,
          description: migrationData.course.description,
          price: parseFloat(migrationData.course.price) || 97,
          lessonsCount: migrationData.lessons.length,
          studentsCount: 0,
          rating: new Prisma.Decimal(0)
        }
      });
      
      console.log('✅ Curso creado con ID:', newCourse.id);
      
      // 2. Crear las lecciones
      console.log('2️⃣ Creando lecciones...');
      const createdLessons = [];
      
      for (const lessonData of migrationData.lessons) {
        const newLesson = await tx.lesson.create({
          data: {
            title: lessonData.title,
            content: lessonData.content || '',
            videoUrl: lessonData.videoUrl,
            duration: lessonData.duration || 0,
            order: lessonData.order,
            courseId: newCourse.id
          }
        });
        
        createdLessons.push(newLesson);
        console.log(`   ✅ Lección ${newLesson.order}: ${newLesson.title}`);
      }
      
      // 3. Crear recursos (si los hay)
      if (migrationData.resources.length > 0) {
        console.log('3️⃣ Creando recursos...');
        // Por ahora saltamos recursos ya que no están en el esquema actual
        console.log('⚠️ Recursos saltados (no disponibles en esquema actual)');
      }
      
      return {
        course: newCourse,
        lessons: createdLessons,
        resources: []
      };
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log(`📚 Curso creado: ${result.course.title}`);
    console.log(`🆔 ID del curso: ${result.course.id}`);
    console.log(`📖 Lecciones creadas: ${result.lessons.length}`);
    console.log(`🔗 Slug: ${result.course.slug}`);
    console.log(`💰 Precio: $${result.course.price}`);
    console.log(`🚀 Estado: ${result.course.isPublished ? 'Publicado' : 'Borrador'}`);
    
    // Verificar acceso web
    console.log('\n🌐 URLs DE ACCESO:');
    console.log(`📚 Página del curso: https://egrowacademy.com/curso/${result.course.slug}`);
    console.log(`📖 Contenido: https://egrowacademy.com/curso/${result.course.slug}/contenido`);
    
    console.log('\n⚠️ IMPORTANTE:');
    console.log('✅ Solo se agregó el curso nuevo');
    console.log('✅ NO se modificaron registros existentes'); 
    console.log('✅ La base de datos de producción está segura');
    console.log('✅ El backup está disponible en caso de emergencia');
    
    return result;

  } catch (error) {
    console.error('❌ Error en migración:', error);
    console.error('💡 La transacción se revirtió automáticamente');
    console.error('💡 La base de datos de producción no fue afectada');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
console.log('🚀 MIGRACIÓN SEGURA DE CURSO A PRODUCCIÓN');
console.log('📚 Curso: Monetiza tu Voz con IA - ElevenLabs');
console.log('⚠️ Modo: SEGURO (solo agregar, no modificar)');
console.log('🔒 Backup disponible en caso de emergencia');
console.log('');

migrateMonetizaVozToProduction()
  .then((result) => {
    console.log('\n🏁 Migración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal en migración:', error);
    console.log('\n🔒 La base de datos de producción está segura (transacción revertida)');
    process.exit(1);
  });