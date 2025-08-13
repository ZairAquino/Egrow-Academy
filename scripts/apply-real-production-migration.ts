import { PrismaClient } from '@prisma/client';

async function applyRealProductionMigration() {
  const prodDatabaseUrl = 'postgresql://neondb_owner:npg_up9eQTmJ0Arw@ep-holy-heart-aeupskea-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  console.log('🚀 APLICANDO MIGRACIÓN REAL A PRODUCCIÓN...');
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
    
    // Verificar que el campo meta NO existe (para confirmar que necesitamos crearlo)
    try {
      await prisma.$queryRaw`SELECT meta FROM courses LIMIT 1`;
      console.log('⚠️ El campo meta ya existe, no es necesario crearlo');
      return { alreadyExists: true };
    } catch (error) {
      console.log('✅ Confirmado: El campo meta no existe, procediendo con la migración...');
    }
    
    // PASO 1: Agregar el campo meta a la tabla courses
    console.log('🔄 PASO 1: Agregando campo meta a la tabla courses...');
    await prisma.$executeRaw`ALTER TABLE courses ADD COLUMN meta JSONB`;
    console.log('✅ Campo meta agregado exitosamente');
    
    // PASO 2: Verificar que el campo se agregó
    console.log('🔄 PASO 2: Verificando que el campo se agregó...');
    const metaColumn = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'meta';
    `;
    
    if (Array.isArray(metaColumn) && metaColumn.length > 0) {
      console.log('✅ Campo meta verificado:');
      console.table(metaColumn);
    } else {
      throw new Error('El campo meta no se agregó correctamente');
    }
    
    // PASO 3: Probar inserción de datos
    console.log('🔄 PASO 3: Probando inserción de datos en el campo meta...');
    const testSlug = `production-migration-test-${Date.now()}`;
    
    const testCourse = await prisma.course.create({
      data: {
        title: 'Test Migración Producción',
        slug: testSlug,
        description: 'Curso de prueba para verificar migración en producción',
        price: 0,
        status: 'DRAFT',
        category: 'HABILIDADES_IRREMPLAZABLES',
        meta: {
          templateId: 'course-v1',
          templateVersion: 1,
          migrationTest: true,
          timestamp: new Date().toISOString(),
          pageDataV1: {
            title: 'Test Migración Producción',
            description: 'Verificando que el campo meta funciona correctamente',
            modules: [
              {
                title: 'Módulo de Prueba',
                description: 'Módulo para verificar la migración',
                lessons: [
                  {
                    title: 'Lección de prueba',
                    duration: 10
                  }
                ]
              }
            ],
            instructor: {
              name: 'Test Instructor',
              title: 'Verificador de Migración'
            },
            testimonials: [],
            tools: ['PostgreSQL', 'Prisma'],
            prerequisites: ['Ninguno'],
            learningGoals: ['Verificar migración exitosa']
          }
        }
      }
    });
    
    console.log('✅ Curso de prueba creado exitosamente:', testCourse.id);
    
    // PASO 4: Verificar lectura de datos
    console.log('🔄 PASO 4: Verificando lectura de datos...');
    const retrievedCourse = await prisma.course.findUnique({
      where: { id: testCourse.id },
      select: {
        id: true,
        title: true,
        meta: true
      }
    });
    
    if (retrievedCourse?.meta) {
      const meta = retrievedCourse.meta as any;
      console.log('✅ Datos del meta leídos correctamente:');
      console.log(`  - Template ID: ${meta.templateId}`);
      console.log(`  - Migration Test: ${meta.migrationTest}`);
      console.log(`  - Título en pageDataV1: ${meta.pageDataV1?.title}`);
      console.log(`  - Módulos: ${meta.pageDataV1?.modules?.length || 0}`);
      console.log(`  - Timestamp: ${meta.timestamp}`);
    } else {
      throw new Error('No se pudieron leer los datos del meta');
    }
    
    // PASO 5: Limpiar curso de prueba
    await prisma.course.delete({
      where: { id: testCourse.id }
    });
    console.log('🗑️ Curso de prueba eliminado');
    
    // PASO 6: Verificar estructura final
    console.log('🔄 PASO 6: Verificando estructura final de la tabla...');
    const finalStructure = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📊 Estructura final de tabla courses:');
    console.table(finalStructure);
    
    console.log('\n🎊 MIGRACIÓN DE PRODUCCIÓN COMPLETADA EXITOSAMENTE 🎊');
    console.log('✅ Campo meta agregado a la tabla courses');
    console.log('✅ Datos JSON se pueden insertar y leer correctamente');
    console.log('✅ Base de datos de producción lista para usar');
    
    return { success: true, testCourseId: testCourse.id };
    
  } catch (error) {
    console.error('❌ Error aplicando migración real a producción:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración real
applyRealProductionMigration()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 MIGRACIÓN REAL APLICADA EXITOSAMENTE');
      console.log('🚀 La base de datos de producción ahora tiene el campo meta');
      console.log('🚀 Las APIs de cursos funcionarán correctamente');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en migración real:', err);
    process.exit(1);
  });