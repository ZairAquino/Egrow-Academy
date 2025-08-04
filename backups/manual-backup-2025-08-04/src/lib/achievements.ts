import { prisma } from './prisma';

export interface Achievement {
  id: string;
  userId: string;
  type: 'lesson_completed' | 'course_completed' | 'streak' | 'milestone' | 'certificate' | 'first_course';
  title: string;
  description: string;
  points: number;
  badge?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ProgressData {
  userId: string;
  courseId?: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentage: number;
  streak: number;
  totalPoints: number;
  achievements: Achievement[];
}

export class AchievementService {
  /**
   * Verifica y otorga logros basados en el progreso del usuario
   */
  static async checkAndAwardAchievements(userId: string, action: string, metadata?: Record<string, any>) {
    try {
      const achievements = [];

      // Obtener progreso actual del usuario
      const userProgress = await this.getUserProgress(userId);
      
      // Verificar logros de lecciones completadas
      if (action === 'complete_lesson') {
        const lessonAchievements = await this.checkLessonAchievements(userId, userProgress);
        achievements.push(...lessonAchievements);
      }

      // Verificar logros de cursos completados
      if (action === 'complete_course') {
        const courseAchievements = await this.checkCourseAchievements(userId, userProgress);
        achievements.push(...courseAchievements);
      }

      // Verificar logros de racha
      const streakAchievements = await this.checkStreakAchievements(userId, userProgress);
      achievements.push(...streakAchievements);

      // Verificar logros de hitos
      const milestoneAchievements = await this.checkMilestoneAchievements(userId, userProgress);
      achievements.push(...milestoneAchievements);

      return achievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  /**
   * Verifica logros relacionados con lecciones
   */
  private static async checkLessonAchievements(userId: string, progress: ProgressData): Promise<Achievement[]> {
    const achievements = [];

    // Logro por primera lección completada
    if (progress.lessonsCompleted === 1) {
      const exists = await prisma.achievement.findFirst({
        where: {
          userId,
          type: 'first_course',
        },
      });

      if (!exists) {
        const achievement = await prisma.achievement.create({
          data: {
            userId,
            type: 'first_course',
            title: 'Primer Paso',
            description: 'Completaste tu primera lección',
            points: 10,
            badge: '🌱 Novato',
            metadata: { lessonCount: 1 },
          },
        });
        achievements.push(achievement);
      }
    }

    // Logros por número de lecciones
    const lessonMilestones = [5, 10, 25, 50, 100];
    for (const milestone of lessonMilestones) {
      if (progress.lessonsCompleted === milestone) {
        const exists = await prisma.achievement.findFirst({
          where: {
            userId,
            type: 'milestone',
            metadata: { lessonCount: milestone },
          },
        });

        if (!exists) {
          const titles = {
            5: 'Aprendiz Dedicado',
            10: 'Estudiante Constante',
            25: 'Aprendiz Avanzado',
            50: 'Maestro en Formación',
            100: 'Experto Académico',
          };

          const badges = {
            5: '📚 Estudiante',
            10: '🎯 Dedicado',
            25: '🏆 Avanzado',
            50: '👑 Maestro',
            100: '💎 Experto',
          };

          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: 'milestone',
              title: titles[milestone as keyof typeof titles],
              description: `Completaste ${milestone} lecciones`,
              points: milestone * 2,
              badge: badges[milestone as keyof typeof badges],
              metadata: { lessonCount: milestone },
            },
          });
          achievements.push(achievement);
        }
      }
    }

    return achievements;
  }

