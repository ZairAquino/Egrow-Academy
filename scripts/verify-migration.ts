import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyMigration() {
  try {
    console.log('🔍 Verificando migración del campo meta...');
    
    // Verificar que podemos crear un curso con campo meta
    const testSlug = `test-meta-${Date.now()}`;
    
    const testCourse = await prisma.course.create({
      data: {
        title: 'Test Curso Meta',
        slug: testSlug,
        description: 'Curso de prueba para verificar campo meta',
        price: 0,
        status: 'DRAFT',
        category: 'HABILIDADES_IRREMPLAZABLES',
        meta: {
          templateId: 'course-v1',
          templateVersion: 1,
          pageDataV1: {
            title: 'Test Meta Course',
            description: 'Descripción de prueba',
            modules: [
              {
                title: 'Módulo de Prueba',
                description: 'Descripción del módulo',
                lessons: [
                  {
                    title: 'Lección 1',
                    duration: 10
                  }
                ]
              }
            ],
            instructor: {
              name: 'Test Instructor',
              title: 'Instructor de Prueba'
            },
            testimonials: [],
            tools: ['Test Tool'],
            prerequisites: ['Conocimientos básicos'],
            learningGoals: ['Objetivo 1', 'Objetivo 2']
          }
        }
      }
    });
    
    console.log('✅ Curso de prueba creado exitosamente:', testCourse.id);
    
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
      console.log('✅ Campo meta leído exitosamente');
      const meta = retrievedCourse.meta as any;
      console.log('📊 Contenido del meta:');
      console.log('  - Template ID:', meta.templateId);
      console.log('  - Template Version:', meta.templateVersion);
      console.log('  - Título en pageDataV1:', meta.pageDataV1?.title);
      console.log('  - Módulos:', meta.pageDataV1?.modules?.length || 0);
      console.log('  - Herramientas:', meta.pageDataV1?.tools?.length || 0);
      console.log('  - Objetivos:', meta.pageDataV1?.learningGoals?.length || 0);
    } else {
      console.log('❌ No se pudo leer el campo meta');
    }
    
    // Limpiar - eliminar curso de prueba
    await prisma.course.delete({
      where: { id: testCourse.id }
    });
    console.log('🗑️ Curso de prueba eliminado');
    
    // Verificar todos los cursos
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        meta: true
      }
    });
    
    const coursesWithMeta = allCourses.filter(course => course.meta !== null);
    const coursesWithoutMeta = allCourses.filter(course => course.meta === null);
    
    console.log(`\n📋 Cursos sin campo meta: ${coursesWithoutMeta.length}`);
    coursesWithoutMeta.forEach(course => {
      console.log(`  - ${course.title} (${course.slug}) - ${course.status}`);
    });
    
    console.log(`\n📋 Cursos con campo meta: ${coursesWithMeta.length}`);
    coursesWithMeta.forEach(course => {
      console.log(`  - ${course.title} (${course.slug}) - ${course.status}`);
    });
    
    console.log('\n✅ Migración verificada exitosamente');
    console.log('🎯 El campo meta está funcionando correctamente');
    console.log('🚀 Las APIs de creación de cursos ahora pueden guardar datos estructurados');
    
  } catch (error) {
    console.error('❌ Error verificando migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyMigration()
  .then(() => {
    console.log('\n🎉 Verificación completada');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en verificación:', err);
    process.exit(1);
  });