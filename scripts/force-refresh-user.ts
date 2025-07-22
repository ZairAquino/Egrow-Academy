import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function forceRefreshUser() {
  try {
    console.log('🔍 Verificando estado actual del usuario...');
    
    // Buscar a Armando
    const user = await prisma.user.findUnique({
      where: { email: 'Armando@gmail.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        updatedAt: true,
        lastLogin: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario Armando no encontrado');
      return;
    }
    
    console.log('📊 Estado actual en la base de datos:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Nombre:', `${user.firstName} ${user.lastName}`);
    console.log('   Estado:', user.membershipLevel);
    console.log('   Stripe Customer ID:', user.stripeCustomerId);
    console.log('   Última actualización:', user.updatedAt.toLocaleString());
    console.log('   Último login:', user.lastLogin?.toLocaleString() || 'Nunca');
    
    console.log('\n🎯 Para forzar el refresh en el frontend:');
    console.log('1. Abre la consola del navegador (F12)');
    console.log('2. Ejecuta: localStorage.clear()');
    console.log('3. Recarga la página (F5)');
    console.log('4. O cierra sesión y vuelve a iniciar sesión');
    
    console.log('\n🔍 Verificación del hook useCourseAccess:');
    console.log('- El usuario debería tener membershipLevel: PREMIUM');
    console.log('- canAccessCourse() debería retornar true para cursos premium');
    console.log('- getAccessMessage() debería mostrar "Premium"');
    
  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceRefreshUser(); 