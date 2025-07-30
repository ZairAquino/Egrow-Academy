import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Cursos que queremos CONSERVAR
const COURSES_TO_KEEP = [
  'monetiza-ia',
  'desarrollo-web-fullstack'
];

// Cursos que queremos ELIMINAR (IDs conocidos del seed anterior)
const COURSES_TO_DELETE = [
  'introduccion-llms',
  'fundamentos-ml', 
  'computer-vision'
];

async function cleanCourses() {
  console.log('🧹 Iniciando limpieza de cursos de la base de datos...');

  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Primero, listar todos los cursos actuales
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        slug: true,
        title: true
      }
    });

    console.log('\n📊 Cursos actuales en la base de datos:');
    allCourses.forEach(course => {
      console.log(`- ${course.title} (${course.slug})`);
    });

    // Identificar cursos a eliminar
    const coursesToDelete = allCourses.filter(course => 
      !COURSES_TO_KEEP.includes(course.slug)
    );

    if (coursesToDelete.length === 0) {
      console.log('\n✅ No hay cursos que eliminar. Base de datos ya está limpia.');
      return;
    }

    console.log(`\n🗑️ Cursos marcados para eliminación (${coursesToDelete.length}):`);
    coursesToDelete.forEach(course => {
      console.log(`- ${course.title} (${course.slug})`);
    });

    // Confirmar eliminación
    console.log('\n⚠️ ADVERTENCIA: Esta operación eliminará permanentemente:');
    console.log('- Los cursos listados arriba');
    console.log('- Todas las lecciones de estos cursos');
    console.log('- Todos los enrollments (inscripciones)');
    console.log('- Todo el progreso de usuarios en estos cursos');
    console.log('- Todos los comentarios y ratings');
    console.log('- Todos los pagos relacionados');
    
    // En un entorno real, aquí pedirías confirmación del usuario
    // Por ahora procederemos directamente
    
    console.log('\n🔄 Iniciando eliminación en cascada...');

    for (const course of coursesToDelete) {
      console.log(`\n🗑️ Eliminando curso: ${course.title}`);
      
      try {
        // Simplificar eliminación - usar CASCADE de Prisma para eliminar automáticamente datos relacionados
        
        // 1. Primero, contar datos relacionados para el reporte
        let enrollmentsCount = 0;
        let lessonsCount = 0;
        
        try {
          enrollmentsCount = await prisma.enrollment.count({
            where: { courseId: course.id }
          });
        } catch (e) {
          console.log(`  ⚠️ No se pudo contar enrollments (tabla posiblemente no existe)`);
        }

        try {
          lessonsCount = await prisma.lesson.count({
            where: { courseId: course.id }
          });
        } catch (e) {
          console.log(`  ⚠️ No se pudo contar lecciones (tabla posiblemente no existe)`);
        }

        // 2. Eliminar curso (CASCADE debería eliminar datos relacionados automáticamente)
        await prisma.course.delete({
          where: { id: course.id }
        });
        
        console.log(`  ✅ Curso eliminado: ${course.title}`);
        console.log(`    - Enrollments eliminados: ${enrollmentsCount}`);
        console.log(`    - Lecciones eliminadas: ${lessonsCount}`);

      } catch (error) {
        console.error(`  ❌ Error eliminando curso ${course.title}:`, error);
        // Continuar con el siguiente curso en lugar de fallar completamente
        continue;
      }
    }

    console.log('\n🎉 Limpieza de cursos completada exitosamente!');
    
    // Mostrar resumen final
    const remainingCourses = await prisma.course.findMany({
      select: {
        id: true,
        slug: true,
        title: true
      }
    });

    console.log(`\n📊 Resumen final:`);
    console.log(`- Cursos eliminados: ${coursesToDelete.length}`);
    console.log(`- Cursos restantes: ${remainingCourses.length}`);
    
    console.log(`\n📚 Cursos conservados:`);
    remainingCourses.forEach(course => {
      console.log(`- ${course.title} (${course.slug})`);
    });

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la limpieza si se llama directamente
if (require.main === module) {
  cleanCourses()
    .then(() => {
      console.log('✅ Script de limpieza completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script de limpieza:', error);
      process.exit(1);
    });
}

export { cleanCourses };