import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function updateUserToPremium() {
  try {
    console.log('🔍 Buscando usuarios...');
    
    // Listar todos los usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
      },
    });
    
    console.log(`📊 Encontrados ${users.length} usuarios:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.firstName} ${user.lastName} - ${user.membershipLevel}`);
    });
    
    // Buscar el usuario más reciente o con stripeCustomerId
    const userToUpdate = users.find(user => user.stripeCustomerId) || users[users.length - 1];
    
    if (!userToUpdate) {
      console.log('❌ No hay usuarios para actualizar');
      return;
    }
    
    console.log(`\n🎯 Actualizando usuario: ${userToUpdate.email}`);
    console.log(`   Estado actual: ${userToUpdate.membershipLevel}`);
    
    // Actualizar a premium
    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { membershipLevel: 'PREMIUM' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
      },
    });
    
    console.log(`✅ Usuario actualizado exitosamente:`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Nombre: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`   Nuevo estado: ${updatedUser.membershipLevel}`);
    
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserToPremium(); 