import { prisma } from './prisma';

export interface UserBehaviorData {
  userId: string;
  action: 'view_course' | 'enroll_course' | 'complete_lesson' | 'search' | 'download_resource' | 'view_resource' | 'rate_course' | 'share_course';
  targetId?: string;
  targetType?: 'course' | 'lesson' | 'resource' | 'search_query';
  metadata?: Record<string, any>;
}

export interface UserPreferenceData {
  userId: string;
  interests?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  learningGoals?: string[];
  preferredTopics?: string[];
}

export class UserBehaviorTracker {
  /**
   * Registra una acción del usuario
   */
  static async trackBehavior(data: UserBehaviorData) {
    try {
      await prisma.userBehavior.create({
        data: {
          userId: data.userId,
          action: data.action,
          targetId: data.targetId,
          targetType: data.targetType,
          metadata: data.metadata || {},
        },
      });
    } catch (error) {
      console.error('Error tracking user behavior:', error);
    }
  }

  /**
   * Actualiza o crea preferencias del usuario
   */
  static async updatePreferences(data: UserPreferenceData) {
    try {
      await prisma.userPreference.upsert({
        where: { userId: data.userId },
        update: {
          interests: data.interests,
          skillLevel: data.skillLevel,
          learningGoals: data.learningGoals,
          preferredTopics: data.preferredTopics,
          updatedAt: new Date(),
        },
        create: {
          userId: data.userId,
          interests: data.interests || [],
          skillLevel: data.skillLevel,
          learningGoals: data.learningGoals || [],
          preferredTopics: data.preferredTopics || [],
        },
      });
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  }

  /**
   * Obtiene el historial de comportamiento del usuario
   */
  static async getUserBehavior(userId: string, limit = 50) {
    try {
      return await prisma.userBehavior.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting user behavior:', error);
      return [];
    }
  }

  /**
   * Obtiene las preferencias del usuario
   */
  static async getUserPreferences(userId: string) {
    try {
      return await prisma.userPreference.findUnique({
        where: { userId },
      });
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  /**
   * Analiza el comportamiento del usuario para generar insights
   */
  static async analyzeUserBehavior(userId: string) {
    try {
      const behaviors = await this.getUserBehavior(userId, 100);
      
      const analysis = {
        totalActions: behaviors.length,
        actionCounts: {} as Record<string, number>,
        recentInterests: [] as string[],
        skillLevel: 'beginner' as string,
        learningPattern: {} as Record<string, any>,
      };

      // Contar acciones
      behaviors.forEach(behavior => {
        analysis.actionCounts[behavior.action] = (analysis.actionCounts[behavior.action] || 0) + 1;
      });

      // Analizar intereses recientes
      const courseViews = behaviors.filter(b => b.action === 'view_course' && b.targetType === 'course');
      const recentCourses = courseViews.slice(0, 5);
      
      if (recentCourses.length > 0) {
        // Aquí podrías obtener los títulos de los cursos para determinar intereses
        analysis.recentInterests = recentCourses.map(b => b.targetId || '').filter(Boolean);
      }

      // Determinar nivel de habilidad basado en comportamiento
      const completedLessons = analysis.actionCounts['complete_lesson'] || 0;
      const enrolledCourses = analysis.actionCounts['enroll_course'] || 0;
      
      if (completedLessons > 20 && enrolledCourses > 5) {
        analysis.skillLevel = 'advanced';
      } else if (completedLessons > 10 && enrolledCourses > 2) {
        analysis.skillLevel = 'intermediate';
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return null;
    }
  }
} 