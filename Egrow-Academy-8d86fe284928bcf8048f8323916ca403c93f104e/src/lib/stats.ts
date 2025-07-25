import { prisma } from './prisma';

export async function getStats() {
  try {
    const [
      totalCourses,
      freeCourses,
      totalUsers,
      totalEnrollments
    ] = await Promise.all([
      // Total de cursos
      prisma.course.count({
        where: {
          status: 'PUBLISHED'
        }
      }),
      // Cursos gratuitos
      prisma.course.count({
        where: {
          isFree: true,
          status: 'PUBLISHED'
        }
      }),
      // Total de usuarios
      prisma.user.count(),
      // Total de enrollments
      prisma.enrollment.count()
    ]);

    return {
      totalCourses,
      freeCourses,
      totalUsers,
      totalEnrollments
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback data en caso de error
    return {
      totalCourses: 15,
      freeCourses: 8,
      totalUsers: 2500,
      totalEnrollments: 1200
    };
  }
}