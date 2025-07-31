import { prisma } from './prisma';
import { UserBehaviorTracker } from './user-behavior';

export interface RecommendationItem {
  id: string;
  type: 'course' | 'resource' | 'event';
  title: string;
  description: string;
  image?: string;
  score: number;
  reason: string;
  url: string;
}

export class RecommendationEngine {
  /**
   * Genera recomendaciones personalizadas para un usuario
   */
  static async generateRecommendations(userId: string, limit = 6): Promise<RecommendationItem[]> {
    try {
      // Obtener análisis del comportamiento del usuario
      const behaviorAnalysis = await UserBehaviorTracker.analyzeUserBehavior(userId);
      const userPreferences = await UserBehaviorTracker.getUserPreferences(userId);
      
      if (!behaviorAnalysis) {
        return this.getDefaultRecommendations(limit);
      }

      const recommendations: RecommendationItem[] = [];

      // 1. Recomendaciones basadas en cursos vistos recientemente
      const courseRecommendations = await this.getCourseRecommendations(userId, behaviorAnalysis);
      recommendations.push(...courseRecommendations);

      // 2. Recomendaciones basadas en nivel de habilidad
      const skillBasedRecommendations = await this.getSkillBasedRecommendations(behaviorAnalysis.skillLevel);
      recommendations.push(...skillBasedRecommendations);

      // 3. Recomendaciones basadas en preferencias explícitas
      if (userPreferences) {
        const preferenceRecommendations = await this.getPreferenceBasedRecommendations(userPreferences);
        recommendations.push(...preferenceRecommendations);
      }

      // 4. Recomendaciones de recursos relacionados
      const resourceRecommendations = await this.getResourceRecommendations(userId, behaviorAnalysis);
      recommendations.push(...resourceRecommendations);

      // Ordenar por score y eliminar duplicados
      const uniqueRecommendations = this.removeDuplicates(recommendations);
      const sortedRecommendations = uniqueRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      // Guardar recomendaciones en la base de datos
      await this.saveRecommendations(userId, sortedRecommendations);

      return sortedRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getDefaultRecommendations(limit);
    }
  }

  /**
   * Obtiene recomendaciones de cursos basadas en comportamiento
   */
  private static async getCourseRecommendations(userId: string, analysis: any): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      // Obtener cursos que el usuario no ha visto
      const viewedCourses = await prisma.userBehavior.findMany({
        where: {
          userId,
          action: 'view_course',
          targetType: 'course',
        },
        select: { targetId: true },
      });

      const viewedCourseIds = viewedCourses.map(b => b.targetId).filter(Boolean);

      // Buscar cursos similares
      const availableCourses = await prisma.course.findMany({
        where: {
          status: 'PUBLISHED',
          id: { notIn: viewedCourseIds },
        },
        take: 10,
      });

