import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CourseCategory, CourseStatus } from '@prisma/client';

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug || 'draft';
  if (!slug) slug = 'draft';
  let counter = 1;
  // Ensure minimal length
  if (slug.length < 3) slug = `draft-${Date.now()}`;
  // Try unique
  while (true) {
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const data = (body?.data || {}) as any;
    const providedId: string | null = body?.id || null;
    const providedSlug: string | undefined = body?.slug;

    // Build base fields
    const baseTitle: string = typeof data.title === 'string' ? data.title : '';
    const baseSlug = slugify(baseTitle || (providedSlug as string) || `draft-${Date.now()}`);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Upsert draft course with minimal required fields
    let existing = null as any;
    if (providedId) {
      existing = await prisma.course.findUnique({ where: { id: providedId } });
    }
    if (!existing) {
      existing = await prisma.course.findUnique({ where: { slug: uniqueSlug } });
    }

    const payload: any = {
      title: baseTitle || 'Borrador sin título',
      slug: existing?.slug || uniqueSlug,
      description: typeof data.description === 'string' ? data.description : null,
      shortDescription: typeof data.shortDescription === 'string' ? data.shortDescription : null,
      imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : null,
      price: typeof data.price === 'number' && !Number.isNaN(data.price) ? data.price : 0,
      category: (data.category as CourseCategory) || 'HABILIDADES_IRREMPLAZABLES',
      difficulty: data.difficulty || null,
      durationHours: typeof data.durationHours === 'number' ? data.durationHours : null,
      status: 'DRAFT' as CourseStatus,
    };

    const course = existing
      ? await prisma.course.update({ where: { id: existing.id }, data: payload })
      : await prisma.course.create({ data: payload });

    return NextResponse.json({ success: true, course: { id: course.id, slug: course.slug, status: course.status } });
  } catch (error) {
    console.error('[drafts] error:', error);
    return NextResponse.json({ success: false, error: 'Error guardando borrador' }, { status: 500 });
  }
}


