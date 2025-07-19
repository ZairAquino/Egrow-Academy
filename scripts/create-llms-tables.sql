-- Crear enum para el estado del progreso del curso
CREATE TYPE "CourseProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED', 'ABANDONED');

-- Actualizar la tabla course_progress existente para incluir métricas avanzadas
ALTER TABLE "course_progress" 
ADD COLUMN "progressPercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "completedAt" TIMESTAMP(3),
ADD COLUMN "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "totalSessions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "averageSessionTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "longestSession" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "status" "CourseProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS',
ADD COLUMN "courseSpecificData" JSONB;

-- Crear tabla para el progreso detallado por lección (opcional)
CREATE TABLE "lesson_progress" (
    "id" TEXT NOT NULL,
    "courseProgressId" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "lessonTitle" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "firstAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "completionAttempts" INTEGER NOT NULL DEFAULT 0,
    "userNotes" TEXT,
    "lessonSpecificData" JSONB,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- Crear índices para mejorar performance
CREATE UNIQUE INDEX "lesson_progress_courseProgressId_lessonNumber_key" ON "lesson_progress"("courseProgressId", "lessonNumber");
CREATE INDEX "lesson_progress_courseProgressId_idx" ON "lesson_progress"("courseProgressId");

-- Crear foreign key para lesson_progress
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_courseProgressId_fkey" FOREIGN KEY ("courseProgressId") REFERENCES "course_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Agregar comentarios para documentación
COMMENT ON TABLE "course_progress" IS 'Progreso optimizado para todos los cursos con métricas avanzadas';
COMMENT ON TABLE "lesson_progress" IS 'Progreso detallado por lección (opcional para cursos que lo requieran)';
COMMENT ON COLUMN "course_progress"."totalTimeSpent" IS 'Tiempo total en minutos';
COMMENT ON COLUMN "course_progress"."averageSessionTime" IS 'Tiempo promedio de sesión en minutos';
COMMENT ON COLUMN "course_progress"."longestSession" IS 'Sesión más larga en minutos';
COMMENT ON COLUMN "course_progress"."courseSpecificData" IS 'Datos específicos del curso en formato JSON';
COMMENT ON COLUMN "lesson_progress"."timeSpent" IS 'Tiempo invertido en la lección en minutos';
COMMENT ON COLUMN "lesson_progress"."lessonSpecificData" IS 'Datos específicos de la lección en formato JSON'; 