import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function testAdminAccessProduction() {
  try {
    console.log('🔍 Testing ADMIN access in production...');
    
    // 1. Verificar usuarios ADMIN
    console.log('\n1. Verificando usuarios ADMIN en BD:');
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        emailVerified: true
      }
    });
    
    console.log(`Usuarios ADMIN encontrados: ${adminUsers.length}`);
    adminUsers.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Active: ${user.isActive}`);
      console.log(`  Verified: ${user.emailVerified}`);
      console.log('');
    });
    
    // 2. Verificar tabla UserRole enum
    console.log('2. Verificando UserRole enum:');
    const userRoles = await prisma.$queryRaw`
      SELECT unnest(enum_range(NULL::"UserRole")) as role;
    `;
    console.log('Roles disponibles:', userRoles);
    
    // 3. Verificar distribución de roles
    console.log('\n3. Distribución de roles:');
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    roleDistribution.forEach(group => {
      console.log(`- ${group.role}: ${group._count.role} usuarios`);
    });
    
    // 4. Test de acceso específico para los usuarios ADMIN
    console.log('\n4. Testing acceso específico:');
    for (const admin of adminUsers) {
      console.log(`\nTesting acceso para ${admin.email}:`);
      
      // Simular verificación de token (sin hacer real login)
      const userCheck = await prisma.user.findUnique({
        where: { id: admin.id },
        select: { role: true, isActive: true, emailVerified: true }
      });
      
      const hasAdminAccess = userCheck?.role === 'ADMIN' && 
                            userCheck?.isActive && 
                            userCheck?.emailVerified;
      
      console.log(`  ✅ Role check: ${userCheck?.role === 'ADMIN' ? 'PASS' : 'FAIL'}`);
      console.log(`  ✅ Active check: ${userCheck?.isActive ? 'PASS' : 'FAIL'}`);
      console.log(`  ✅ Verified check: ${userCheck?.emailVerified ? 'PASS' : 'FAIL'}`);
      console.log(`  🔐 Admin access: ${hasAdminAccess ? 'GRANTED' : 'DENIED'}`);
    }
    
    console.log('\n✅ Test completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAccessProduction();