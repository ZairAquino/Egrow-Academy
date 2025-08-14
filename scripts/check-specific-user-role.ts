import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function checkSpecificUserRole() {
  try {
    console.log('🔍 Checking specific user role...\n');
    
    const email = 'luisdavid.ls47@gmail.com';
    
    // 1. Verificar usuario específico
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true,
        membershipLevel: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }
    
    console.log('👤 Usuario encontrado:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.firstName} ${user.lastName}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Active: ${user.isActive}`);
    console.log(`   Verified: ${user.emailVerified}`);
    console.log(`   Membership: ${user.membershipLevel}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Updated: ${user.updatedAt}`);
    
    // 2. Verificar acceso ADMIN
    const hasAdminAccess = user.role === 'ADMIN' && user.isActive && user.emailVerified;
    console.log(`\n🔐 Admin Access: ${hasAdminAccess ? '✅ GRANTED' : '❌ DENIED'}`);
    
    if (!hasAdminAccess) {
      console.log('\n🚨 Motivos de denegación:');
      if (user.role !== 'ADMIN') console.log(`   - Role incorrecto: ${user.role} (esperado: ADMIN)`);
      if (!user.isActive) console.log('   - Usuario inactivo');
      if (!user.emailVerified) console.log('   - Email no verificado');
    }
    
    // 3. Simular API /api/auth/me response
    console.log('\n📡 Simulación de respuesta API /api/auth/me:');
    const { ...safeUser } = user; // Remover passwordHash (ya no está en select)
    console.log(JSON.stringify(safeUser, null, 2));
    
    // 4. Test directo de autenticación
    console.log('\n🧪 Test directo de autenticación:');
    console.log(`   AuthContext debería mostrar: "Role: ${user.role}"`);
    console.log(`   useAdminAccess debería: ${hasAdminAccess ? 'Permitir acceso' : 'Denegar acceso'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecificUserRole();