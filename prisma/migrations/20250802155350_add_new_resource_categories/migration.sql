/*
  Warnings:

  - The values [FORUM,QUESTION,COURSE_COMMENT] on the enum `CommentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [TOOL,DATASET] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `questionId` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,commentId,postId]` on the table `likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resourceId,title]` on the table `resource_topics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CourseCategory" AS ENUM ('HABILIDADES_IRREMPLAZABLES', 'IA_PARA_EMPRENDER', 'DESARROLLO_WEB', 'MARKETING_DIGITAL', 'PRODUCTIVIDAD', 'FINANZAS_PERSONALES', 'LIDERAZGO', 'INNOVACION_TECNOLOGICA');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LANZAMIENTO', 'WORKSHOP', 'WEBINAR', 'MASTERCLASS', 'MEETUP', 'CONFERENCE', 'COURSE_LAUNCH', 'Q_A', 'NETWORKING');

-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('COURSE', 'POST', 'RESOURCE');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PREMIUM_SUBSCRIPTION', 'NEW_COURSE', 'SPECIAL_OFFER');

-- CreateEnum
CREATE TYPE "TargetAudience" AS ENUM ('ALL', 'NON_PREMIUM', 'SPECIFIC_COURSE_VIEWERS', 'NEW_USERS');

-- CreateEnum
CREATE TYPE "InteractionAction" AS ENUM ('IMPRESSION', 'CLICK', 'CLOSE', 'CONVERSION');

-- AlterEnum
BEGIN;
CREATE TYPE "CommentType_new" AS ENUM ('COURSE', 'POST', 'RESOURCE');
ALTER TABLE "comments" ALTER COLUMN "type" TYPE "CommentType_new" USING ("type"::text::"CommentType_new");
ALTER TYPE "CommentType" RENAME TO "CommentType_old";
ALTER TYPE "CommentType_new" RENAME TO "CommentType";
DROP TYPE "CommentType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "EnrollmentStatus" ADD VALUE 'PAUSED';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ResourceCategory" ADD VALUE 'EBOOK';
ALTER TYPE "ResourceCategory" ADD VALUE 'VIDEO';
ALTER TYPE "ResourceCategory" ADD VALUE 'TEMPLATE';
ALTER TYPE "ResourceCategory" ADD VALUE 'TOOL';
ALTER TYPE "ResourceCategory" ADD VALUE 'GUIDE';
ALTER TYPE "ResourceCategory" ADD VALUE 'CASE_STUDY';
ALTER TYPE "ResourceCategory" ADD VALUE 'WHITEPAPER';
ALTER TYPE "ResourceCategory" ADD VALUE 'CHECKLIST';
ALTER TYPE "ResourceCategory" ADD VALUE 'WORKSHOP';
ALTER TYPE "ResourceCategory" ADD VALUE 'ULTIMO_WEBINAR';
ALTER TYPE "ResourceCategory" ADD VALUE 'EN_VIVO';

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('PDF', 'VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT', 'PRESENTATION', 'SPREADSHEET', 'ARCHIVE', 'LINK', 'OTHER');
ALTER TABLE "resources" ALTER COLUMN "type" TYPE "ResourceType_new" USING ("type"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_questionId_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_userId_fkey";

-- DropIndex
DROP INDEX "likes_userId_commentId_questionId_postId_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "questionId";

-- AlterTable
ALTER TABLE "course_progress" ALTER COLUMN "completedLessons" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "category" "CourseCategory" NOT NULL DEFAULT 'HABILIDADES_IRREMPLAZABLES';

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "questionId";

-- AlterTable
ALTER TABLE "resource_topics" ALTER COLUMN "order" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "resources" ALTER COLUMN "isFree" SET DEFAULT false;

-- DropTable
DROP TABLE "questions";

-- DropEnum
DROP TYPE "QuestionStatus";

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "EventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentCapacity" INTEGER NOT NULL DEFAULT 0,
    "endDate" TIMESTAMP(3),
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "location" TEXT,
    "maxCapacity" INTEGER,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "type" "RatingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "postId" TEXT,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_logs" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotions" (
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

-- CreateTable
CREATE TABLE "promotion_interactions" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "userId" TEXT,
    "action" "InteractionAction" NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pageUrl" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "promotion_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_behaviors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_behaviors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[],
    "skillLevel" TEXT,
    "learningGoals" TEXT[],
    "preferredTopics" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "is_viewed" BOOLEAN NOT NULL DEFAULT false,
    "is_clicked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "badge" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_startDate_status_idx" ON "events"("startDate", "status");

-- CreateIndex
CREATE INDEX "events_type_status_idx" ON "events"("type", "status");

-- CreateIndex
CREATE INDEX "event_registrations_eventId_registeredAt_idx" ON "event_registrations"("eventId", "registeredAt");

-- CreateIndex
CREATE INDEX "event_registrations_userId_registeredAt_idx" ON "event_registrations"("userId", "registeredAt");

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_userId_eventId_key" ON "event_registrations"("userId", "eventId");

-- CreateIndex
CREATE INDEX "ratings_courseId_rating_idx" ON "ratings"("courseId", "rating");

-- CreateIndex
CREATE INDEX "ratings_userId_type_idx" ON "ratings"("userId", "type");

-- CreateIndex
CREATE INDEX "security_logs_event_createdAt_idx" ON "security_logs"("event", "createdAt");

-- CreateIndex
CREATE INDEX "security_logs_userId_createdAt_idx" ON "security_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "promotions_type_isActive_idx" ON "promotions"("type", "isActive");

-- CreateIndex
CREATE INDEX "promotions_startDate_endDate_idx" ON "promotions"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "promotions_priority_idx" ON "promotions"("priority");

-- CreateIndex
CREATE INDEX "promotion_interactions_promotionId_action_idx" ON "promotion_interactions"("promotionId", "action");

-- CreateIndex
CREATE INDEX "promotion_interactions_userId_createdAt_idx" ON "promotion_interactions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "promotion_interactions_sessionId_idx" ON "promotion_interactions"("sessionId");

-- CreateIndex
CREATE INDEX "user_behaviors_userId_action_idx" ON "user_behaviors"("userId", "action");

-- CreateIndex
CREATE INDEX "user_behaviors_targetType_targetId_idx" ON "user_behaviors"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "user_behaviors_createdAt_idx" ON "user_behaviors"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "recommendations_userId_target_type_idx" ON "recommendations"("userId", "target_type");

-- CreateIndex
CREATE INDEX "recommendations_score_idx" ON "recommendations"("score");

-- CreateIndex
CREATE INDEX "recommendations_expires_at_idx" ON "recommendations"("expires_at");

-- CreateIndex
CREATE INDEX "achievements_userId_type_idx" ON "achievements"("userId", "type");

-- CreateIndex
CREATE INDEX "achievements_created_at_idx" ON "achievements"("created_at");

-- CreateIndex
CREATE INDEX "comments_courseId_createdAt_idx" ON "comments"("courseId", "createdAt");

-- CreateIndex
CREATE INDEX "comments_userId_createdAt_idx" ON "comments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "community_posts_userId_createdAt_idx" ON "community_posts"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "community_posts_category_createdAt_idx" ON "community_posts"("category", "createdAt");

-- CreateIndex
CREATE INDEX "course_progress_enrollmentId_idx" ON "course_progress"("enrollmentId");

-- CreateIndex
CREATE INDEX "course_progress_status_lastAccessed_idx" ON "course_progress"("status", "lastAccessed");

-- CreateIndex
CREATE INDEX "courses_status_createdAt_idx" ON "courses"("status", "createdAt");

-- CreateIndex
CREATE INDEX "courses_instructorId_idx" ON "courses"("instructorId");

-- CreateIndex
CREATE INDEX "courses_slug_idx" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_category_idx" ON "courses"("category");

-- CreateIndex
CREATE INDEX "enrollments_userId_status_idx" ON "enrollments"("userId", "status");

-- CreateIndex
CREATE INDEX "enrollments_courseId_status_idx" ON "enrollments"("courseId", "status");

-- CreateIndex
CREATE INDEX "enrollments_enrolledAt_idx" ON "enrollments"("enrolledAt");

-- CreateIndex
CREATE INDEX "lesson_progress_courseProgressId_lessonNumber_idx" ON "lesson_progress"("courseProgressId", "lessonNumber");

-- CreateIndex
CREATE INDEX "lessons_courseId_order_idx" ON "lessons"("courseId", "order");

-- CreateIndex
CREATE INDEX "likes_userId_createdAt_idx" ON "likes"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_commentId_postId_key" ON "likes"("userId", "commentId", "postId");

-- CreateIndex
CREATE INDEX "payments_userId_createdAt_idx" ON "payments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "payments_status_createdAt_idx" ON "payments"("status", "createdAt");

-- CreateIndex
CREATE INDEX "payments_courseId_idx" ON "payments"("courseId");

-- CreateIndex
CREATE INDEX "prices_active_productId_idx" ON "prices"("active", "productId");

-- CreateIndex
CREATE INDEX "products_active_idx" ON "products"("active");

-- CreateIndex
CREATE INDEX "resource_access_logs_userId_accessedAt_idx" ON "resource_access_logs"("userId", "accessedAt");

-- CreateIndex
CREATE INDEX "resource_access_logs_resourceId_accessedAt_idx" ON "resource_access_logs"("resourceId", "accessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "resource_topics_resourceId_title_key" ON "resource_topics"("resourceId", "title");

-- CreateIndex
CREATE INDEX "resources_category_status_idx" ON "resources"("category", "status");

-- CreateIndex
CREATE INDEX "resources_status_createdAt_idx" ON "resources"("status", "createdAt");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_isActive_emailVerified_idx" ON "users"("isActive", "emailVerified");

-- CreateIndex
CREATE INDEX "users_stripeCustomerId_idx" ON "users"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_logs" ADD CONSTRAINT "security_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_interactions" ADD CONSTRAINT "promotion_interactions_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_interactions" ADD CONSTRAINT "promotion_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_behaviors" ADD CONSTRAINT "user_behaviors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
