import { PrismaClient } from '@prisma/client';
import { generateToken } from '@/lib/auth';
import dotenv from 'dotenv';

async function testAdminAuthComplete() {
  console.log('🧪 Probando autenticación completa para usuarios ADMIN...');
  
  dotenv.config();
  const prisma = new PrismaClient();
  
  try {
    // 1. Obtener usuario admin de la base de datos
    console.log('\n🔄 PASO 1: Obteniendo usuario ADMIN...');
    const adminUser = await prisma.user.findUnique({
      where: { email: 'luisdavid.ls47@gmail.com' },
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
    
    if (!adminUser) {
      throw new Error('Usuario admin no encontrado');
    }
    
    console.log('✅ Usuario ADMIN encontrado:');
    console.table(adminUser);
    
    // 2. Generar token JWT para el usuario
    console.log('\n🔄 PASO 2: Generando token JWT...');
    const token = generateToken(adminUser.id);
    console.log('✅ Token generado:', token.substring(0, 50) + '...');
    
    // 3. Probar endpoint /api/auth/me con el token
    console.log('\n🔄 PASO 3: Probando endpoint /api/auth/me...');
    const response = await fetch('http://localhost:3004/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`📡 Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa del endpoint:');
      console.log('📊 Usuario devuelto por API:');
      console.table({
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        role: data.user.role,
        membershipLevel: data.user.membershipLevel
      });
      
      // 4. Verificar que el campo role está presente
      if (data.user.role === 'ADMIN') {
        console.log('\n🎉 ¡SISTEMA DE ROLES FUNCIONANDO CORRECTAMENTE!');
        console.log('✅ El usuario tiene role: ADMIN');
        console.log('✅ El endpoint /api/auth/me devuelve el campo role');
        console.log('✅ El AuthContext debería mostrar el botón "Crear Curso"');
        
        console.log('\n🎯 Siguiente paso:');
        console.log('Ve a http://localhost:3004/courses e inicia sesión');
        console.log('Deberías ver el botón "Crear Curso" al lado del campo de búsqueda');
        
      } else {
        console.log('❌ El usuario no tiene role ADMIN:', data.user.role);
      }
    } else {
      const errorData = await response.text();
      console.log('❌ Error en endpoint:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAuthComplete();