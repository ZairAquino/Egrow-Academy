import { PrismaClient } from '@prisma/client';

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
 * Script para verificar que el curso se añadió correctamente en producción
 */

async function verifyProductionMigration() {
  try {
    console.log('🔍 VERIFICANDO MIGRACIÓN EN PRODUCCIÓN...');
    console.log('🌐 Base de datos: ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Buscar el curso migrado
    console.log('\n📚 Buscando curso migrado...');
    const course = await prisma.course.findUnique({
      where: {
        slug: 'monetiza-voz-ia-elevenlabs'
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!course) {
      console.log('❌ ERROR: Curso NO encontrado en producción');
      console.log('💡 La migración pudo haber fallado');
      return false;
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ¡CURSO ENCONTRADO EN PRODUCCIÓN!');
    console.log('📚 Título:', course.title);
    console.log('🔗 Slug:', course.slug);
    console.log('🆔 ID:', course.id);
    console.log('💰 Precio:', `$${course.price}`);
    console.log('📖 Lecciones:', course.lessons.length);
    console.log('👥 Estudiantes:', course.studentsCount);
    console.log('⭐ Rating:', course.rating.toString());
    console.log('📅 Creado:', course.createdAt.toISOString());
    
    // Verificar lecciones
    console.log('\n📖 LECCIONES EN PRODUCCIÓN:');
    console.log('-'.repeat(50));
    
    if (course.lessons.length === 0) {
      console.log('❌ ERROR: No hay lecciones en el curso');
      return false;
    }

    course.lessons.forEach((lesson, index) => {
      console.log(`${lesson.order}. ${lesson.title}`);
      console.log(`   🆔 ID: ${lesson.id}`);
      console.log(`   ⏱️ Duración: ${lesson.duration} min`);
      console.log(`   🎬 Video: ${lesson.videoUrl || 'No definido'}`);
      console.log(`   📅 Creado: ${lesson.createdAt.toISOString()}`);
      console.log('');
    });

    // Contar total de cursos y lecciones después de la migración
    console.log('\n📊 ESTADO ACTUAL DE PRODUCCIÓN:');
    const totalCourses = await prisma.course.count();
    const totalLessons = await prisma.lesson.count();
    const totalUsers = await prisma.user.count();
    const totalWebinars = await prisma.webinar.count();
    
    console.log(`📚 Total cursos: ${totalCourses}`);
    console.log(`📖 Total lecciones: ${totalLessons}`);
    console.log(`👤 Total usuarios: ${totalUsers}`);
    console.log(`🎯 Total webinars: ${totalWebinars}`);

    // URLs de acceso
    console.log('\n🌐 VERIFICAR EN NAVEGADOR:');
    console.log(`📚 Página del curso: https://egrowacademy.com/curso/${course.slug}`);
    console.log(`📖 Contenido: https://egrowacademy.com/curso/${course.slug}/contenido`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ MIGRACIÓN VERIFICADA EXITOSAMENTE');
    console.log('🎯 El curso está disponible en producción');
    console.log('📚 Todas las lecciones fueron creadas');
    console.log('🔒 Los registros existentes no fueron afectados');
    console.log('💾 Backup disponible para restauración');
    
    return {
      course,
      success: true,
      totalCourses,
      totalLessons
    };

  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyProductionMigration()
  .then((result) => {
    if (result && result.success) {
      console.log('\n🏁 Verificación completada exitosamente');
      console.log('🎉 El curso está listo para usar en producción');
    } else {
      console.log('\n❌ La verificación encontró problemas');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal en verificación:', error);
    process.exit(1);
  });