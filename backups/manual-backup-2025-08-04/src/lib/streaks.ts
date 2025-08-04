import { prisma } from '@/lib/prisma';
import { StreakBadgeLevel, PointTransactionType } from '@prisma/client';

/**
 * 🎯 Sistema de Rachas y Gamificación
 * Maneja el conteo de lecciones, rachas y puntos del usuario
 */

// Configuración del sistema
export const STREAK_CONFIG = {
  WEEKLY_GOAL: 5, // Meta mínima de lecciones por semana
  POINTS: {
    WEEKLY_GOAL_BASE: 5,      // Puntos por completar meta mínima
    WEEKLY_GOAL_BONUS: 10,    // Puntos por hacer más de 5 lecciones
    EXTRA_LESSONS_7: 2,       // Bonus por 7+ lecciones
    EXTRA_LESSONS_10: 5,      // Bonus por 10+ lecciones
    DIVERSITY_BONUS: 2,       // Bonus por usar 3+ cursos diferentes
    STREAK_2_WEEKS: 3,        // Bonus por mantener 2 semanas
    STREAK_4_WEEKS: 5,        // Bonus por mantener 4 semanas
    STREAK_8_WEEKS: 10,       // Bonus por mantener 8 semanas
    STREAK_12_WEEKS: 15,      // Bonus por mantener 12+ semanas
  },
  RECOVERY_COSTS: {
    PRINCIPIANTE: 10,
    ESTUDIANTE: 20,
    DEDICADO: 35,
    EN_LLAMAS: 60,
    IMPARABLE: 100,
    MAESTRO: 200,
    LEYENDA: 500,
  },
  BADGE_REQUIREMENTS: {
    PRINCIPIANTE: 1,   // 1 semana
    ESTUDIANTE: 2,     // 2 semanas consecutivas
    DEDICADO: 4,       // 4 semanas consecutivas
    EN_LLAMAS: 8,      // 8 semanas consecutivas
    IMPARABLE: 12,     // 12 semanas consecutivas
    MAESTRO: 24,       // 24 semanas consecutivas
    LEYENDA: 52,       // 52 semanas consecutivas (1 año)
  }
};

/**
 * Obtiene el inicio de la semana (lunes) para una fecha dada
 */
