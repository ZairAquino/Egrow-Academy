import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupPromotionsDatabase() {
  try {
    console.log('🚀 Configurando base de datos para promociones...');

    // Crear las tablas usando SQL directo
    await prisma.$executeRaw`
      -- Crear enum para tipos de promoción
      DO $$ BEGIN
        CREATE TYPE "PromotionType" AS ENUM ('PREMIUM_SUBSCRIPTION', 'NEW_COURSE', 'SPECIAL_OFFER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      -- Crear enum para audiencia objetivo
      DO $$ BEGIN
        CREATE TYPE "TargetAudience" AS ENUM ('ALL', 'NON_PREMIUM', 'SPECIFIC_COURSE_VIEWERS', 'NEW_USERS');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      -- Crear enum para acciones de interacción
      DO $$ BEGIN
        CREATE TYPE "InteractionAction" AS ENUM ('IMPRESSION', 'CLICK', 'CLOSE', 'CONVERSION');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      -- Crear tabla de promociones
      CREATE TABLE IF NOT EXISTS "promotions" (
        "id" TEXT NOT NULL,
        "type" "PromotionType" NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "ctaText" TEXT NOT NULL,
        "ctaUrl" TEXT NOT NULL,
        "imageUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "startDate" TIMESTAMP(3),
        "endDate" TIMESTAMP(3),
        "priority" INTEGER NOT NULL DEFAULT 5,
        "targetAudience" "TargetAudience" NOT NULL DEFAULT 'ALL',
        "maxImpressions" INTEGER,
        "currentImpressions" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      -- Crear tabla de interacciones de promociones
      CREATE TABLE IF NOT EXISTS "promotion_interactions" (
        "id" TEXT NOT NULL,
        "promotionId" TEXT NOT NULL,
        "userId" TEXT,
        "action" "InteractionAction" NOT NULL,
        "sessionId" TEXT,
        "pageUrl" TEXT,
        "referrer" TEXT,
        "userAgent" TEXT,
        "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "promotion_interactions_pkey" PRIMARY KEY ("id")
      );
    `;

    // Crear índices
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_type_isActive_idx" ON "promotions"("type", "isActive");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_startDate_endDate_idx" ON "promotions"("startDate", "endDate");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_priority_idx" ON "promotions"("priority");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_promotionId_idx" ON "promotion_interactions"("promotionId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_userId_idx" ON "promotion_interactions"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_action_idx" ON "promotion_interactions"("action");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_timestamp_idx" ON "promotion_interactions"("timestamp");`;

    // Agregar foreign keys
    try {
      await prisma.$executeRaw`ALTER TABLE "promotion_interactions" ADD CONSTRAINT "promotion_interactions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;`;
    } catch (error) {
      console.log('Foreign key ya existe o no se pudo crear');
    }

    try {
      await prisma.$executeRaw`ALTER TABLE "promotion_interactions" ADD CONSTRAINT "promotion_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;`;
    } catch (error) {
      console.log('Foreign key ya existe o no se pudo crear');
    }

    console.log('✅ Base de datos configurada exitosamente');

    // Crear promociones iniciales
    console.log('🚀 Creando promociones iniciales...');

    const premiumPromotion = await prisma.promotion.create({
      data: {
        type: 'PREMIUM_SUBSCRIPTION',
        title: '✨ ¡Únete a eGrow Academy Premium!',
        description: 'Accede a todos los cursos, recursos exclusivos y certificados',
        ctaText: 'Suscribirse',
        ctaUrl: '/subscription',
        isActive: true,
        priority: 10,
        targetAudience: 'NON_PREMIUM',
        startDate: new Date(),
      },
    });

    console.log('✅ Promoción premium creada:', premiumPromotion.id);

    const newCoursePromotion = await prisma.promotion.create({
      data: {
        type: 'NEW_COURSE',
        title: '🎯 Nuevo curso disponible',
        description: 'Descubre nuestro último curso y mejora tus habilidades',
        ctaText: 'Ver cursos',
        ctaUrl: '/courses',
        isActive: true,
        priority: 5,
        targetAudience: 'ALL',
        startDate: new Date(),
      },
    });

    console.log('✅ Promoción de nuevo curso creada:', newCoursePromotion.id);

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupPromotionsDatabase(); 