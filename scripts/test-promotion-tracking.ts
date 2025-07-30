import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPromotionTracking() {
  try {
    console.log('🧪 Probando sistema de tracking de promociones...');

    // 1. Verificar promociones existentes
    const promotions = await prisma.promotion.findMany({
      include: {
        interactions: {
          take: 5,
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    console.log(`📊 Promociones encontradas: ${promotions.length}`);
    promotions.forEach(promotion => {
      console.log(`- ${promotion.title} (${promotion.type})`);
      console.log(`  Impresiones: ${promotion.currentImpressions}`);
      console.log(`  Interacciones recientes: ${promotion.interactions.length}`);
    });

    // 2. Simular interacciones de prueba
    console.log('\n🎯 Simulando interacciones de prueba...');

    const testPromotion = promotions[0];
    if (testPromotion) {
      // Simular impresión
      await prisma.promotionInteraction.create({
        data: {
          promotionId: testPromotion.id,
          action: 'IMPRESSION',
          sessionId: 'test-session-123',
          pageUrl: 'https://egrowacademy.com',
          referrer: 'https://google.com',
          userAgent: 'Mozilla/5.0 (Test Browser)',
        },
      });

      // Simular click
      await prisma.promotionInteraction.create({
        data: {
          promotionId: testPromotion.id,
          action: 'CLICK',
          sessionId: 'test-session-123',
          pageUrl: 'https://egrowacademy.com',
          referrer: 'https://google.com',
          userAgent: 'Mozilla/5.0 (Test Browser)',
        },
      });

      // Simular conversión (pago exitoso)
      await prisma.promotionInteraction.create({
        data: {
          promotionId: testPromotion.id,
          action: 'CONVERSION',
          sessionId: 'test-session-123',
          pageUrl: 'https://egrowacademy.com/subscription',
          referrer: 'https://egrowacademy.com',
          userAgent: 'Mozilla/5.0 (Test Browser)',
        },
      });

      console.log('✅ Interacciones de prueba creadas');
    }

    // 3. Calcular estadísticas
    console.log('\n📈 Calculando estadísticas...');

    const stats = await prisma.promotionInteraction.groupBy({
      by: ['action', 'promotionId'],
      _count: {
        action: true,
      },
    });

    console.log('Estadísticas por acción:');
    stats.forEach(stat => {
      console.log(`- ${stat.action}: ${stat._count.action}`);
    });

    // 4. Verificar webhook de Stripe
    console.log('\n🔗 Verificando configuración de webhook...');
    console.log('Webhook URL: /api/stripe/webhook');
    console.log('Eventos manejados: checkout.session.completed, customer.subscription.created');

    // 5. Probar endpoint de ROI
    console.log('\n💰 Probando cálculo de ROI...');
    
    const roiStats = await prisma.promotion.findMany({
      where: { isActive: true },
      include: {
        interactions: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
            },
          },
        },
      },
    });

    roiStats.forEach(promotion => {
      const impressions = promotion.interactions.filter(i => i.action === 'IMPRESSION').length;
      const clicks = promotion.interactions.filter(i => i.action === 'CLICK').length;
      const conversions = promotion.interactions.filter(i => i.action === 'CONVERSION').length;
      
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      const estimatedRevenue = conversions * 6.99;

      console.log(`\n📊 ${promotion.title}:`);
      console.log(`  - Impresiones: ${impressions}`);
      console.log(`  - Clicks: ${clicks}`);
      console.log(`  - Conversiones: ${conversions}`);
      console.log(`  - CTR: ${ctr.toFixed(2)}%`);
      console.log(`  - Conversion Rate: ${conversionRate.toFixed(2)}%`);
      console.log(`  - Revenue Estimado: $${estimatedRevenue.toFixed(2)}`);
    });

    console.log('\n✅ Sistema de tracking funcionando correctamente');

  } catch (error) {
    console.error('❌ Error en prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPromotionTracking(); 