import { NextRequest, NextResponse } from 'next/server';
import { registerToWebinar, getWebinarBySlug } from '@/lib/webinar';
import { RegisterWebinarData } from '@/types/webinar';

interface WebinarRegisterParams {
  params: { slug: string };
}

// POST /api/webinars/[slug]/register - Registrar a un webinar
export async function POST(request: NextRequest, { params }: WebinarRegisterParams) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    // Validaciones básicas
    if (!body.email || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos (email, firstName, lastName)' },
        { status: 400 }
      );
    }

    // Obtener el webinar por slug para obtener el ID
    const webinar = await getWebinarBySlug(slug);
    
    if (!webinar) {
      return NextResponse.json(
        { success: false, message: 'Webinar no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para el registro
    const registrationData: RegisterWebinarData = {
      webinarId: webinar.id,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      questions: body.questions,
      userId: body.userId // opcional, para usuarios registrados
    };

    const result = await registerToWebinar(registrationData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        registration: result.registration
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error registering to webinar:', error);
    return NextResponse.json(
      { success: false, message: 'Error al registrar al webinar' },
      { status: 500 }
    );
  }
} 