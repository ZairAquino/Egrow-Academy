import { NextRequest, NextResponse } from 'next/server';
import { getActiveWebinars, createWebinar } from '@/lib/webinar';
import { CreateWebinarData } from '@/types/webinar';

// GET /api/webinars - Obtener todos los webinars activos
export async function GET() {
  try {
    console.log('🔍 Buscando webinars activos...');
    const webinars = await getActiveWebinars();
    console.log('📋 Webinars encontrados:', webinars.length);
    
    return NextResponse.json({
      success: true,
      webinars
    });
  } catch (error) {
    console.error('Error getting webinars:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener webinars' },
      { status: 500 }
    );
  }
}

// POST /api/webinars - Crear un nuevo webinar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const webinarData: CreateWebinarData = body;

    // Validaciones básicas
    if (!webinarData.title || !webinarData.slug || !webinarData.description) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const result = await createWebinar(webinarData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        webinar: result.webinar
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating webinar:', error);
    return NextResponse.json(
      { success: false, message: 'Error al crear webinar' },
      { status: 500 }
    );
  }
} 