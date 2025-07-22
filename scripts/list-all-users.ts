import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function listAllUsers() {
  try {
    console.log('🔍 Listando todos los usuarios...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        lastLogin: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log(`📊 Total de usuarios: ${users.length}\n`);
    
    users.forEach((user, index) => {
      const hasStripe = user.stripeCustomerId ? '✅' : '❌';
      const lastLogin = user.lastLogin ? user.lastLogin.toLocaleString() : 'Nunca';
      
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`   Estado: ${user.membershipLevel}`);
      console.log(`   Stripe: ${hasStripe} ${user.stripeCustomerId || 'No configurado'}`);
      console.log(`   Último login: ${lastLogin}`);
      console.log(`   Última actualización: ${user.updatedAt.toLocaleString()}`);
      console.log('');
    });
    
    // Mostrar estadísticas
    const premiumUsers = users.filter(u => u.membershipLevel === 'PREMIUM');
    const freeUsers = users.filter(u => u.membershipLevel === 'FREE' || u.membershipLevel === 'GRATUITO');
    
    console.log('📈 Estadísticas:');
    console.log(`   Usuarios Premium: ${premiumUsers.length}`);
    console.log(`   Usuarios Gratuitos: ${freeUsers.length}`);
    console.log(`   Con Stripe Customer ID: ${users.filter(u => u.stripeCustomerId).length}`);
    
  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listAllUsers(); 