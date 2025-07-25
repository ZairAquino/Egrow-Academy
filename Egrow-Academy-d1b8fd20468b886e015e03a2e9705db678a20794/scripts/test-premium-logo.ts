#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPremiumLogo() {
  console.log('🔍 Probando funcionalidad del logo premium...\n');

  try {
    // 1. Verificar que los archivos de logo existen
    console.log('📁 Verificando archivos de logo...');
    const fs = require('fs');
    const path = require('path');
    
    const logopPath = path.join(process.cwd(), 'public', 'images', 'logop.png');
    const logogPath = path.join(process.cwd(), 'public', 'images', 'logog.png');
    
    if (fs.existsSync(logopPath)) {
      console.log('✅ logop.png existe');
    } else {
      console.log('❌ logop.png NO existe');
    }
    
    if (fs.existsSync(logogPath)) {
      console.log('✅ logog.png existe');
    } else {
      console.log('❌ logog.png NO existe');
    }

    // 2. Buscar usuarios premium
    console.log('\n👥 Buscando usuarios premium...');
    const premiumUsers = await prisma.user.findMany({
      where: {
        membershipLevel: 'PREMIUM'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        createdAt: true
      }
    });

    console.log(`📊 Encontrados ${premiumUsers.length} usuarios premium:`);
    premiumUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.firstName} ${user.lastName}) - ${user.membershipLevel}`);
    });

    // 3. Verificar suscripciones activas
    console.log('\n💳 Verificando suscripciones activas...');
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    console.log(`📊 Encontradas ${activeSubscriptions.length} suscripciones activas:`);
    activeSubscriptions.forEach(sub => {
      console.log(`  - ${sub.user.email} (${sub.user.firstName} ${sub.user.lastName}) - Expira: ${sub.currentPeriodEnd.toLocaleDateString()}`);
    });

    // 4. Verificar usuarios con suscripciones pero sin membershipLevel PREMIUM
    console.log('\n⚠️ Verificando inconsistencias...');
    const inconsistentUsers = await prisma.user.findMany({
      where: {
        membershipLevel: {
          not: 'PREMIUM'
        },
        subscriptions: {
          some: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date()
            }
          }
        }
      },
      select: {
        id: true,
        email: true,
        membershipLevel: true,
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date()
            }
          }
        }
      }
    });

    if (inconsistentUsers.length > 0) {
      console.log(`⚠️ Encontrados ${inconsistentUsers.length} usuarios con suscripción activa pero membershipLevel incorrecto:`);
      inconsistentUsers.forEach(user => {
        console.log(`  - ${user.email}: membershipLevel=${user.membershipLevel}, suscripciones activas=${user.subscriptions.length}`);
      });
    } else {
      console.log('✅ No se encontraron inconsistencias');
    }

    // 5. Resumen
    console.log('\n📋 RESUMEN:');
    console.log(`  - Usuarios premium: ${premiumUsers.length}`);
    console.log(`  - Suscripciones activas: ${activeSubscriptions.length}`);
    console.log(`  - Inconsistencias: ${inconsistentUsers.length}`);
    
    if (premiumUsers.length > 0 || activeSubscriptions.length > 0) {
      console.log('\n✅ El sistema debería mostrar el logo premium (logop.png) para estos usuarios');
    } else {
      console.log('\n❌ No hay usuarios premium, se mostrará el logo gratuito (logog.png)');
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testPremiumLogo(); 