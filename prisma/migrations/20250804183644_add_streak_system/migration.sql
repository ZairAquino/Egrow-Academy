-- CreateEnum
CREATE TYPE "StreakBadgeLevel" AS ENUM ('PRINCIPIANTE', 'ESTUDIANTE', 'DEDICADO', 'EN_LLAMAS', 'IMPARABLE', 'MAESTRO', 'LEYENDA');

-- CreateEnum
CREATE TYPE "PointTransactionType" AS ENUM ('WEEKLY_GOAL', 'RECOVERY_SPENT', 'BONUS_EARNED', 'ACHIEVEMENT_REWARD');

-- CreateTable
CREATE TABLE "user_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "currentWeekLessons" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "lifetimePointsEarned" INTEGER NOT NULL DEFAULT 0,
    "isCurrentWeekComplete" BOOLEAN NOT NULL DEFAULT false,
    "lastLessonCompletedAt" TIMESTAMP(3),
    "pointsSpentOnRecovery" INTEGER NOT NULL DEFAULT 0,
    "recoveryCount" INTEGER NOT NULL DEFAULT 0,
    "lastRecoveryUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_lesson_completions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "courseId" TEXT NOT NULL,
    "lessonsCompletedInWeek" INTEGER NOT NULL DEFAULT 0,
    "lastLessonAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_lesson_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_streak_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeLevel" "StreakBadgeLevel" NOT NULL,
    "streakWhenEarned" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_streak_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_points_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "transactionType" "PointTransactionType" NOT NULL,
    "reason" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3),
    "lessonsCompleted" INTEGER,
    "coursesUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_points_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streak_recovery_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pointsSpent" INTEGER NOT NULL,
    "badgeLevel" "StreakBadgeLevel" NOT NULL,
    "recoveryReason" TEXT,
    "originalStreakLost" INTEGER NOT NULL,
    "weekMissed" TIMESTAMP(3) NOT NULL,
    "recoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streak_recovery_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_streaks_userId_idx" ON "user_streaks"("userId");

-- CreateIndex
CREATE INDEX "user_streaks_weekStartDate_idx" ON "user_streaks"("weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "user_streaks_userId_weekStartDate_key" ON "user_streaks"("userId", "weekStartDate");

-- CreateIndex
CREATE INDEX "weekly_lesson_completions_userId_weekStart_idx" ON "weekly_lesson_completions"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "weekly_lesson_completions_weekStart_idx" ON "weekly_lesson_completions"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_lesson_completions_userId_weekStart_courseId_key" ON "weekly_lesson_completions"("userId", "weekStart", "courseId");

-- CreateIndex
CREATE INDEX "user_streak_badges_userId_idx" ON "user_streak_badges"("userId");

-- CreateIndex
CREATE INDEX "user_streak_badges_badgeLevel_idx" ON "user_streak_badges"("badgeLevel");

-- CreateIndex
CREATE UNIQUE INDEX "user_streak_badges_userId_badgeLevel_key" ON "user_streak_badges"("userId", "badgeLevel");

-- CreateIndex
CREATE INDEX "user_points_history_userId_createdAt_idx" ON "user_points_history"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_points_history_transactionType_idx" ON "user_points_history"("transactionType");

-- CreateIndex
CREATE INDEX "streak_recovery_history_userId_idx" ON "streak_recovery_history"("userId");

-- CreateIndex
CREATE INDEX "streak_recovery_history_recoveredAt_idx" ON "streak_recovery_history"("recoveredAt");

-- AddForeignKey
ALTER TABLE "user_streaks" ADD CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_lesson_completions" ADD CONSTRAINT "weekly_lesson_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_streak_badges" ADD CONSTRAINT "user_streak_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_points_history" ADD CONSTRAINT "user_points_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streak_recovery_history" ADD CONSTRAINT "streak_recovery_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
