import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testEnrollmentAPI() {
  console.log('🧪 [TEST] Probando endpoint de enrollment-status...');

  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');

    // Obtener un usuario de prueba
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('❌ Usuario de prueba no encontrado');
      return;
    }

    console.log('👤 Usuario de prueba:', testUser.email);

    // Generar un token JWT válido
    const token = jwt.sign(
      { userId: testUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    console.log('🔐 Token JWT generado:', token.substring(0, 50) + '...');

    // Crear una sesión en la base de datos
    const session = await prisma.session.create({
      data: {
        token: token,
        userId: testUser.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
      }
    });

    console.log('📝 Sesión creada:', session.id);

    // Obtener un curso de prueba
    const testCourse = await prisma.course.findFirst({
      where: { slug: 'monetiza-ia' }
    });

    if (!testCourse) {
      console.log('❌ Curso de prueba no encontrado');
      return;
    }

    console.log('📚 Curso de prueba:', testCourse.title);

    // Verificar enrollment manualmente
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: testUser.id,
        courseId: testCourse.id
      }
    });

    console.log('📝 Enrollment encontrado:', !!enrollment);

    // Simular la lógica del endpoint
    console.log('\n🔍 [SIMULACIÓN] Simulando lógica del endpoint...');

    // 1. Verificar token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      console.log('✅ Token válido para usuario:', decoded.userId);
    } catch (error) {
      console.log('❌ Error verificando token:', error);
      return;
    }

    // 2. Verificar sesión
    const dbSession = await prisma.session.findUnique({
      where: { token }
    });

    console.log('✅ Sesión encontrada:', !!dbSession);

    // 3. Buscar curso
    const course = await prisma.course.findUnique({
      where: { slug: 'monetiza-ia' }
    });

    console.log('✅ Curso encontrado:', course?.title);

    // 4. Verificar enrollment
    const userEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: testUser.id,
        courseId: course!.id
      }
    });

    console.log('✅ Enrollment verificado:', !!userEnrollment);

    // 5. Construir respuesta
    const response = {
      isEnrolled: !!userEnrollment,
      enrollment: userEnrollment || null
    };

    console.log('✅ Respuesta construida:', response);

    // Limpiar sesión de prueba
    await prisma.session.delete({
      where: { id: session.id }
    });

    console.log('🧹 Sesión de prueba eliminada');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  testEnrollmentAPI()
    .then(() => {
      console.log('\n✅ Prueba completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el script:', error);
      process.exit(1);
    });
}

export { testEnrollmentAPI }; 