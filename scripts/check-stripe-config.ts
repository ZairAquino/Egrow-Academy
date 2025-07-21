import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStripeConfig() {
  try {
    console.log('🔍 [STRIPE] Verificando configuración de Stripe...\n');

    // Verificar variables de entorno
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    console.log('1️⃣ Variables de entorno:');
    console.log('STRIPE_SECRET_KEY configurado:', !!stripeSecretKey);
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configurado:', !!stripePublishableKey);
    console.log('STRIPE_WEBHOOK_SECRET configurado:', !!stripeWebhookSecret);

    if (stripeSecretKey) {
      console.log('STRIPE_SECRET_KEY preview:', stripeSecretKey.substring(0, 10) + '...');
    }

    if (stripePublishableKey) {
      console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview:', stripePublishableKey.substring(0, 10) + '...');
    }

    // Verificar productos en base de datos
    console.log('\n2️⃣ Productos en base de datos:');
    
    const products = await prisma.product.findMany({
      include: {
        prices: true
      }
    });

    console.log(`Total de productos: ${products.length}`);

    products.forEach((product, index) => {
      console.log(`\nProducto ${index + 1}:`);
      console.log(`  - ID: ${product.id}`);
      console.log(`  - Nombre: ${product.name}`);
      console.log(`  - Stripe ID: ${product.stripeProductId}`);
      console.log(`  - Activo: ${product.active}`);
      console.log(`  - Precios: ${product.prices.length}`);
      
      product.prices.forEach((price, priceIndex) => {
        console.log(`    Precio ${priceIndex + 1}:`);
        console.log(`      - ID: ${price.id}`);
        console.log(`      - Stripe ID: ${price.stripePriceId}`);
        console.log(`      - Monto: $${price.unitAmount / 100}`);
        console.log(`      - Tipo: ${price.type}`);
        console.log(`      - Intervalo: ${price.interval}`);
      });
    });

    // Verificar suscripciones
    console.log('\n3️⃣ Suscripciones en base de datos:');
    
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: { email: true, firstName: true, lastName: true }
        },
        price: {
          include: { product: true }
        }
      }
    });

    console.log(`Total de suscripciones: ${subscriptions.length}`);

    subscriptions.forEach((subscription, index) => {
      console.log(`\nSuscripción ${index + 1}:`);
      console.log(`  - ID: ${subscription.id}`);
      console.log(`  - Usuario: ${subscription.user.firstName} ${subscription.user.lastName} (${subscription.user.email})`);
      console.log(`  - Stripe ID: ${subscription.stripeSubscriptionId}`);
      console.log(`  - Estado: ${subscription.status}`);
      console.log(`  - Producto: ${subscription.price.product.name}`);
      console.log(`  - Precio: $${subscription.price.unitAmount / 100}/${subscription.price.interval}`);
      console.log(`  - Período actual: ${subscription.currentPeriodStart?.toLocaleDateString()} - ${subscription.currentPeriodEnd?.toLocaleDateString()}`);
    });

    // Verificar usuarios con suscripciones
    console.log('\n4️⃣ Usuarios con suscripciones activas:');
    
    const usersWithSubscriptions = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date()
            }
          }
        }
      },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date()
            }
          },
          include: {
            price: {
              include: { product: true }
            }
          }
        }
      }
    });

    console.log(`Usuarios con suscripciones activas: ${usersWithSubscriptions.length}`);

    usersWithSubscriptions.forEach((user, index) => {
      console.log(`\nUsuario ${index + 1}:`);
      console.log(`  - Nombre: ${user.firstName} ${user.lastName}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Nivel: ${user.membershipLevel}`);
      console.log(`  - Suscripciones activas: ${user.subscriptions.length}`);
      
      user.subscriptions.forEach((subscription, subIndex) => {
        console.log(`    Suscripción ${subIndex + 1}: ${subscription.price.product.name} - $${subscription.price.unitAmount / 100}/${subscription.price.interval}`);
      });
    });

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('💥 Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStripeConfig(); 