      for (const course of availableCourses) {
        let score = 0.5; // Score base
        let reason = 'Curso recomendado para ti';

        // Ajustar score basado en categorías de interés
        if (analysis.recentInterests.length > 0) {
          // Aquí podrías implementar lógica más sofisticada de matching
          score += 0.2;
          reason = 'Basado en tus intereses recientes';
        }

        // Ajustar por nivel de dificultad
        if (analysis.skillLevel === 'beginner' && course.difficulty === 'BEGINNER') {
          score += 0.3;
          reason = 'Perfecto para tu nivel actual';
        } else if (analysis.skillLevel === 'advanced' && course.difficulty === 'ADVANCED') {
          score += 0.3;
          reason = 'Desafío adecuado para tu nivel';
        }

        recommendations.push({
          id: course.id,
          type: 'course',
          title: course.title,
          description: course.description || '',
          image: course.imageUrl || '',
          score: Math.min(score, 1.0),
          reason,
          url: `/curso/${course.slug}`,
        });
      }
    } catch (error) {
      console.error('Error getting course recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Obtiene recomendaciones basadas en nivel de habilidad
   */
  private static async getSkillBasedRecommendations(skillLevel: string): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      const courses = await prisma.course.findMany({
        where: {
          status: 'PUBLISHED',
          difficulty: skillLevel.toUpperCase() as any,
        },
        take: 5,
      });

      for (const course of courses) {
        recommendations.push({
          id: course.id,
          type: 'course',
          title: course.title,
          description: course.description || '',
          image: course.imageUrl || '',
          score: 0.7,
          reason: `Ideal para tu nivel ${skillLevel}`,
          url: `/curso/${course.slug}`,
        });
      }
    } catch (error) {
      console.error('Error getting skill-based recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Obtiene recomendaciones basadas en preferencias explícitas
   */
  private static async getPreferenceBasedRecommendations(preferences: any): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      if (preferences.interests && preferences.interests.length > 0) {
        // Buscar recursos relacionados con intereses
        const resources = await prisma.resource.findMany({
          where: {
            status: 'PUBLISHED',
            category: { in: preferences.interests },
          },
          take: 3,
        });

        for (const resource of resources) {
          recommendations.push({
            id: resource.id,
            type: 'resource',
            title: resource.title,
            description: resource.description || '',
            image: resource.imageUrl || '',
            score: 0.8,
            reason: `Relacionado con tu interés en ${resource.category}`,
            url: `/resources/${resource.slug}`,
          });
        }
      }
    } catch (error) {
      console.error('Error getting preference-based recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Obtiene recomendaciones de recursos
   */
  private static async getResourceRecommendations(userId: string, analysis: any): Promise<RecommendationItem[]> {
    const recommendations: RecommendationItem[] = [];
    
    try {
      const resources = await prisma.resource.findMany({
        where: {
          status: 'PUBLISHED',
        },
        take: 5,
      });

      for (const resource of resources) {
        let score = 0.5;
        let reason = 'Recurso útil para tu aprendizaje';

        // Ajustar score basado en comportamiento
        if (analysis.actionCounts['download_resource'] > 0) {
          score += 0.2;
          reason = 'Basado en tu interés en recursos';
        }

        recommendations.push({
          id: resource.id,
          type: 'resource',
          title: resource.title,
          description: resource.description || '',
          image: resource.imageUrl || '',
          score: Math.min(score, 1.0),
          reason,
          url: `/resources/${resource.slug}`,
        });
      }
    } catch (error) {
      console.error('Error getting resource recommendations:', error);
    }

    return recommendations;
  }

  /**
   * Obtiene recomendaciones por defecto
   */
  private static async getDefaultRecommendations(limit: number): Promise<RecommendationItem[]> {
    try {
      const courses = await prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return courses.map(course => ({
        id: course.id,
        type: 'course',
        title: course.title,
        description: course.description || '',
        image: course.imageUrl || '',
        score: 0.5,
        reason: 'Curso popular',
        url: `/curso/${course.slug}`,
      }));
    } catch (error) {
      console.error('Error getting default recommendations:', error);
      return [];
    }
  }

  /**
   * Elimina duplicados de recomendaciones
   */
  private static removeDuplicates(recommendations: RecommendationItem[]): RecommendationItem[] {
    const seen = new Set();
    return recommendations.filter(item => {
      const key = `${item.type}-${item.id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Guarda recomendaciones en la base de datos
   */
  private static async saveRecommendations(userId: string, recommendations: RecommendationItem[]) {
    try {
      // Eliminar recomendaciones anteriores
      await prisma.recommendation.deleteMany({
        where: { userId },
      });

      // Guardar nuevas recomendaciones
      const recommendationData = recommendations.map(rec => ({
        userId,
        targetId: rec.id,
        targetType: rec.type,
        score: rec.score,
        reason: rec.reason,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      }));

      await prisma.recommendation.createMany({
        data: recommendationData,
      });
    } catch (error) {
      console.error('Error saving recommendations:', error);
    }
  }
} 