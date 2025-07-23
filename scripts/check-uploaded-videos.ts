#!/usr/bin/env tsx

/**
 * Script para verificar videos subidos en la base de datos
 */

import { prisma } from '../src/lib/prisma';

console.log('🎬 Verificando videos subidos en la base de datos...\n');

async function checkUploadedVideos() {
  try {
    // Buscar todas las lecciones con videos
    const lessonsWithVideos = await prisma.lesson.findMany({
      where: {
        videoUrl: {
          not: null
        }
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    console.log(`📊 Total de lecciones con videos: ${lessonsWithVideos.length}\n`);

    if (lessonsWithVideos.length === 0) {
      console.log('❌ No se encontraron lecciones con videos');
      console.log('\n💡 Para agregar videos:');
      console.log('1. Ve a http://localhost:3000/admin/lesson-video-upload');
      console.log('2. Selecciona un curso y lección');
      console.log('3. Sube un video usando UploadThing');
      return;
    }

    console.log('📹 Videos encontrados:\n');

    lessonsWithVideos.forEach((lesson, index) => {
      console.log(`${index + 1}. **${lesson.course.title}**`);
      console.log(`   Lección: ${lesson.title}`);
      console.log(`   URL: ${lesson.videoUrl}`);
      console.log(`   Tipo: ${lesson.videoUrl?.includes('youtube.com') ? 'YouTube' : 'UploadThing'}`);
      console.log(`   Actualizado: ${lesson.updatedAt.toLocaleDateString()}`);
      console.log('');
    });

    // Estadísticas
    const youtubeVideos = lessonsWithVideos.filter(l => l.videoUrl?.includes('youtube.com')).length;
    const uploadThingVideos = lessonsWithVideos.filter(l => !l.videoUrl?.includes('youtube.com')).length;

    console.log('📈 Estadísticas:');
    console.log(`- Videos de YouTube: ${youtubeVideos}`);
    console.log(`- Videos de UploadThing: ${uploadThingVideos}`);
    console.log(`- Total: ${lessonsWithVideos.length}`);

    // Verificar URLs de UploadThing
    const uploadThingUrls = lessonsWithVideos
      .filter(l => !l.videoUrl?.includes('youtube.com'))
      .map(l => l.videoUrl);

    if (uploadThingUrls.length > 0) {
      console.log('\n🔗 URLs de UploadThing encontradas:');
      uploadThingUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url}`);
      });
    }

  } catch (error) {
    console.error('❌ Error al verificar videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
checkUploadedVideos(); 