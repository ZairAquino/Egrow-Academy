import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Base de datos local/desarrollo

/**
 * Script para verificar el curso 'monetiza-voz-ia-elevenlabs' en desarrollo
 * y exportar toda su información para migrar a producción
 */

async function verifyMonetizaVozCourse() {
  try {
    console.log('🔍 VERIFICANDO CURSO EN DESARROLLO...');
    console.log('🌐 Base de datos: Local/Desarrollo');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Buscar el curso por slug
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
      console.log('❌ Curso "monetiza-voz-ia-elevenlabs" NO encontrado en desarrollo');
      
      // Buscar cursos similares
      const similarCourses = await prisma.course.findMany({
        where: {
          OR: [
            { slug: { contains: 'monetiza' } },
            { slug: { contains: 'voz' } },
            { title: { contains: 'voz' } }
          ]
        }
      });
      
      console.log(`\n🔍 Cursos similares encontrados: ${similarCourses.length}`);
      similarCourses.forEach(c => {
        console.log(`   - ${c.title} (slug: ${c.slug})`);
      });
      
      return null;
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ ¡CURSO ENCONTRADO EN DESARROLLO!');
    console.log('📚 Título:', course.title);
    console.log('🔗 Slug:', course.slug);
    console.log('📝 Descripción:', course.description?.substring(0, 100) + '...');
    console.log('💰 Precio:', course.price);
    console.log('⏱️ Duración:', course.duration);
    console.log('📊 Nivel:', course.level);
    console.log('🎯 Categoría ID:', course.categoryId);
    console.log('🖼️ Imagen:', course.imageUrl);
    console.log('🎬 Video intro:', course.introVideoUrl);
    console.log('📖 Total de lecciones:', course.lessons.length);
    
    // Mostrar lecciones
    console.log('\n📖 LECCIONES DEL CURSO:');
    console.log('-'.repeat(50));
    
    if (course.lessons.length === 0) {
      console.log('⚠️ No hay lecciones asociadas al curso');
    } else {
      course.lessons.forEach((lesson, index) => {
        console.log(`${lesson.order}. ${lesson.title}`);
        console.log(`   - Slug: ${lesson.slug}`);
        console.log(`   - Duración: ${lesson.duration} min`);
        console.log(`   - Tipo: ${lesson.type}`);
        console.log(`   - Video: ${lesson.videoUrl || 'No definido'}`);
        console.log(`   - Publicado: ${lesson.isPublished}`);
        console.log('');
      });
    }

    // Preparar datos para migración
    const migrationData = {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        duration: course.duration,
        level: course.level,
        categoryId: course.categoryId,
        imageUrl: course.imageUrl,
        introVideoUrl: course.introVideoUrl,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      },
      lessons: course.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        order: lesson.order,
        type: lesson.type,
        courseId: lesson.courseId,
        isPublished: lesson.isPublished,
        createdAt: lesson.createdAt,
        updatedAt: lesson.updatedAt
      })),
      resources: [] // Sin recursos por el momento
    };

    console.log('\n📊 RESUMEN PARA MIGRACIÓN:');
    console.log(`✅ Curso: 1`);
    console.log(`📖 Lecciones: ${migrationData.lessons.length}`);
    console.log(`📎 Recursos: ${migrationData.resources.length}`);
    
    // Guardar datos de migración
    const fs = require('fs');
    const path = require('path');
    const migrationDir = path.join(process.cwd(), 'migrations');
    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
    }
    
    const migrationFile = path.join(migrationDir, 'monetiza-voz-course-migration.json');
    fs.writeFileSync(migrationFile, JSON.stringify(migrationData, null, 2), 'utf-8');
    
    console.log('\n💾 Datos de migración guardados en:');
    console.log(`📁 ${migrationFile}`);
    console.log('\n✅ Verificación completada. El curso está listo para migrar a producción.');
    
    return migrationData;

  } catch (error) {
    console.error('❌ Error verificando curso en desarrollo:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyMonetizaVozCourse()
  .then((data) => {
    if (data) {
      console.log('\n🏁 Curso verificado y listo para migración');
    } else {
      console.log('\n❌ Curso no encontrado - revisar desarrollo');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });