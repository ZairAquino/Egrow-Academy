-- CreateEnum
CREATE TYPE "WebinarEmailType" AS ENUM ('CONFIRMATION', 'REMINDER_24H', 'REMINDER_1H', 'FOLLOW_UP', 'RESOURCES');

-- CreateEnum
CREATE TYPE "WebinarStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WebinarRegistrationStatus" AS ENUM ('REGISTERED', 'CONFIRMED', 'ATTENDED', 'NO_SHOW', 'CANCELLED');

-- AlterTable
ALTER TABLE "webinar_registrations" ADD COLUMN     "joinedAt" TIMESTAMP(3),
ADD COLUMN     "leftAt" TIMESTAMP(3),
ADD COLUMN     "status" "WebinarRegistrationStatus" NOT NULL DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "webinars" ADD COLUMN     "replayUrl" TEXT,
ADD COLUMN     "status" "WebinarStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "streamUrl" TEXT;

-- CreateTable
CREATE TABLE "webinar_emails" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "type" "WebinarEmailType" NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "delayHours" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinar_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_questions" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "question" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "answered" BOOLEAN NOT NULL DEFAULT false,
    "answer" TEXT,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinar_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_polls" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinar_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_poll_votes" (
    "id" TEXT NOT NULL,
    "pollId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "option" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webinar_chat" (
    "id" TEXT NOT NULL,
    "webinarId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "message" TEXT NOT NULL,
    "isModerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webinar_chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webinar_emails_webinarId_type_idx" ON "webinar_emails"("webinarId", "type");

-- CreateIndex
CREATE INDEX "webinar_questions_webinarId_votes_idx" ON "webinar_questions"("webinarId", "votes");

-- CreateIndex
CREATE INDEX "webinar_questions_webinarId_answered_idx" ON "webinar_questions"("webinarId", "answered");

-- CreateIndex
CREATE INDEX "webinar_polls_webinarId_active_idx" ON "webinar_polls"("webinarId", "active");

-- CreateIndex
CREATE INDEX "webinar_poll_votes_pollId_option_idx" ON "webinar_poll_votes"("pollId", "option");

-- CreateIndex
CREATE UNIQUE INDEX "webinar_poll_votes_pollId_email_key" ON "webinar_poll_votes"("pollId", "email");

-- CreateIndex
CREATE INDEX "webinar_chat_webinarId_createdAt_idx" ON "webinar_chat"("webinarId", "createdAt");

-- CreateIndex
CREATE INDEX "webinar_registrations_status_idx" ON "webinar_registrations"("status");

-- CreateIndex
CREATE INDEX "webinars_status_idx" ON "webinars"("status");

-- AddForeignKey
ALTER TABLE "webinar_emails" ADD CONSTRAINT "webinar_emails_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_questions" ADD CONSTRAINT "webinar_questions_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_questions" ADD CONSTRAINT "webinar_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_polls" ADD CONSTRAINT "webinar_polls_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_poll_votes" ADD CONSTRAINT "webinar_poll_votes_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "webinar_polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_poll_votes" ADD CONSTRAINT "webinar_poll_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_chat" ADD CONSTRAINT "webinar_chat_webinarId_fkey" FOREIGN KEY ("webinarId") REFERENCES "webinars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webinar_chat" ADD CONSTRAINT "webinar_chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
