import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 [TEST-RESOURCES] Probando conexión...');
    
    // Prueba básica de conexión
    const count = await prisma.resource.count();
    console.log(`✅ [TEST-RESOURCES] Total recursos: ${count}`);
    
    // Obtener un recurso simple
    const firstResource = await prisma.resource.findFirst({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true
      }
    });
    
    console.log('✅ [TEST-RESOURCES] Primer recurso:', firstResource);
    
    return NextResponse.json({
      success: true,
      count,
      firstResource
    });
    
  } catch (error) {
    console.error('❌ [TEST-RESOURCES] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}