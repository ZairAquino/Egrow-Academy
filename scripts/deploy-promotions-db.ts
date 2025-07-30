import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deployPromotionsDB() {
  try {
    console.log('🚀 Configurando base de datos de producción para promociones...');

    // 1. Crear enums si no existen
    console.log('📋 Creando enums...');
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "PromotionType" AS ENUM ('PREMIUM_SUBSCRIPTION', 'NEW_COURSE', 'SPECIAL_OFFER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "TargetAudience" AS ENUM ('ALL', 'NON_PREMIUM', 'SPECIFIC_COURSE_VIEWERS', 'NEW_USERS');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "InteractionAction" AS ENUM ('IMPRESSION', 'CLICK', 'CLOSE', 'CONVERSION');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // 2. Crear tabla promotions si no existe
    console.log('📊 Creando tabla promotions...');
    await prisma.$executeRaw`
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

    // 3. Crear tabla promotion_interactions si no existe
    console.log('📈 Creando tabla promotion_interactions...');
    await prisma.$executeRaw`
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

    // 4. Crear índices
    console.log('🔍 Creando índices...');
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_type_isActive_idx" ON "promotions"("type", "isActive");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_startDate_endDate_idx" ON "promotions"("startDate", "endDate");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_priority_idx" ON "promotions"("priority");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_promotionId_idx" ON "promotion_interactions"("promotionId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_userId_idx" ON "promotion_interactions"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_action_idx" ON "promotion_interactions"("action");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotion_interactions_timestamp_idx" ON "promotion_interactions"("timestamp");`;

    // 5. Crear foreign key
    console.log('🔗 Creando foreign key...');
    await prisma.$executeRaw`
      ALTER TABLE "promotion_interactions" ADD CONSTRAINT "promotion_interactions_promotionId_fkey" 
      FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `;

    // 6. Agregar columna a tabla users si no existe
    console.log('👥 Actualizando tabla users...');
    await prisma.$executeRaw`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "promotionInteractions" TEXT[];
    `;

    console.log('✅ Base de datos de producción configurada exitosamente');

    // 7. Crear promociones iniciales
    console.log('🚀 Creando promociones iniciales...');
    
    const premiumPromotion = await prisma.promotion.upsert({
      where: { id: 'premium-promotion-001' },
      update: {},
      create: {
        id: 'premium-promotion-001',
        type: 'PREMIUM_SUBSCRIPTION',
        title: '✨ ¡Únete a eGrow Academy Premium!',
        description: 'Accede a todos los cursos, recursos exclusivos y certificados',
        ctaText: 'Suscribirse Ahora',
        ctaUrl: '/subscription',
        isActive: true,
        priority: 10,
        targetAudience: 'NON_PREMIUM',
      },
    });

    const newCoursePromotion = await prisma.promotion.upsert({
      where: { id: 'new-course-promotion-001' },
      update: {},
      create: {
        id: 'new-course-promotion-001',
        type: 'NEW_COURSE',
        title: '🎯 Nuevo curso disponible',
        description: 'Descubre nuestro último curso de IA avanzada',
        ctaText: 'Ver Curso',
        ctaUrl: '/courses',
        isActive: true,
        priority: 8,
        targetAudience: 'ALL',
      },
    });

    console.log('✅ Promoción premium creada:', premiumPromotion.id);
    console.log('✅ Promoción de nuevo curso creada:', newCoursePromotion.id);

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deployPromotionsDB(); 