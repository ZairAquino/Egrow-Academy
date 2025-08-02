-- Migración manual para Sistema de Rachas
-- Fecha: 2025-08-02

-- Enum para niveles de badges de racha
CREATE TYPE "StreakBadgeLevel" AS ENUM (
  'PRINCIPIANTE',
  'ESTUDIANTE', 
  'DEDICADO',
  'EN_LLAMAS',
  'IMPARABLE',
  'MAESTRO',
  'LEYENDA'
);

-- Enum para tipos de transacciones de puntos
CREATE TYPE "PointTransactionType" AS ENUM (
  'WEEKLY_GOAL',
  'BONUS_LESSONS',
  'DIVERSITY_BONUS',
  'STREAK_BONUS',
  'RECOVERY_SPENT',
  'ADMIN_ADJUSTMENT'
);

-- Tabla principal de rachas del usuario
CREATE TABLE "user_streaks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "currentWeekLessons" INTEGER NOT NULL DEFAULT 0,
  "weekStartDate" DATE NOT NULL,
  "currentStreak" INTEGER NOT NULL DEFAULT 0,
  "longestStreak" INTEGER NOT NULL DEFAULT 0,
  "totalPoints" INTEGER NOT NULL DEFAULT 0,
  "lifetimePointsEarned" INTEGER NOT NULL DEFAULT 0,
  "pointsSpentOnRecovery" INTEGER NOT NULL DEFAULT 0,
  "lastLessonCompletedAt" TIMESTAMP,
  "isCurrentWeekComplete" BOOLEAN NOT NULL DEFAULT FALSE,
  "lastRecoveryUsed" TIMESTAMP,
  "recoveryCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT "user_streaks_unique_user_week" UNIQUE ("userId", "weekStartDate"),
  CONSTRAINT "user_streaks_current_week_lessons_check" CHECK ("currentWeekLessons" >= 0),
  CONSTRAINT "user_streaks_current_streak_check" CHECK ("currentStreak" >= 0),
  CONSTRAINT "user_streaks_longest_streak_check" CHECK ("longestStreak" >= 0),
  CONSTRAINT "user_streaks_total_points_check" CHECK ("totalPoints" >= 0)
);

-- Historial semanal detallado
CREATE TABLE "user_weekly_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "weekStart" DATE NOT NULL,
  "weekEnd" DATE NOT NULL,
  "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
  "coursesUsed" INTEGER NOT NULL DEFAULT 0,
  "goalMet" BOOLEAN NOT NULL DEFAULT FALSE,
  "pointsEarned" INTEGER NOT NULL DEFAULT 0,
  "streakCountAtEnd" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT "user_weekly_history_unique_user_week" UNIQUE ("userId", "weekStart"),
  CONSTRAINT "user_weekly_history_lessons_check" CHECK ("lessonsCompleted" >= 0),
  CONSTRAINT "user_weekly_history_courses_check" CHECK ("coursesUsed" >= 0),
  CONSTRAINT "user_weekly_history_points_check" CHECK ("pointsEarned" >= 0)
);

-- Badges obtenidos por rachas
CREATE TABLE "user_streak_badges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "badgeLevel" "StreakBadgeLevel" NOT NULL,
  "earnedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "streakWhenEarned" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Constraints
  CONSTRAINT "user_streak_badges_unique_user_badge" UNIQUE ("userId", "badgeLevel"),
  CONSTRAINT "user_streak_badges_streak_check" CHECK ("streakWhenEarned" > 0)
);

-- Historial de transacciones de puntos
CREATE TABLE "user_points_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "pointsEarned" INTEGER NOT NULL,
  "transactionType" "PointTransactionType" NOT NULL,
  "reason" TEXT,
  "weekStart" DATE,
  "lessonsCompleted" INTEGER,
  "coursesUsed" INTEGER,
  "metadata" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT "user_points_history_points_check" CHECK ("pointsEarned" != 0)
);

-- Historial de recuperaciones de rachas
CREATE TABLE "streak_recovery_history" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "pointsSpent" INTEGER NOT NULL,
  "badgeLevel" "StreakBadgeLevel" NOT NULL,
  "recoveryReason" TEXT,
  "originalStreakLost" INTEGER NOT NULL,
  "weekMissed" DATE NOT NULL,
  "recoveredAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT "streak_recovery_points_check" CHECK ("pointsSpent" > 0),
  CONSTRAINT "streak_recovery_streak_check" CHECK ("originalStreakLost" > 0)
);

