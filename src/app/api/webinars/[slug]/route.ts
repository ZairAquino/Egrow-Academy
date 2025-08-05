import { NextRequest, NextResponse } from 'next/server';
import { getWebinarBySlug } from '@/lib/webinar';

interface WebinarSlugParams {
  params: { slug: string };
}

// GET /api/webinars/[slug] - Obtener un webinar específico
export async function GET(request: NextRequest, { params }: WebinarSlugParams) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug requerido' },
        { status: 400 }
      );
    }

    const webinar = await getWebinarBySlug(slug);

    if (!webinar) {
      return NextResponse.json(
        { success: false, message: 'Webinar no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      webinar
    });
  } catch (error) {
    console.error('Error getting webinar by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener webinar' },
      { status: 500 }
    );
  }
} 