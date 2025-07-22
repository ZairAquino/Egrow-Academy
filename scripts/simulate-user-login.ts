import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function simulateUserLogin() {
  try {
    console.log('🔍 [SIMULATE-LOGIN] Simulando login del usuario...\n');

    // Buscar el usuario Isaac Lopez
    const user = await prisma.user.findFirst({
      where: {
        email: 'IsaacL@gmail.com'
      }
    });

    if (!user) {
      console.log('❌ [SIMULATE-LOGIN] Usuario no encontrado');
      return;
    }

    console.log(`✅ [SIMULATE-LOGIN] Usuario encontrado: ${user.firstName} ${user.lastName}`);

    // Generar un nuevo token JWT
    if (!process.env.JWT_SECRET) {
      console.log('❌ [SIMULATE-LOGIN] JWT_SECRET no configurado');
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(`✅ [SIMULATE-LOGIN] Token generado: ${token.substring(0, 50)}...`);

    // Crear una nueva sesión
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    });

    console.log(`✅ [SIMULATE-LOGIN] Sesión creada con ID: ${session.id}`);

    // Verificar que la sesión se creó correctamente
    const createdSession = await prisma.session.findUnique({
      where: { id: session.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (createdSession) {
      console.log(`✅ [SIMULATE-LOGIN] Sesión verificada:`);
      console.log(`   - Usuario: ${createdSession.user.firstName} ${createdSession.user.lastName}`);
      console.log(`   - Email: ${createdSession.user.email}`);
      console.log(`   - Token: ${createdSession.token.substring(0, 50)}...`);
      console.log(`   - Expira: ${createdSession.expiresAt}`);
    }

    // Verificar enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    });

    console.log(`\n📚 [SIMULATE-LOGIN] Cursos inscritos: ${enrollments.length}`);
    for (const enrollment of enrollments) {
      console.log(`   - ${enrollment.course.title} (${enrollment.course.slug})`);
    }

    console.log('\n🎯 [SIMULATE-LOGIN] Instrucciones para el usuario:');
    console.log('1. Ve a http://localhost:3000/login');
    console.log('2. Inicia sesión con:');
    console.log(`   - Email: ${user.email}`);
    console.log('   - Contraseña: (la contraseña que configuraste)');
    console.log('3. Una vez logueado, ve a http://localhost:3000/my-courses');
    console.log('4. Deberías ver tus 2 cursos inscritos');

    console.log('\n💡 [SIMULATE-LOGIN] Cookie que se establecerá:');
    console.log(`   auth-token=${token.substring(0, 50)}...`);

  } catch (error) {
    console.error('❌ [SIMULATE-LOGIN] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateUserLogin(); 