export function getWeekStart(date: Date = new Date()): Date {
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo (0), retroceder 6 días
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Obtiene el final de la semana (domingo) para una fecha dada
 */
export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Registra una lección completada y actualiza las rachas
 */
export async function recordLessonCompletion(
  userId: string,
  courseId: string,
  lessonNumber: number,
  lessonTitle: string
) {
  try {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = getWeekEnd(now);

    // 1. Actualizar el contador de lecciones de la semana actual
    await prisma.weeklyLessonCompletion.upsert({
      where: {
        weekly_lesson_completions_unique: {
          userId,
          weekStart,
          courseId,
        }
      },
      update: {
        lessonsCompletedInWeek: {
          increment: 1
        },
        lastLessonAt: now,
        updatedAt: now,
      },
      create: {
        userId,
        weekStart,
        courseId,
        lessonsCompletedInWeek: 1,
        lastLessonAt: now,
      }
    });

    // 2. Calcular totales de la semana actual
    const weeklyTotals = await prisma.weeklyLessonCompletion.aggregate({
      where: {
        userId,
        weekStart,
      },
      _sum: {
        lessonsCompletedInWeek: true,
      },
      _count: {
        courseId: true, // Número de cursos diferentes
      }
    });

    const totalLessonsThisWeek = weeklyTotals._sum.lessonsCompletedInWeek || 0;
    const coursesUsedThisWeek = weeklyTotals._count.courseId || 0;

    // 3. Actualizar o crear el registro de racha del usuario
    const currentStreak = await updateUserStreak(
      userId,
      weekStart,
      totalLessonsThisWeek,
      coursesUsedThisWeek
    );

    // 4. Verificar y otorgar badges si es necesario
    await checkAndAwardBadges(userId, currentStreak.currentStreak);

    return {
      success: true,
      totalLessonsThisWeek,
      coursesUsedThisWeek,
      currentStreak: currentStreak.currentStreak,
      weekProgress: `${totalLessonsThisWeek}/${STREAK_CONFIG.WEEKLY_GOAL}`,
      goalMet: totalLessonsThisWeek >= STREAK_CONFIG.WEEKLY_GOAL,
    };

  } catch (error) {
    console.error('Error recording lesson completion:', error);
    throw new Error('Failed to record lesson completion');
  }
}

/**
 * Actualiza el registro de racha del usuario para la semana actual
 */
async function updateUserStreak(
  userId: string,
  weekStart: Date,
  totalLessonsThisWeek: number,
  coursesUsedThisWeek: number
) {
  // Obtener o crear el registro de racha para esta semana
  const existingStreak = await prisma.userStreak.findUnique({
    where: {
      user_streaks_unique_user_week: {
        userId,
        weekStartDate: weekStart,
      }
    }
  });

  // Obtener la racha más reciente (semana anterior)
  const previousStreak = await prisma.userStreak.findFirst({
    where: {
      userId,
      weekStartDate: {
        lt: weekStart,
      }
    },
    orderBy: {
      weekStartDate: 'desc',
    }
  });

  const isGoalMet = totalLessonsThisWeek >= STREAK_CONFIG.WEEKLY_GOAL;
  let newCurrentStreak = 0;
  let newLongestStreak = previousStreak?.longestStreak || 0;

  // Calcular la racha actual
  if (isGoalMet) {
    if (previousStreak && wasGoalMetLastWeek(previousStreak)) {
      newCurrentStreak = previousStreak.currentStreak + 1;
    } else {
      newCurrentStreak = 1; // Nueva racha
    }
    
    // Actualizar racha más larga si es necesario
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }
  } else {
    newCurrentStreak = 0; // Racha rota
  }

  // Calcular puntos ganados esta semana
  const pointsEarned = calculateWeeklyPoints(
    totalLessonsThisWeek,
    coursesUsedThisWeek,
    newCurrentStreak
  );

  // Actualizar o crear el registro
  const updatedStreak = await prisma.userStreak.upsert({
    where: {
      user_streaks_unique_user_week: {
        userId,
        weekStartDate: weekStart,
      }
    },
    update: {
      currentWeekLessons: totalLessonsThisWeek,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      isCurrentWeekComplete: isGoalMet,
      lastLessonCompletedAt: new Date(),
      totalPoints: {
        increment: pointsEarned - (existingStreak?.lifetimePointsEarned || 0)
      },
      lifetimePointsEarned: {
        increment: pointsEarned - (existingStreak?.lifetimePointsEarned || 0)
      },
      updatedAt: new Date(),
    },
    create: {
      userId,
      weekStartDate: weekStart,
      currentWeekLessons: totalLessonsThisWeek,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      totalPoints: pointsEarned,
      lifetimePointsEarned: pointsEarned,
      isCurrentWeekComplete: isGoalMet,
      lastLessonCompletedAt: new Date(),
    }
  });

  // Registrar transacción de puntos si se ganaron puntos
  if (pointsEarned > 0) {
    await recordPointsTransaction(
      userId,
      pointsEarned,
      'WEEKLY_GOAL',
      `Lecciones completadas: ${totalLessonsThisWeek}, Cursos: ${coursesUsedThisWeek}`,
      weekStart,
      totalLessonsThisWeek,
      coursesUsedThisWeek
    );
  }

  return updatedStreak;
}

/**
 * Verifica si la meta se cumplió la semana pasada
 */
function wasGoalMetLastWeek(previousStreak: any): boolean {
  return previousStreak.isCurrentWeekComplete;
}

/**
 * Calcula los puntos ganados en una semana basado en la configuración
 */
