#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testAuthMe() {
  console.log('🔍 Probando endpoint /api/auth/me...\n');

  try {
    // 1. Buscar un usuario premium
    const premiumUser = await prisma.user.findFirst({
      where: {
        membershipLevel: 'PREMIUM'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true
      }
    });

    if (!premiumUser) {
      console.log('❌ No se encontró ningún usuario premium para probar');
      return;
    }

    console.log(`👤 Usuario de prueba: ${premiumUser.email} (${premiumUser.firstName} ${premiumUser.lastName})`);
    console.log(`📊 Membership Level: ${premiumUser.membershipLevel}\n`);

    // 2. Crear un token JWT para el usuario
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { 
        userId: premiumUser.id,
        email: premiumUser.email 
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('🔑 Token JWT creado para pruebas');

    // 3. Crear una sesión en la base de datos
    const session = await prisma.session.create({
      data: {
        token: token,
        userId: premiumUser.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hora
      }
    });

    console.log('💾 Sesión creada en la base de datos');

    // 4. Simular la llamada al endpoint /api/auth/me
    console.log('\n📡 Simulando llamada al endpoint /api/auth/me...');
    
    // Simular la lógica del endpoint
    const sessionFromDB = await prisma.session.findUnique({
      where: { token }
    });

    if (!sessionFromDB) {
      console.log('❌ Sesión no encontrada en la simulación');
      return;
    }

    console.log(`📊 Sesión encontrada, expira: ${sessionFromDB.expiresAt.toLocaleString()}`);

    // Verificar si la sesión no ha expirado
    if (sessionFromDB.expiresAt < new Date()) {
      console.log('❌ Sesión expirada');
      return;
    }

    // Obtener usuario completo
    const userFromDB = await prisma.user.findUnique({
      where: { id: premiumUser.id },
      include: {
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });

    if (!userFromDB) {
      console.log('❌ Usuario no encontrado en la simulación');
      return;
    }

    console.log(`✅ Usuario encontrado: ${userFromDB.email}`);
    console.log(`📊 Membership Level desde DB: ${userFromDB.membershipLevel}`);
    console.log(`📚 Enrollments: ${userFromDB.enrollments.length}`);

    // 5. Crear usuario seguro (sin passwordHash)
    const { passwordHash, ...safeUser } = userFromDB;

    console.log('\n🎨 RESULTADO:');
    console.log(`  - Email: ${safeUser.email}`);
    console.log(`  - Nombre: ${safeUser.firstName} ${safeUser.lastName}`);
    console.log(`  - Membership Level: ${safeUser.membershipLevel}`);
    console.log(`  - Email Verificado: ${safeUser.emailVerified}`);
    console.log(`  - Activo: ${safeUser.isActive}`);
    console.log(`  - Enrollments: ${safeUser.enrollments.length}`);
    
    if (safeUser.membershipLevel === 'PREMIUM') {
      console.log('✅ El usuario debería ver logop.png (logo premium)');
    } else {
      console.log('❌ El usuario debería ver logog.png (logo gratuito)');
    }

    // 6. Limpiar la sesión de prueba
    await prisma.session.delete({
      where: { id: session.id }
    });

    console.log('\n🧹 Sesión de prueba eliminada');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testAuthMe(); 