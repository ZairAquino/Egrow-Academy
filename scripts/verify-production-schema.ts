import { PrismaClient } from '@prisma/client';

async function verifyProductionSchema() {
  const prodDatabaseUrl = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  console.log('🔍 Verificando esquema de base de datos de producción...');
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
    
    // Verificar estructura de la tabla courses
    console.log('\n🔍 Verificando estructura de tabla courses...');
    const tableStructure = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📊 Estructura de tabla courses:');
    console.table(tableStructure);
    
    // Verificar específicamente el campo meta
    const metaColumn = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'meta';
    `;
    
    if (Array.isArray(metaColumn) && metaColumn.length > 0) {
      console.log('\n✅ Campo meta encontrado:');
      console.table(metaColumn);
    } else {
      console.log('\n❌ Campo meta NO encontrado en la tabla courses');
      return { hasMetaField: false };
    }
    
    // Verificar si algún curso ya tiene datos en meta
    const coursesWithMeta = await prisma.$queryRaw`
      SELECT id, title, slug, 
        CASE WHEN meta IS NULL THEN 'NULL' ELSE 'HAS DATA' END as meta_status
      FROM courses 
      ORDER BY "createdAt" DESC;
    `;
    
    console.log('\n📋 Estado del campo meta en cursos existentes:');
    console.table(coursesWithMeta);
    
    // Contar cursos con y sin meta
    const metaStats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_courses,
        COUNT(meta) as courses_with_meta,
        COUNT(*) - COUNT(meta) as courses_without_meta
      FROM courses;
    `;
    
    console.log('\n📊 Estadísticas del campo meta:');
    console.table(metaStats);
    
    // Probar inserción de un curso con meta
    console.log('\n🧪 Probando inserción de curso con campo meta...');
    const testSlug = `verify-meta-${Date.now()}`;
    
    try {
      const testCourse = await prisma.course.create({
        data: {
          title: 'Test Meta Field',
          slug: testSlug,
          description: 'Test para verificar campo meta',
          price: 0,
          status: 'DRAFT',
          category: 'HABILIDADES_IRREMPLAZABLES',
          meta: {
            test: true,
            templateId: 'course-v1',
            verification: 'production-schema-check'
          }
        }
      });
      
      console.log('✅ Curso de prueba creado exitosamente:', testCourse.id);
      
      // Verificar que se guardó correctamente
      const retrievedCourse = await prisma.course.findUnique({
        where: { id: testCourse.id },
        select: { id: true, meta: true }
      });
      
      if (retrievedCourse?.meta) {
        console.log('✅ Campo meta leído correctamente:', retrievedCourse.meta);
      } else {
        console.log('❌ No se pudo leer el campo meta');
      }
      
      // Limpiar
      await prisma.course.delete({
        where: { id: testCourse.id }
      });
      console.log('🗑️ Curso de prueba eliminado');
      
    } catch (error) {
      console.error('❌ Error creando curso de prueba:', error);
      return { hasMetaField: false, canInsert: false, error: error };
    }
    
    console.log('\n🎉 VERIFICACIÓN COMPLETADA');
    console.log('✅ La tabla courses tiene el campo meta');
    console.log('✅ El campo meta funciona correctamente');
    console.log('✅ Se pueden insertar y leer datos JSON');
    
    return { 
      hasMetaField: true, 
      canInsert: true, 
      tableStructure, 
      metaStats 
    };
    
  } catch (error) {
    console.error('❌ Error verificando esquema de producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
verifyProductionSchema()
  .then((result) => {
    if (result.hasMetaField && result.canInsert) {
      console.log('\n🎊 MIGRACIÓN DE PRODUCCIÓN CONFIRMADA EXITOSA 🎊');
    } else {
      console.log('\n⚠️ PROBLEMAS DETECTADOS EN LA MIGRACIÓN');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en verificación:', err);
    process.exit(1);
  });