export function calculateWeeklyPoints(
  lessonsCompleted: number,
  coursesUsed: number,
  streakCount: number
): number {
  if (lessonsCompleted < STREAK_CONFIG.WEEKLY_GOAL) {
    return 0; // No cumplió la meta mínima
  }

  let totalPoints = 0;

  // Puntos base
  if (lessonsCompleted >= STREAK_CONFIG.WEEKLY_GOAL) {
    if (lessonsCompleted >= 6) {
      totalPoints += STREAK_CONFIG.POINTS.WEEKLY_GOAL_BONUS; // 10 puntos total
    } else {
      totalPoints += STREAK_CONFIG.POINTS.WEEKLY_GOAL_BASE; // 5 puntos por meta mínima
    }
  }

  // Bonus por lecciones extra
  if (lessonsCompleted >= 7) {
    totalPoints += STREAK_CONFIG.POINTS.EXTRA_LESSONS_7;
  }
  
  if (lessonsCompleted >= 10) {
    totalPoints += STREAK_CONFIG.POINTS.EXTRA_LESSONS_10;
  }

  // Bonus por diversidad de cursos
  if (coursesUsed >= 3) {
    totalPoints += STREAK_CONFIG.POINTS.DIVERSITY_BONUS;
  }

  // Bonus por mantener racha
  if (streakCount >= 2) {
    totalPoints += STREAK_CONFIG.POINTS.STREAK_2_WEEKS;
  }
  
  if (streakCount >= 4) {
    totalPoints += STREAK_CONFIG.POINTS.STREAK_4_WEEKS;
  }
  
  if (streakCount >= 8) {
    totalPoints += STREAK_CONFIG.POINTS.STREAK_8_WEEKS;
  }
  
  if (streakCount >= 12) {
    totalPoints += STREAK_CONFIG.POINTS.STREAK_12_WEEKS;
  }

  return totalPoints;
}

/**
 * Registra una transacción de puntos
 */
async function recordPointsTransaction(
  userId: string,
  pointsEarned: number,
  transactionType: PointTransactionType,
  reason: string,
  weekStart?: Date,
  lessonsCompleted?: number,
  coursesUsed?: number
) {
  await prisma.userPointsHistory.create({
    data: {
      userId,
      pointsEarned,
      transactionType,
      reason,
      weekStart,
      lessonsCompleted,
      coursesUsed,
    }
  });
}

/**
 * Verifica y otorga badges basado en la racha actual
 */
async function checkAndAwardBadges(userId: string, currentStreak: number) {
  const badgesToCheck: Array<{ level: StreakBadgeLevel; requirement: number }> = [
    { level: 'PRINCIPIANTE', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.PRINCIPIANTE },
    { level: 'ESTUDIANTE', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.ESTUDIANTE },
    { level: 'DEDICADO', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.DEDICADO },
    { level: 'EN_LLAMAS', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.EN_LLAMAS },
    { level: 'IMPARABLE', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.IMPARABLE },
    { level: 'MAESTRO', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.MAESTRO },
    { level: 'LEYENDA', requirement: STREAK_CONFIG.BADGE_REQUIREMENTS.LEYENDA },
  ];

  for (const badge of badgesToCheck) {
    if (currentStreak >= badge.requirement) {
      // Verificar si ya tiene este badge
      const existingBadge = await prisma.userStreakBadge.findUnique({
        where: {
          user_streak_badges_unique_user_badge: {
            userId,
            badgeLevel: badge.level,
          }
        }
      });

      if (!existingBadge) {
        // Otorgar el badge
        await prisma.userStreakBadge.create({
          data: {
            userId,
            badgeLevel: badge.level,
            streakWhenEarned: currentStreak,
          }
        });
      }
    }
  }
}

/**
 * Obtiene las estadísticas de racha de un usuario
 */
