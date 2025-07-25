#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testSubscriptionEndpoint() {
  console.log('🔍 Probando endpoint de verificación de suscripción...\n');

  try {
    // 1. Buscar un usuario premium para probar
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

    // 3. Simular la llamada al endpoint
    console.log('\n📡 Simulando llamada al endpoint /api/auth/subscription-status...');
    
    // Simular la lógica del endpoint
    const user = await prisma.user.findUnique({
      where: { id: premiumUser.id },
      select: {
        membershipLevel: true,
        stripeCustomerId: true
      }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado en la simulación');
      return;
    }

    console.log(`📊 Membership Level desde DB: ${user.membershipLevel}`);

    // Buscar suscripción activa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: premiumUser.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
      include: {
        price: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`💳 Suscripción activa encontrada: ${!!activeSubscription}`);

    // Lógica del endpoint
    const hasActiveSubscription = !!activeSubscription || user.membershipLevel === 'PREMIUM';

    console.log(`✅ hasActiveSubscription: ${hasActiveSubscription}`);
    console.log(`✅ membershipLevel: ${user.membershipLevel}`);

    // 4. Verificar que el logo debería ser premium
    const shouldShowPremiumLogo = hasActiveSubscription || user.membershipLevel === 'PREMIUM';
    
    console.log('\n🎨 RESULTADO:');
    console.log(`  - Usuario premium: ${user.membershipLevel === 'PREMIUM'}`);
    console.log(`  - Suscripción activa: ${hasActiveSubscription}`);
    console.log(`  - Debería mostrar logo premium: ${shouldShowPremiumLogo}`);
    
    if (shouldShowPremiumLogo) {
      console.log('✅ El usuario debería ver logop.png (logo premium)');
    } else {
      console.log('❌ El usuario debería ver logog.png (logo gratuito)');
    }

    // 5. Verificar archivos de logo
    console.log('\n📁 Verificando archivos de logo...');
    const fs = require('fs');
    const path = require('path');
    
    const logopPath = path.join(process.cwd(), 'public', 'images', 'logop.png');
    const logogPath = path.join(process.cwd(), 'public', 'images', 'logog.png');
    
    if (fs.existsSync(logopPath)) {
      const stats = fs.statSync(logopPath);
      console.log(`✅ logop.png existe (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log('❌ logop.png NO existe');
    }
    
    if (fs.existsSync(logogPath)) {
      const stats = fs.statSync(logogPath);
      console.log(`✅ logog.png existe (${(stats.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log('❌ logog.png NO existe');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testSubscriptionEndpoint(); 