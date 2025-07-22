import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function monitorUserStatus() {
  try {
    console.log('👀 Monitoreando estado de Armando en tiempo real...');
    console.log('Presiona Ctrl+C para detener\n');
    
    let lastStatus = '';
    let lastUpdate = '';
    
    while (true) {
      const user = await prisma.user.findUnique({
        where: { email: 'Armando@gmail.com' },
        select: {
          email: true,
          membershipLevel: true,
          stripeCustomerId: true,
          updatedAt: true
        }
      });
      
      if (user) {
        const currentStatus = user.membershipLevel;
        const currentUpdate = user.updatedAt.toLocaleString();
        
        if (currentStatus !== lastStatus || currentUpdate !== lastUpdate) {
          console.log(`🕐 ${new Date().toLocaleTimeString()}`);
          console.log(`📊 Email: ${user.email}`);
          console.log(`📊 Estado: ${currentStatus}`);
          console.log(`📊 Stripe Customer ID: ${user.stripeCustomerId || 'No configurado'}`);
          console.log(`📊 Última actualización: ${currentUpdate}`);
          console.log('─'.repeat(50));
          
          lastStatus = currentStatus;
          lastUpdate = currentUpdate;
        }
      }
      
      // Esperar 2 segundos antes de la siguiente verificación
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    console.error('❌ Error monitoreando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

monitorUserStatus(); 