  /**
   * Verifica logros relacionados con cursos
   */
  private static async checkCourseAchievements(userId: string, progress: ProgressData): Promise<Achievement[]> {
    const achievements = [];

    // Contar cursos completados
    const completedCourses = await prisma.courseEnrollment.count({
      where: {
        userId,
        status: 'completed',
      },
    });

    // Logro por primer curso completado
    if (completedCourses === 1) {
      const exists = await prisma.achievement.findFirst({
        where: {
          userId,
          type: 'course_completed',
          metadata: { courseCount: 1 },
        },
      });

      if (!exists) {
        const achievement = await prisma.achievement.create({
          data: {
            userId,
            type: 'course_completed',
            title: 'Primer Curso Completado',
            description: 'Terminaste tu primer curso completo',
            points: 50,
            badge: '🎓 Graduado',
            metadata: { courseCount: 1 },
          },
        });
        achievements.push(achievement);
      }
    }

    // Logros por número de cursos
    const courseMilestones = [3, 5, 10, 20];
    for (const milestone of courseMilestones) {
      if (completedCourses === milestone) {
        const exists = await prisma.achievement.findFirst({
          where: {
            userId,
            type: 'course_completed',
            metadata: { courseCount: milestone },
          },
        });

        if (!exists) {
          const titles = {
            3: 'Trilogía Completada',
            5: 'Pentágono del Conocimiento',
            10: 'Década de Sabiduría',
            20: 'Biblioteca Personal',
          };

          const badges = {
            3: '📖 Trilogía',
            5: '⭐ Pentágono',
            10: '🏛️ Década',
            20: '📚 Biblioteca',
          };

          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: 'course_completed',
              title: titles[milestone as keyof typeof titles],
              description: `Completaste ${milestone} cursos`,
              points: milestone * 25,
              badge: badges[milestone as keyof typeof badges],
              metadata: { courseCount: milestone },
            },
          });
          achievements.push(achievement);
        }
      }
    }

    return achievements;
  }

  /**
   * Verifica logros de racha
   */
  private static async checkStreakAchievements(userId: string, progress: ProgressData): Promise<Achievement[]> {
    const achievements = [];

    const streakMilestones = [3, 7, 14, 30, 100];
    for (const milestone of streakMilestones) {
      if (progress.streak === milestone) {
        const exists = await prisma.achievement.findFirst({
          where: {
            userId,
            type: 'streak',
            metadata: { streakCount: milestone },
          },
        });

        if (!exists) {
          const titles = {
            3: 'Racha Inicial',
            7: 'Semana de Éxito',
            14: 'Quincena de Constancia',
            30: 'Mes de Dedicación',
            100: 'Centenario de Aprendizaje',
          };

          const badges = {
            3: '🔥 Inicio',
            7: '📅 Semana',
            14: '⏰ Quincena',
            30: '📆 Mes',
            100: '💯 Centenario',
          };

          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: 'streak',
              title: titles[milestone as keyof typeof titles],
              description: `${milestone} días consecutivos aprendiendo`,
              points: milestone * 5,
              badge: badges[milestone as keyof typeof badges],
              metadata: { streakCount: milestone },
            },
          });
          achievements.push(achievement);
        }
      }
    }

    return achievements;
  }

  /**
   * Verifica logros de hitos generales
   */
  private static async checkMilestoneAchievements(userId: string, progress: ProgressData): Promise<Achievement[]> {
    const achievements = [];

    // Logro por puntos totales
    const pointMilestones = [100, 500, 1000, 2500, 5000];
    for (const milestone of pointMilestones) {
      if (progress.totalPoints >= milestone) {
        const exists = await prisma.achievement.findFirst({
          where: {
            userId,
            type: 'milestone',
            metadata: { pointCount: milestone },
          },
        });

        if (!exists) {
          const titles = {
            100: 'Puntos Básicos',
            500: 'Puntos Intermedios',
            1000: 'Puntos Avanzados',
            2500: 'Puntos Expertos',
            5000: 'Puntos Maestros',
          };

          const badges = {
            100: '💎 Básico',
            500: '💎💎 Intermedio',
            1000: '💎💎💎 Avanzado',
            2500: '💎💎💎💎 Experto',
            5000: '💎💎💎💎💎 Maestro',
          };

          const achievement = await prisma.achievement.create({
            data: {
              userId,
              type: 'milestone',
              title: titles[milestone as keyof typeof titles],
              description: `Acumulaste ${milestone} puntos`,
              points: 0, // No dar puntos por logro de puntos
              badge: badges[milestone as keyof typeof badges],
              metadata: { pointCount: milestone },
            },
          });
          achievements.push(achievement);
        }
      }
    }

    return achievements;
  }

  /**
   * Obtiene el progreso completo del usuario
   */
  static async getUserProgress(userId: string): Promise<ProgressData> {
    // Contar lecciones completadas
    const lessonsCompleted = await prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
      },
    });

    // Contar total de lecciones disponibles
    const totalLessons = await prisma.lesson.count();

    // Calcular racha actual
    const streak = await this.calculateStreak(userId);

    // Calcular puntos totales
    const achievements = await prisma.achievement.findMany({
      where: { userId },
    });

    const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

    const percentage = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

    return {
      userId,
      lessonsCompleted,
      totalLessons,
      percentage,
      streak,
      totalPoints,
      achievements,
    };
  }

  /**
   * Calcula la racha actual del usuario
   */
  private static async calculateStreak(userId: string): Promise<number> {
    const recentActivity = await prisma.lessonProgress.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 30, // Últimos 30 días
    });

    if (recentActivity.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const hasActivity = recentActivity.some(activity => {
        const activityDate = new Date(activity.updatedAt);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === checkDate.getTime();
      });

      if (hasActivity) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Registra una acción del usuario y verifica logros
   */
  static async recordUserAction(userId: string, action: string, metadata?: Record<string, any>) {
    try {
      // Registrar la acción
      await prisma.userBehavior.create({
        data: {
          userId,
          action,
          metadata,
        },
      });

      // Verificar logros
      const achievements = await this.checkAndAwardAchievements(userId, action, metadata);

      return achievements;
    } catch (error) {
      console.error('Error recording user action:', error);
      return [];
    }
  }
} 