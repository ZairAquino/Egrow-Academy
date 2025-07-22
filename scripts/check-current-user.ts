import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkCurrentUser() {
  try {
    console.log('🔍 Verificando usuario actual...');
    
    // Buscar el usuario más reciente con stripeCustomerId
    const user = await prisma.user.findFirst({
      where: {
        stripeCustomerId: {
          not: null
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      console.log('❌ No se encontró usuario con stripeCustomerId');
      
      // Mostrar el usuario más reciente
      const latestUser = await prisma.user.findFirst({
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          membershipLevel: true,
          stripeCustomerId: true,
          updatedAt: true,
        },
      });
      
      if (latestUser) {
        console.log(`\n📊 Usuario más reciente:`);
        console.log(`   Email: ${latestUser.email}`);
        console.log(`   Nombre: ${latestUser.firstName} ${latestUser.lastName}`);
        console.log(`   Estado: ${latestUser.membershipLevel}`);
        console.log(`   Stripe Customer ID: ${latestUser.stripeCustomerId || 'No configurado'}`);
        console.log(`   Última actualización: ${latestUser.updatedAt.toLocaleString()}`);
      }
      return;
    }
    
    console.log(`✅ Usuario encontrado:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
    console.log(`   Estado: ${user.membershipLevel}`);
    console.log(`   Stripe Customer ID: ${user.stripeCustomerId}`);
    console.log(`   Última actualización: ${user.updatedAt.toLocaleString()}`);
    
    // Verificar si hay sesiones activas
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: {
          gt: new Date()
        }
      },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        createdAt: true,
      },
    });
    
    console.log(`\n🔐 Sesiones activas: ${sessions.length}`);
    sessions.forEach((session, index) => {
      console.log(`   ${index + 1}. Token: ${session.token.substring(0, 20)}...`);
      console.log(`      Expira: ${session.expiresAt.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentUser(); 