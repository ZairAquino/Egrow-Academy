import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

async function checkAdminUsers() {
  console.log('🔍 Verificando usuarios admin...');
  
  // Cargar variables de entorno
  dotenv.config();
  
  const prisma = new PrismaClient();
  
  try {
    // Conectar
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión establecida');
    
    // Verificar usuarios específicos
    const targetEmails = ['luisdavid.ls47@gmail.com', 'aquinozair3@gmail.com'];
    
    console.log('\n🔄 Verificando usuarios específicos...');
    for (const email of targetEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          membershipLevel: true,
          isActive: true,
          emailVerified: true
        }
      });
      
      if (user) {
        console.log(`\n📊 Usuario: ${email}`);
        console.table(user);
        
        if (user.role !== 'ADMIN') {
          console.log(`🔄 Actualizando ${email} a ADMIN...`);
          const updated = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
            select: { email: true, role: true }
          });
          console.log('✅ Usuario actualizado:', updated);
        } else {
          console.log('✅ Usuario ya es ADMIN');
        }
      } else {
        console.log(`❌ Usuario ${email} no encontrado`);
      }
    }
    
    // Mostrar todos los usuarios admin
    console.log('\n🔄 Todos los usuarios ADMIN en la base de datos:');
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        membershipLevel: true,
        isActive: true,
        emailVerified: true
      }
    });
    
    console.log(`📊 ${adminUsers.length} usuarios ADMIN encontrados:`);
    if (adminUsers.length > 0) {
      console.table(adminUsers);
    } else {
      console.log('❌ No hay usuarios ADMIN en la base de datos');
    }
    
    // Mostrar distribución de roles
    console.log('\n📈 Distribución completa de roles:');
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    roleDistribution.forEach(group => {
      console.log(`  - ${group.role}: ${group._count.role} usuarios`);
    });
    
    return { success: true, adminUsers };
    
  } catch (error) {
    console.error('❌ Error verificando usuarios admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar verificación
checkAdminUsers()
  .then((result) => {
    console.log('\n🎉 Verificación completada');
    console.log(`✅ ${result.adminUsers.length} usuarios ADMIN confirmados`);
  })
  .catch(err => {
    console.error('\n💥 Error:', err);
  });