import { prisma } from '../src/lib/prisma';
import { verifyToken } from '../src/lib/auth';

async function testDynamicLogo() {
  console.log('🔍 [TEST] Iniciando prueba de DynamicLogo...\n');

  try {
    // 1. Buscar usuarios premium en la base de datos
    console.log('1️⃣ Buscando usuarios premium en la base de datos...');
    const premiumUsers = await prisma.user.findMany({
      where: {
        OR: [
          { membershipLevel: 'PREMIUM' },
          {
            subscriptions: {
              some: {
                status: 'ACTIVE',
                currentPeriodEnd: {
                  gt: new Date(),
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
          select: {
            id: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    });

    console.log(`✅ Encontrados ${premiumUsers.length} usuarios premium:`);
    premiumUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`      - Membership Level: ${user.membershipLevel}`);
      console.log(`      - Stripe Customer ID: ${user.stripeCustomerId || 'No ID'}`);
      console.log(`      - Suscripciones activas: ${user.subscriptions.length}`);
      user.subscriptions.forEach(sub => {
        console.log(`        * ID: ${sub.id}, Status: ${sub.status}, Expira: ${sub.currentPeriodEnd}`);
      });
    });

    if (premiumUsers.length === 0) {
      console.log('❌ No se encontraron usuarios premium. Este es el problema.');
      return;
    }

    // 2. Simular la lógica del componente DynamicLogo
    console.log('\n2️⃣ Simulando lógica del componente DynamicLogo...');
    const testUser = premiumUsers[0];
    console.log(`   Usando usuario de prueba: ${testUser.email}`);

    // Simular verificación de token (necesitaríamos un token real)
    console.log('   ⚠️  Nota: Para probar completamente, necesitaríamos un token JWT válido');
    console.log('   🔍 Verificando datos del usuario directamente...');

    // Simular la lógica de isPremium del componente
    const userMembershipLevel = testUser.membershipLevel;
    const hasActiveSubscriptions = testUser.subscriptions.length > 0;
    
    console.log(`   - User membershipLevel: ${userMembershipLevel}`);
    console.log(`   - Has active subscriptions: ${hasActiveSubscriptions}`);
    
    const isPremium = userMembershipLevel === 'PREMIUM' || hasActiveSubscriptions;
    console.log(`   - Is Premium (calculated): ${isPremium}`);

    // 3. Verificar archivos de logo
    console.log('\n3️⃣ Verificando archivos de logo...');
    const fs = require('fs');
    const path = require('path');

    const logopPath = path.join(process.cwd(), 'public', 'images', 'logop.png');
    const logogPath = path.join(process.cwd(), 'public', 'images', 'logog.png');

    console.log(`   - logop.png existe: ${fs.existsSync(logopPath)}`);
    console.log(`   - logog.png existe: ${fs.existsSync(logogPath)}`);

    if (fs.existsSync(logopPath)) {
      const stats = fs.statSync(logopPath);
      console.log(`   - logop.png tamaño: ${stats.size} bytes`);
    }

    if (fs.existsSync(logogPath)) {
      const stats = fs.statSync(logogPath);
      console.log(`   - logog.png tamaño: ${stats.size} bytes`);
    }

    // 4. Simular URLs de logo con cache busting
    console.log('\n4️⃣ Simulando URLs de logo con cache busting...');
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const logoKey = 1;
    const forceReload = 1;

    const premiumLogoSrc = `/images/logop.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}`;
    const freeLogoSrc = `/images/logog.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}`;

    console.log(`   - Logo premium URL: ${premiumLogoSrc}`);
    console.log(`   - Logo free URL: ${freeLogoSrc}`);
    console.log(`   - Logo que debería cargar: ${isPremium ? 'logop.png (Premium)' : 'logog.png (Free)'}`);

    // 5. Verificar API endpoint
    console.log('\n5️⃣ Verificando endpoint /api/auth/subscription-status...');
    console.log('   ⚠️  Nota: Este endpoint requiere autenticación, no se puede probar directamente');
    console.log('   🔍 Verificando lógica del endpoint...');

    // Simular la lógica del endpoint
    const userForAPI = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        membershipLevel: true,
        stripeCustomerId: true
      }
    });

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: testUser.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });

    const hasActiveSubscription = !!activeSubscription || userForAPI?.membershipLevel === 'PREMIUM';
    
    console.log(`   - API membershipLevel: ${userForAPI?.membershipLevel}`);
    console.log(`   - API hasActiveSubscription: ${hasActiveSubscription}`);
    console.log(`   - API subscription found: ${!!activeSubscription}`);

    // 6. Resumen y conclusiones
    console.log('\n6️⃣ Resumen y conclusiones:');
    console.log('   =========================');
    console.log(`   ✅ Usuarios premium encontrados: ${premiumUsers.length}`);
    console.log(`   ✅ Archivo logop.png existe: ${fs.existsSync(logopPath)}`);
    console.log(`   ✅ Archivo logog.png existe: ${fs.existsSync(logogPath)}`);
    console.log(`   ✅ Lógica de isPremium: ${isPremium}`);
    console.log(`   ✅ API subscription status: ${hasActiveSubscription}`);
    
    if (isPremium && fs.existsSync(logopPath)) {
      console.log('   🎯 CONCLUSIÓN: Los datos están correctos, el problema podría ser:');
      console.log('      - Cache del navegador');
      console.log('      - Problema de timing en la carga del componente');
      console.log('      - Problema con el contexto de autenticación');
      console.log('      - Problema con la API de suscripción en tiempo real');
    } else {
      console.log('   ❌ CONCLUSIÓN: Hay un problema con los datos o archivos');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDynamicLogo(); 