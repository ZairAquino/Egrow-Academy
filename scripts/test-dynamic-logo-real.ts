import { prisma } from '../src/lib/prisma';
import { generateToken } from '../src/lib/auth';

async function testDynamicLogoReal() {
  console.log('🔍 [TEST] Iniciando prueba real de DynamicLogo...\n');

  try {
    // 1. Buscar un usuario premium real
    console.log('1️⃣ Buscando usuario premium para prueba...');
    const premiumUser = await prisma.user.findFirst({
      where: {
        membershipLevel: 'PREMIUM'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
      }
    });

    if (!premiumUser) {
      console.log('❌ No se encontró usuario premium para la prueba');
      return;
    }

    console.log(`✅ Usuario premium encontrado: ${premiumUser.email}`);
    console.log(`   - ID: ${premiumUser.id}`);
    console.log(`   - Membership Level: ${premiumUser.membershipLevel}`);

    // 2. Crear un token JWT para este usuario
    console.log('\n2️⃣ Creando token JWT...');
    const token = generateToken(premiumUser.id);
    console.log(`✅ Token creado: ${token.substring(0, 50)}...`);

    // 3. Simular la llamada a /api/auth/me
    console.log('\n3️⃣ Simulando /api/auth/me...');
    const userFromDB = await prisma.user.findUnique({
      where: { id: premiumUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        membershipLevel: true,
        stripeCustomerId: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        enrollments: {
          select: {
            id: true,
            courseId: true,
            enrolledAt: true,
            completedAt: true,
          }
        }
      }
    });

    if (!userFromDB) {
      console.log('❌ No se pudo obtener usuario de la base de datos');
      return;
    }

    console.log(`✅ Usuario obtenido de DB:`);
    console.log(`   - Email: ${userFromDB.email}`);
    console.log(`   - Membership Level: ${userFromDB.membershipLevel}`);
    console.log(`   - Enrollments: ${userFromDB.enrollments.length}`);

    // 4. Simular la llamada a /api/auth/subscription-status
    console.log('\n4️⃣ Simulando /api/auth/subscription-status...');
    
    // Buscar suscripción activa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: premiumUser.id,
        status: 'ACTIVE',
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });

    const hasActiveSubscription = !!activeSubscription || userFromDB.membershipLevel === 'PREMIUM';
    
    console.log(`✅ Estado de suscripción:`);
    console.log(`   - Has Active Subscription: ${hasActiveSubscription}`);
    console.log(`   - Membership Level: ${userFromDB.membershipLevel}`);
    console.log(`   - Active Subscription Found: ${!!activeSubscription}`);

    // 5. Simular la lógica exacta del componente DynamicLogo
    console.log('\n5️⃣ Simulando lógica exacta del componente DynamicLogo...');
    
    // Simular el estado del contexto de autenticación
    const authStatus = 'authenticated';
    const user = userFromDB;
    
    // Simular la lógica de isPremium del componente
    const isPremium = authStatus === 'authenticated' && user && (
      user.membershipLevel === 'PREMIUM' ||
      hasActiveSubscription === true
    );

    console.log(`✅ Lógica de isPremium:`);
    console.log(`   - Auth Status: ${authStatus}`);
    console.log(`   - User exists: ${!!user}`);
    console.log(`   - User membershipLevel: ${user?.membershipLevel}`);
    console.log(`   - Has Active Subscription: ${hasActiveSubscription}`);
    console.log(`   - Is Premium (final result): ${isPremium}`);

    // 6. Generar URLs de logo como lo hace el componente
    console.log('\n6️⃣ Generando URLs de logo...');
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const logoKey = 1;
    const forceReload = 1;
    const sessionId = Math.random().toString(36).substring(7);

    const logoSrc = isPremium 
      ? `/images/logop.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}&s=${sessionId}&premium=true&t=${Date.now()}` 
      : `/images/logog.png?v=${timestamp}&key=${logoKey}&reload=${forceReload}&r=${randomId}&s=${sessionId}&premium=false&t=${Date.now()}`;

    console.log(`✅ URL generada:`);
    console.log(`   - Is Premium: ${isPremium}`);
    console.log(`   - Logo Source: ${logoSrc}`);
    console.log(`   - Expected Logo: ${isPremium ? 'logop.png (Premium)' : 'logog.png (Free)'}`);

    // 7. Verificar que el archivo existe
    console.log('\n7️⃣ Verificando existencia del archivo...');
    const fs = require('fs');
    const path = require('path');

    const expectedLogoPath = isPremium 
      ? path.join(process.cwd(), 'public', 'images', 'logop.png')
      : path.join(process.cwd(), 'public', 'images', 'logog.png');

    const fileExists = fs.existsSync(expectedLogoPath);
    console.log(`✅ Verificación de archivo:`);
    console.log(`   - Expected path: ${expectedLogoPath}`);
    console.log(`   - File exists: ${fileExists}`);

    if (fileExists) {
      const stats = fs.statSync(expectedLogoPath);
      console.log(`   - File size: ${stats.size} bytes`);
    }

    // 8. Resumen final
    console.log('\n8️⃣ Resumen final:');
    console.log('   ===============');
    console.log(`   ✅ Usuario premium: ${premiumUser.email}`);
    console.log(`   ✅ Membership Level: ${userFromDB.membershipLevel}`);
    console.log(`   ✅ Is Premium (calculated): ${isPremium}`);
    console.log(`   ✅ Expected logo: ${isPremium ? 'logop.png' : 'logog.png'}`);
    console.log(`   ✅ File exists: ${fileExists}`);
    console.log(`   ✅ Logo URL: ${logoSrc}`);

    if (isPremium && fileExists) {
      console.log('\n🎯 CONCLUSIÓN: Todo está configurado correctamente.');
      console.log('   El componente DynamicLogo debería mostrar logop.png para este usuario.');
      console.log('   Si no se muestra, el problema podría ser:');
      console.log('   - Cache del navegador (probar Ctrl+F5)');
      console.log('   - Problema de timing en la carga del componente');
      console.log('   - Problema con el contexto de autenticación en el frontend');
    } else {
      console.log('\n❌ CONCLUSIÓN: Hay un problema con la configuración.');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDynamicLogoReal(); 