import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function verifyUserSession() {
  try {
    console.log('🔍 [VERIFY-SESSION] Verificando sesión del usuario...\n');

    // Buscar el usuario Isaac Lopez
    const user = await prisma.user.findFirst({
      where: {
        email: 'IsaacL@gmail.com'
      }
    });

    if (!user) {
      console.log('❌ [VERIFY-SESSION] Usuario no encontrado');
      return;
    }

    console.log(`✅ [VERIFY-SESSION] Usuario: ${user.firstName} ${user.lastName} (${user.email})`);
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Membership: ${user.membershipLevel}`);

    // Buscar sesiones activas del usuario
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: {
          gt: new Date() // Solo sesiones no expiradas
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n🔑 [VERIFY-SESSION] Sesiones activas: ${sessions.length}`);

    if (sessions.length === 0) {
      console.log('❌ [VERIFY-SESSION] No hay sesiones activas');
      console.log('💡 [VERIFY-SESSION] El usuario necesita iniciar sesión');
      return;
    }

    // Verificar la sesión más reciente
    const latestSession = sessions[0];
    console.log(`\n✅ [VERIFY-SESSION] Sesión más reciente:`);
    console.log(`   - ID: ${latestSession.id}`);
    console.log(`   - Token: ${latestSession.token.substring(0, 50)}...`);
    console.log(`   - Creada: ${latestSession.createdAt}`);
    console.log(`   - Expira: ${latestSession.expiresAt}`);

    // Verificar que el token JWT sea válido
    try {
      if (process.env.JWT_SECRET) {
        const decoded = jwt.verify(latestSession.token, process.env.JWT_SECRET) as any;
        console.log(`   ✅ Token JWT válido - User ID: ${decoded.userId}`);
        
        if (decoded.userId === user.id) {
          console.log(`   ✅ Token corresponde al usuario correcto`);
        } else {
          console.log(`   ❌ Token no corresponde al usuario`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Token JWT inválido: ${error}`);
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
        },
        progress: {
          select: {
            progressPercentage: true,
            status: true
          }
        }
      }
    });

    console.log(`\n📚 [VERIFY-SESSION] Cursos inscritos: ${enrollments.length}`);
    for (const enrollment of enrollments) {
      console.log(`   - ${enrollment.course.title} (${enrollment.course.slug})`);
      console.log(`     Progreso: ${enrollment.progress?.progressPercentage || 0}%`);
      console.log(`     Status: ${enrollment.progress?.status || 'N/A'}`);
    }

    // Simular una petición al endpoint /api/courses/user-courses
    console.log(`\n🎯 [VERIFY-SESSION] Simulando petición a /api/courses/user-courses...`);
    console.log(`   - Token disponible: ${latestSession.token ? 'SÍ' : 'NO'}`);
    console.log(`   - Sesión válida: ${latestSession.expiresAt > new Date() ? 'SÍ' : 'NO'}`);
    console.log(`   - Usuario tiene cursos: ${enrollments.length > 0 ? 'SÍ' : 'NO'}`);

    if (latestSession.token && latestSession.expiresAt > new Date() && enrollments.length > 0) {
      console.log(`✅ [VERIFY-SESSION] Todo está configurado correctamente`);
      console.log(`💡 [VERIFY-SESSION] El usuario debería poder ver sus cursos en /my-courses`);
    } else {
      console.log(`❌ [VERIFY-SESSION] Hay problemas con la configuración`);
    }

  } catch (error) {
    console.error('❌ [VERIFY-SESSION] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUserSession(); 