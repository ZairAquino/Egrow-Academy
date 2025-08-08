import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/egrow_academy'
    }
  }
});

async function checkProductionCourseStatus() {
  try {
    console.log('🔍 VERIFICANDO STATUS DEL CURSO EN PRODUCCIÓN...');
    console.log('🌐 Base de datos:', process.env.DATABASE_URL?.split('@')[1] || 'local');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Verificar el curso específico
    const course = await prisma.course.findUnique({
      where: {
        slug: 'monetiza-voz-ia-elevenlabs'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        price: true,
        isFree: true,
        requiresAuth: true,
        category: true
      }
    });

    if (course) {
      console.log('\n============================================================');
      console.log('✅ CURSO ENCONTRADO EN PRODUCCIÓN:');
      console.log(`📚 Título: ${course.title}`);
      console.log(`🔗 Slug: ${course.slug}`);
      console.log(`🆔 ID: ${course.id}`);
      console.log(`📊 Status: ${course.status}`);
      console.log(`💰 Precio: $${course.price}`);
      console.log(`🆓 Gratis: ${course.isFree}`);
      console.log(`🔒 Requiere Auth: ${course.requiresAuth}`);
      console.log(`📂 Categoría: ${course.category}`);
      console.log(`📅 Creado: ${course.createdAt}`);
      console.log(`📅 Actualizado: ${course.updatedAt}`);
      console.log('============================================================\n');
      
      if (course.status !== 'PUBLISHED') {
        console.log('⚠️ PROBLEMA IDENTIFICADO:');
        console.log(`❌ El curso tiene status "${course.status}" pero el API filtra por "PUBLISHED"`);
        console.log('💡 SOLUCIÓN: Cambiar el status a "PUBLISHED"');
      } else {
        console.log('✅ El curso tiene el status correcto (PUBLISHED)');
      }
    } else {
      console.log('❌ Curso no encontrado en producción');
    }

    // Verificar todos los cursos con status PUBLISHED
    console.log('\n📊 CURSOS CON STATUS PUBLISHED:');
    console.log('============================================================');
    
    const publishedCourses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📚 Total cursos con status PUBLISHED: ${publishedCourses.length}`);
    
    publishedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   🔗 Slug: ${course.slug}`);
      console.log(`   📊 Status: ${course.status}`);
      console.log(`   📅 Creado: ${course.createdAt.toISOString().split('T')[0]}`);
      console.log('');
    });

    // Verificar si el curso específico está en la lista de PUBLISHED
    const monetizaVozInPublished = publishedCourses.find(c => c.slug === 'monetiza-voz-ia-elevenlabs');
    
    if (monetizaVozInPublished) {
      console.log('✅ CURSO MONETIZA VOZ ENCONTRADO EN CURSOS PUBLISHED');
    } else {
      console.log('❌ CURSO MONETIZA VOZ NO ENCONTRADO EN CURSOS PUBLISHED');
      console.log('💡 Esto explica por qué no aparece en el API');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionCourseStatus();
