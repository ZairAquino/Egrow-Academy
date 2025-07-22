import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function checkCurrentAuth() {
  try {
    console.log('🔍 [AUTH-CHECK] Verificando estado de autenticación...\n');

    // Verificar sesiones activas
    const sessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            membershipLevel: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 [AUTH-CHECK] Sesiones activas: ${sessions.length}\n`);

    for (const session of sessions) {
      console.log(`🔑 [AUTH-CHECK] Sesión:`);
      console.log(`   - ID: ${session.id}`);
      console.log(`   - Usuario: ${session.user.firstName} ${session.user.lastName} (${session.user.email})`);
      console.log(`   - User ID: ${session.userId}`);
      console.log(`   - Token: ${session.token.substring(0, 50)}...`);
      console.log(`   - Creada: ${session.createdAt}`);
      console.log(`   - Expira: ${session.expiresAt}`);
      console.log(`   - Membership: ${session.user.membershipLevel}`);

      // Verificar si el token es válido
      try {
        if (process.env.JWT_SECRET) {
          const decoded = jwt.verify(session.token, process.env.JWT_SECRET) as any;
          console.log(`   ✅ Token válido - User ID: ${decoded.userId}`);
        }
      } catch (error) {
        console.log(`   ❌ Token inválido: ${error}`);
      }

      // Verificar enrollments del usuario
      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: session.userId
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

      console.log(`   📚 Cursos inscritos: ${enrollments.length}`);
      for (const enrollment of enrollments) {
        console.log(`      - ${enrollment.course.title} (${enrollment.course.slug})`);
      }
      console.log('');
    }

    // Verificar si hay sesiones expiradas
    const now = new Date();
    const expiredSessions = sessions.filter(s => s.expiresAt < now);
    if (expiredSessions.length > 0) {
      console.log(`⚠️ [AUTH-CHECK] Sesiones expiradas: ${expiredSessions.length}`);
    }

  } catch (error) {
    console.error('❌ [AUTH-CHECK] Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentAuth(); 