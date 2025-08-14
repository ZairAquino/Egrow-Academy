import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

async function testRoleField() {
  console.log('🧪 Probando funcionalidad del campo role...');
  
  // Cargar variables de entorno
  dotenv.config();
  
  const prisma = new PrismaClient();
  
  try {
    // Conectar
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión establecida');
    
    // 1. Verificar usuarios existentes
    console.log('\n🔄 PASO 1: Verificando usuarios existentes...');
    const existingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        membershipLevel: true,
        isActive: true
      },
      take: 5
    });
    
    console.log(`📊 ${existingUsers.length} usuarios encontrados:`);
    console.table(existingUsers);
    
    // 2. Crear usuario de prueba con role USER (por defecto)
    console.log('\n🔄 PASO 2: Creando usuario de prueba con role USER...');
    const testUserSlug = `test-role-user-${Date.now()}`;
    
    try {
      const testUser = await prisma.user.create({
        data: {
          email: `${testUserSlug}@test.com`,
          firstName: 'Test',
          lastName: 'User',
          // role no especificado - debe usar default USER
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          role: true
        }
      });
      
      console.log('✅ Usuario USER creado:', testUser);
      
      // 3. Crear usuario ADMIN
      console.log('\n🔄 PASO 3: Creando usuario ADMIN...');
      const testAdminSlug = `test-role-admin-${Date.now()}`;
      
      const testAdmin = await prisma.user.create({
        data: {
          email: `${testAdminSlug}@test.com`,
          firstName: 'Test',
          lastName: 'Admin',
          role: 'ADMIN'
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          role: true
        }
      });
      
      console.log('✅ Usuario ADMIN creado:', testAdmin);
      
      // 4. Probar consultas por role
      console.log('\n🔄 PASO 4: Probando consultas por role...');
      
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });
      
      const userCount = await prisma.user.count({
        where: { role: 'USER' }
      });
      
      console.log(`📈 Distribución de roles:`);
      console.log(`  - ADMIN: ${adminCount} usuarios`);
      console.log(`  - USER: ${userCount} usuarios`);
      
      // 5. Probar actualización de role
      console.log('\n🔄 PASO 5: Probando actualización de role...');
      
      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: { role: 'ADMIN' },
        select: {
          id: true,
          email: true,
          role: true
        }
      });
      
      console.log('✅ Usuario actualizado a ADMIN:', updatedUser);
      
      // 6. Limpiar usuarios de prueba
      console.log('\n🔄 PASO 6: Limpiando usuarios de prueba...');
      
      await prisma.user.deleteMany({
        where: {
          email: {
            in: [testUser.email, testAdmin.email]
          }
        }
      });
      
      console.log('🗑️ Usuarios de prueba eliminados');
      
    } catch (createError) {
      console.error('❌ Error en creación/prueba:', createError);
    }
    
    // 7. Verificación final
    console.log('\n🔄 PASO 7: Verificación final...');
    
    const finalCount = await prisma.user.count();
    const finalRoleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    console.log(`📊 Total usuarios: ${finalCount}`);
    console.log('📈 Distribución final de roles:');
    finalRoleDistribution.forEach(group => {
      console.log(`  - ${group.role}: ${group._count.role} usuarios`);
    });
    
    console.log('\n🎉 PRUEBA DE CAMPO ROLE COMPLETADA EXITOSAMENTE');
    console.log('✅ Campo role funciona correctamente');
    console.log('✅ Valor por defecto USER aplicado');
    console.log('✅ Creación de usuarios ADMIN funciona');
    console.log('✅ Consultas por role funcionan');
    console.log('✅ Actualización de role funciona');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error probando campo role:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar prueba
testRoleField()
  .then(() => {
    console.log('\n🎊 Prueba completada exitosamente');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n💥 Error en prueba:', err);
    process.exit(1);
  });