export async function getUserStreakStats(userId: string) {
  const currentWeekStart = getWeekStart();
  
  // Obtener racha actual
  let currentStreak = await prisma.userStreak.findUnique({
    where: {
      user_streaks_unique_user_week: {
        userId,
        weekStartDate: currentWeekStart,
      }
    }
  });

  // Si no existe racha para la semana actual, crearla automáticamente
  if (!currentStreak) {
    // Obtener la racha más reciente (semana anterior)
    const previousStreak = await prisma.userStreak.findFirst({
      where: {
        userId,
        weekStartDate: {
          lt: currentWeekStart,
        }
      },
      orderBy: {
        weekStartDate: 'desc',
      }
    });

    let newCurrentStreak = 0;
    let newLongestStreak = previousStreak?.longestStreak || 0;

    // Si la semana anterior cumplió la meta, mantener la racha
    if (previousStreak && previousStreak.isCurrentWeekComplete) {
      newCurrentStreak = previousStreak.currentStreak;
    }

    // Crear el registro de racha para la semana actual
    currentStreak = await prisma.userStreak.create({
      data: {
        userId,
        weekStartDate: currentWeekStart,
        currentWeekLessons: 0,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalPoints: previousStreak?.totalPoints || 0,
        lifetimePointsEarned: previousStreak?.lifetimePointsEarned || 0,
        isCurrentWeekComplete: false,
      }
    });
  }

  // Obtener todos los badges del usuario
  const badges = await prisma.userStreakBadge.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      earnedAt: 'desc',
    }
  });

  // Obtener racha más larga histórica
  const longestStreakRecord = await prisma.userStreak.findFirst({
    where: { userId },
    orderBy: {
      longestStreak: 'desc',
    }
  });

  const currentWeekLessons = currentStreak?.currentWeekLessons || 0;
  const streakCount = currentStreak?.currentStreak || 0;
  const totalPoints = currentStreak?.totalPoints || 0;
  const longestStreak = longestStreakRecord?.longestStreak || 0;

  // Determinar el badge actual (más alto conseguido)
  const currentBadge = badges.length > 0 ? badges[0] : null;
  
  // Calcular costo de recuperación
  const recoveryCost = currentBadge 
    ? STREAK_CONFIG.RECOVERY_COSTS[currentBadge.badgeLevel]
    : STREAK_CONFIG.RECOVERY_COSTS.PRINCIPIANTE;

  return {
    currentWeekLessons,
    weekProgress: `${currentWeekLessons}/${STREAK_CONFIG.WEEKLY_GOAL}`,
    currentStreak: streakCount,
    longestStreak,
    totalPoints,
    goalMet: currentWeekLessons >= STREAK_CONFIG.WEEKLY_GOAL,
    badges,
    currentBadge,
    recoveryCost,
    canRecover: totalPoints >= recoveryCost && streakCount === 0,
  };
}

/**
 * Usa puntos para recuperar una racha perdida
 */
export async function useStreakRecovery(userId: string, reason?: string) {
  const stats = await getUserStreakStats(userId);
  
  if (!stats.canRecover) {
    throw new Error('Cannot recover streak: insufficient points or no broken streak');
  }

  if (!stats.currentBadge) {
    throw new Error('Cannot recover streak: no badge level found');
  }

  const recoveryCost = stats.recoveryCost;
  
  // Obtener la semana anterior (cuando se perdió la racha)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lastWeekStart = getWeekStart(lastWeek);

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Deducir puntos
      await tx.userStreak.update({
        where: {
          user_streaks_unique_user_week: {
            userId,
            weekStartDate: getWeekStart(),
          }
        },
        data: {
          totalPoints: {
            decrement: recoveryCost,
          },
          pointsSpentOnRecovery: {
            increment: recoveryCost,
          },
          recoveryCount: {
            increment: 1,
          },
          lastRecoveryUsed: new Date(),
        }
      });

      // 2. Registrar transacción de puntos
      await tx.userPointsHistory.create({
        data: {
          userId,
          pointsEarned: -recoveryCost,
          transactionType: 'RECOVERY_SPENT',
          reason: reason || `Streak recovery using ${stats.currentBadge.badgeLevel} level`,
        }
      });

      // 3. Registrar historial de recuperación
      await tx.streakRecoveryHistory.create({
        data: {
          userId,
          pointsSpent: recoveryCost,
          badgeLevel: stats.currentBadge.badgeLevel,
          recoveryReason: reason,
          originalStreakLost: stats.longestStreak,
          weekMissed: lastWeekStart,
        }
      });

      // 4. Restaurar la racha (actualizar la semana actual para continuar la racha)
      await tx.userStreak.upsert({
        where: {
          user_streaks_unique_user_week: {
            userId,
            weekStartDate: getWeekStart(),
          }
        },
        update: {
          currentStreak: 1, // Continuar desde 1
        },
        create: {
          userId,
          weekStartDate: getWeekStart(),
          currentWeekLessons: 0,
          currentStreak: 1,
          longestStreak: stats.longestStreak,
          totalPoints: 0,
          lifetimePointsEarned: 0,
          isCurrentWeekComplete: false,
        }
      });
    });

    return {
      success: true,
      pointsSpent: recoveryCost,
      message: 'Streak recovered successfully!',
    };

  } catch (error) {
    console.error('Error recovering streak:', error);
    throw new Error('Failed to recover streak');
  }
}