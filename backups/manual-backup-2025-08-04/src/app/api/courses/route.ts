import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Obteniendo cursos de la base de datos...');
    
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
    
    // Proporcionar información más detallada del error
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorCode = error instanceof Error && 'code' in error ? (error as any).code : 'UNKNOWN';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: errorMessage,
        code: errorCode,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    // Prisma maneja automáticamente las conexiones en Next.js
    console.log('✅ Operación completada');
  }
} 