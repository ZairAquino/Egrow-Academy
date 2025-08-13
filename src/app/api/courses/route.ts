import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Obteniendo cursos de la base de datos...');
    
    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.warn('⚠️ Database connection issue, returning empty courses list');
      return NextResponse.json({ 
        courses: [],
        total: 0,
        warning: 'Database temporarily unavailable'
      });
    }
    
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Cursos encontrados: ${courses.length}`);

    return NextResponse.json({ 
      courses,
      total: courses.length 
    });

  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    
    // Return empty array instead of error to allow fallback
    return NextResponse.json({ 
      courses: [],
      total: 0,
      warning: 'Could not fetch courses from database'
    });
  } finally {
    // Prisma maneja automáticamente las conexiones en Next.js
    console.log('✅ Operación completada');
  }
} 