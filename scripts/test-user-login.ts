import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testUserLogin() {
  try {
    console.log('🔍 [TEST-LOGIN] Probando login de usuario...\n');

    // Buscar un usuario existente
    const user = await prisma.user.findFirst({
      where: {
        email: 'IsaacL@gmail.com' // Usuario que sabemos que tiene cursos
      }
    });

    if (!user) {
      console.log('❌ [TEST-LOGIN] Usuario no encontrado');
      return;
    }

    console.log(`✅ [TEST-LOGIN] Usuario encontrado: ${user.firstName} ${user.lastName}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Membership: ${user.membershipLevel}`);

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

    console.log(`\n📚 [TEST-LOGIN] Cursos inscritos: ${enrollments.length}`);
    for (const enrollment of enrollments) {
      console.log(`   - ${enrollment.course.title} (${enrollment.course.slug})`);
    }

    // Generar token JWT
    if (!process.env.JWT_SECRET) {
      console.log('❌ [TEST-LOGIN] JWT_SECRET no configurado');
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(`\n🔑 [TEST-LOGIN] Token generado: ${token.substring(0, 50)}...`);

    // Crear sesión en la base de datos
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      }
    });

    console.log(`✅ [TEST-LOGIN] Sesión creada con ID: ${session.id}`);

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
      console.log(`✅ [TEST-LOGIN] Sesión verificada:`);
      console.log(`   - Usuario: ${createdSession.user.firstName} ${createdSession.user.lastName}`);
      console.log(`   - Email: ${createdSession.user.email}`);
      console.log(`   - Expira: ${createdSession.expiresAt}`);
    }

    console.log('\n🎯 [TEST-LOGIN] Prueba completada. El usuario debería poder acceder a sus cursos ahora.');

  } catch (error) {
    console.error('❌ [TEST-LOGIN] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserLogin(); 