-- Conteo de lecciones completadas por semana (tabla de cache)
CREATE TABLE "weekly_lesson_completions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "weekStart" DATE NOT NULL,
  "courseId" UUID NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "lessonsCompletedInWeek" INTEGER NOT NULL DEFAULT 0,
  "lastLessonAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT "weekly_lesson_completions_unique" UNIQUE ("userId", "weekStart", "courseId"),
  CONSTRAINT "weekly_lesson_completions_lessons_check" CHECK ("lessonsCompletedInWeek" >= 0)
);

-- Índices para optimización
CREATE INDEX "idx_user_streaks_user_id" ON "user_streaks"("userId");
CREATE INDEX "idx_user_streaks_week_start" ON "user_streaks"("weekStartDate");
CREATE INDEX "idx_user_streaks_current_streak" ON "user_streaks"("currentStreak" DESC);

CREATE INDEX "idx_user_weekly_history_user_id" ON "user_weekly_history"("userId");
CREATE INDEX "idx_user_weekly_history_week_start" ON "user_weekly_history"("weekStart" DESC);

CREATE INDEX "idx_user_streak_badges_user_id" ON "user_streak_badges"("userId");
CREATE INDEX "idx_user_streak_badges_level" ON "user_streak_badges"("badgeLevel");

CREATE INDEX "idx_user_points_history_user_id" ON "user_points_history"("userId");
CREATE INDEX "idx_user_points_history_created_at" ON "user_points_history"("createdAt" DESC);

CREATE INDEX "idx_weekly_lesson_completions_user_week" ON "weekly_lesson_completions"("userId", "weekStart");
CREATE INDEX "idx_weekly_lesson_completions_course" ON "weekly_lesson_completions"("courseId");

-- Función para obtener el inicio de la semana (lunes)
CREATE OR REPLACE FUNCTION get_week_start(input_date DATE)
RETURNS DATE AS $$
BEGIN
  RETURN input_date - (EXTRACT(DOW FROM input_date)::INTEGER + 6) % 7;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para calcular puntos ganados por semana
CREATE OR REPLACE FUNCTION calculate_weekly_points(
  lessons_completed INTEGER,
  courses_used INTEGER,
  streak_count INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  base_points INTEGER := 0;
  bonus_points INTEGER := 0;
BEGIN
  -- Puntos base por lecciones
  IF lessons_completed >= 5 THEN
    base_points := 5; -- Meta mínima
    
    -- Bonus por lecciones extra
    IF lessons_completed >= 6 THEN
      base_points := 10;
    END IF;
    
    -- Bonus adicionales
    IF lessons_completed >= 7 THEN
      bonus_points := bonus_points + 2;
    END IF;
    
    IF lessons_completed >= 10 THEN
      bonus_points := bonus_points + 5;
    END IF;
    
    -- Bonus por diversidad de cursos
    IF courses_used >= 3 THEN
      bonus_points := bonus_points + 2;
    END IF;
    
    -- Bonus por mantener racha
    IF streak_count >= 2 THEN
      bonus_points := bonus_points + 3;
    END IF;
    
    IF streak_count >= 4 THEN
      bonus_points := bonus_points + 5;
    END IF;
    
    IF streak_count >= 8 THEN
      bonus_points := bonus_points + 10;
    END IF;
    
    IF streak_count >= 12 THEN
      bonus_points := bonus_points + 15;
    END IF;
  END IF;
  
  RETURN base_points + bonus_points;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para obtener el costo de recuperación por badge level
CREATE OR REPLACE FUNCTION get_recovery_cost(badge_level "StreakBadgeLevel")
RETURNS INTEGER AS $$
BEGIN
  CASE badge_level
    WHEN 'PRINCIPIANTE' THEN RETURN 10;
    WHEN 'ESTUDIANTE' THEN RETURN 20;
    WHEN 'DEDICADO' THEN RETURN 35;
    WHEN 'EN_LLAMAS' THEN RETURN 60;
    WHEN 'IMPARABLE' THEN RETURN 100;
    WHEN 'MAESTRO' THEN RETURN 200;
    WHEN 'LEYENDA' THEN RETURN 500;
    ELSE RETURN 10;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;