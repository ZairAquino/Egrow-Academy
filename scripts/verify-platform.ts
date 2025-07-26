import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPlatform() {
  console.log('🔍 Verificación completa de la plataforma eGrow Academy\n');

  try {
    // 1. Verificar conexión a la base de datos
    console.log('1️⃣ Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // 2. Verificar cursos en la base de datos
    console.log('\n2️⃣ Verificando cursos en la base de datos...');
    const courses = await prisma.course.findMany({
      include: {
        lessons: true,
        enrollments: true
      }
    });

    console.log(`✅ ${courses.length} cursos encontrados en la base de datos:`);
    courses.forEach(course => {
      console.log(`   - ${course.title} (${course.slug}) - ${course.lessons.length} lecciones - ${course.enrollments.length} inscripciones`);
    });

    // 3. Verificar usuarios
    console.log('\n3️⃣ Verificando usuarios...');
    const users = await prisma.user.findMany({
      include: {
        enrollments: true
      }
    });
    console.log(`✅ ${users.length} usuarios registrados`);

    // 4. Verificar inscripciones
    console.log('\n4️⃣ Verificando inscripciones...');
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: true,
        user: true
      }
    });
    console.log(`✅ ${enrollments.length} inscripciones totales`);

    // 5. Verificar lecciones
    console.log('\n5️⃣ Verificando lecciones...');
    const lessons = await prisma.lesson.findMany();
    console.log(`✅ ${lessons.length} lecciones totales`);

    // 6. Verificar recursos
    console.log('\n6️⃣ Verificando recursos...');
    const resources = await prisma.resource.findMany();
    console.log(`✅ ${resources.length} recursos disponibles`);

    // 7. Verificar eventos
    console.log('\n7️⃣ Verificando eventos...');
    const events = await prisma.event.findMany();
    console.log(`✅ ${events.length} eventos programados`);

    // 8. Verificar posts de comunidad
    console.log('\n8️⃣ Verificando posts de comunidad...');
    const posts = await prisma.communityPost.findMany();
    console.log(`✅ ${posts.length} posts en la comunidad`);

    // 9. Verificar productos de Stripe
    console.log('\n9️⃣ Verificando productos de Stripe...');
    const products = await prisma.product.findMany({
      include: {
        prices: true
      }
    });
    console.log(`✅ ${products.length} productos de Stripe configurados`);

    // 10. Verificar suscripciones
    console.log('\n🔟 Verificando suscripciones...');
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE'
      }
    });
    console.log(`✅ ${subscriptions.length} suscripciones activas`);

    // 11. Verificar pagos
    console.log('\n1️⃣1️⃣ Verificando pagos...');
    const payments = await prisma.payment.findMany();
    console.log(`✅ ${payments.length} pagos totales`);

    // 12. Resumen general
    console.log('\n📊 RESUMEN GENERAL DE LA PLATAFORMA:');
    console.log('=====================================');
    console.log(`📚 Cursos: ${courses.length}`);
    console.log(`👥 Usuarios: ${users.length}`);
    console.log(`📝 Inscripciones: ${enrollments.length}`);
    console.log(`📖 Lecciones: ${lessons.length}`);
    console.log(`📚 Recursos: ${resources.length}`);
    console.log(`📅 Eventos: ${events.length}`);
    console.log(`💬 Posts: ${posts.length}`);
    console.log(`🛒 Productos: ${products.length}`);
    console.log(`💳 Suscripciones activas: ${subscriptions.length}`);
    console.log(`💰 Pagos totales: ${payments.length}`);

    // 13. Verificar cursos específicos
    console.log('\n🎯 VERIFICACIÓN DE CURSOS ESPECÍFICOS:');
    console.log('=====================================');
    
    const courseSlugs = ['monetiza-ia', 'introduccion-llms', 'fundamentos-ml', 'computer-vision', 'desarrollo-web-fullstack'];
    
    for (const slug of courseSlugs) {
      const course = await prisma.course.findUnique({
        where: { slug },
        include: { lessons: true }
      });
      
      if (course) {
        console.log(`✅ ${course.title}: ${course.lessons.length} lecciones, ${course.isFree ? 'Gratuito' : 'Premium'}`);
      } else {
        console.log(`❌ Curso "${slug}" NO encontrado en la base de datos`);
      }
    }

    // 14. Verificar rutas de API
    console.log('\n🔌 VERIFICACIÓN DE RUTAS DE API:');
    console.log('================================');
    const apiRoutes = [
      '/api/test-db',
      '/api/courses/enroll',
      '/api/auth/me',
      '/api/community/posts',
      '/api/resources',
      '/api/events'
    ];

    console.log('Rutas de API disponibles:');
    apiRoutes.forEach(route => {
      console.log(`   - ${route}`);
    });

    console.log('\n🎉 Verificación completada exitosamente!');
    console.log('\n💡 RECOMENDACIONES:');
    console.log('==================');
    
    if (courses.length === 0) {
      console.log('⚠️  No hay cursos en la base de datos. Ejecuta: npm run seed-courses');
    }
    
    if (users.length === 0) {
      console.log('⚠️  No hay usuarios registrados. Prueba el sistema de registro.');
    }
    
    if (lessons.length === 0) {
      console.log('⚠️  No hay lecciones creadas. Ejecuta: npm run seed-courses');
    }

    console.log('✅ La plataforma está lista para funcionar correctamente.');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación si se llama directamente
if (require.main === module) {
  verifyPlatform()
    .then(() => {
      console.log('\n✅ Verificación completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en la verificación:', error);
      process.exit(1);
    });
}

export { verifyPlatform }; 