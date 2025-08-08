import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/egrow_academy'
    }
  }
});

async function fixProductionCourse() {
  try {
    console.log('🔧 CORRIGIENDO CURSO EN PRODUCCIÓN...');
    console.log('🌐 Base de datos:', process.env.DATABASE_URL?.split('@')[1] || 'local');
    console.log('📅 Fecha:', new Date().toISOString());
    
    // Buscar el curso
    const course = await prisma.course.findUnique({
      where: {
        slug: 'monetiza-voz-ia-elevenlabs'
      }
    });

    if (!course) {
      console.log('❌ Curso no encontrado en producción');
      return;
    }

    console.log('📚 Curso encontrado:', course.title);
    console.log('📊 Status actual:', course.status);
    console.log('🆓 isFree actual:', course.isFree);
    console.log('📂 Categoría actual:', course.category);

    // Actualizar el curso para asegurar que esté correctamente configurado
    const updatedCourse = await prisma.course.update({
      where: {
        slug: 'monetiza-voz-ia-elevenlabs'
      },
      data: {
        status: 'PUBLISHED',
        isFree: false,
        category: 'IA_PARA_EMPRENDER',
        price: '97',
        requiresAuth: true,
        updatedAt: new Date()
      }
    });

    console.log('\n============================================================');
    console.log('✅ CURSO ACTUALIZADO EN PRODUCCIÓN:');
    console.log(`📚 Título: ${updatedCourse.title}`);
    console.log(`🔗 Slug: ${updatedCourse.slug}`);
    console.log(`📊 Status: ${updatedCourse.status}`);
    console.log(`💰 Precio: $${updatedCourse.price}`);
    console.log(`🆓 Gratis: ${updatedCourse.isFree}`);
    console.log(`🔒 Requiere Auth: ${updatedCourse.requiresAuth}`);
    console.log(`📂 Categoría: ${updatedCourse.category}`);
    console.log(`📅 Actualizado: ${updatedCourse.updatedAt}`);
    console.log('============================================================\n');

    // Verificar que el curso aparezca en el API
    console.log('🔄 VERIFICANDO API DESPUÉS DE LA ACTUALIZACIÓN...');
    
    try {
      const response = await fetch('https://egrowacademy.com/api/courses');
      if (response.ok) {
        const data = await response.json();
        const monetizaVozCourse = data.courses?.find((course: any) => 
          course.slug === 'monetiza-voz-ia-elevenlabs'
        );
        
        if (monetizaVozCourse) {
          console.log('✅ CURSO ENCONTRADO EN API DESPUÉS DE ACTUALIZACIÓN:');
          console.log(`📚 Título: ${monetizaVozCourse.title}`);
          console.log(`🔗 Slug: ${monetizaVozCourse.slug}`);
          console.log(`📊 Status: ${monetizaVozCourse.status}`);
          console.log(`💰 Precio: $${monetizaVozCourse.price}`);
          console.log(`🆓 Gratis: ${monetizaVozCourse.isFree}`);
          console.log(`📂 Categoría: ${monetizaVozCourse.category}`);
        } else {
          console.log('❌ CURSO NO ENCONTRADO EN API DESPUÉS DE ACTUALIZACIÓN');
        }
      }
    } catch (apiError) {
      console.log('⚠️ No se pudo verificar el API:', apiError);
    }

    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. ✅ Curso actualizado en base de datos');
    console.log('2. 🔄 Esperar 1-2 minutos para que el deploy se actualice');
    console.log('3. 🌐 Verificar en: https://egrowacademy.com/courses');
    console.log('4. 📚 Verificar en: https://egrowacademy.com/curso/monetiza-voz-ia-elevenlabs');

  } catch (error) {
    console.error('❌ Error al corregir curso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixProductionCourse();
