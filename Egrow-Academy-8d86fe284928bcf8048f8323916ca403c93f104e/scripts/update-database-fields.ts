import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateDatabaseFields() {
  try {
    console.log('🔄 Actualizando campos de la base de datos...');

    // Agregar campo country si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "country" TEXT;
      `;
      console.log('✅ Campo "country" agregado/verificado');
    } catch (error) {
      console.log('ℹ️ Campo "country" ya existe o no se pudo agregar:', error);
    }

    // Agregar campo hasBeenPremium si no existe
    try {
      await prisma.$executeRaw`
        ALTER TABLE "users" 
        ADD COLUMN IF NOT EXISTS "hasBeenPremium" BOOLEAN DEFAULT false;
      `;
      console.log('✅ Campo "hasBeenPremium" agregado/verificado');
    } catch (error) {
      console.log('ℹ️ Campo "hasBeenPremium" ya existe o no se pudo agregar:', error);
    }

    // Actualizar usuarios existentes que son premium para marcar hasBeenPremium = true
    const premiumUsers = await prisma.user.findMany({
      where: {
        membershipLevel: 'PREMIUM'
      }
    });

    if (premiumUsers.length > 0) {
      await prisma.user.updateMany({
        where: {
          membershipLevel: 'PREMIUM'
        },
        data: {
          hasBeenPremium: true
        }
      });
      console.log(`✅ ${premiumUsers.length} usuarios premium marcados como hasBeenPremium = true`);
    }

    console.log('🎉 Actualización de base de datos completada');
  } catch (error) {
    console.error('❌ Error actualizando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDatabaseFields(); 