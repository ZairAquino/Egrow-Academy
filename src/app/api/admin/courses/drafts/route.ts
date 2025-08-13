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

    // Construir snapshot y eliminar undefined del JSON (Prisma JSON no acepta undefined)
    const rawSnapshot = {
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      thumbnail: data.imageUrl ?? null,
      introVideo: (data as any).mainVideoUrl ?? null,
      price: typeof data.price === 'number' ? data.price : 0,
      originalPrice: (data as any).originalPrice ?? null,
      isFree: data.price === 0,
      rating: (data as any).rating ?? null,
      studentsCount: (data as any).studentsCount ?? null,
      objectivesLead: (data as any).objectivesLead ?? null,
      learningGoals: (data as any).learningGoals || (data as any).whatYouWillLearn || [],
      tools: (data as any).tools || [],
      prerequisites: (data as any).prerequisites || [],
      modules: (data.modules || []).map((m: any) => ({
        title: m.title,
        description: m.description ?? '',
        lessons: (m.lessons || []).map((l: any) => ({
          title: l.title,
          duration: l.duration ?? 0,
          isFree: l.isFree ?? false,
          videoUrl: l.videoUrl ?? null
        }))
      })),
      instructor: {
        name: (data.instructor as any)?.name ?? '',
        title: (data.instructor as any)?.title ?? '',
        image: (data.instructor as any)?.image ?? null,
        bio: (data.instructor as any)?.bio ?? ''
      },
      testimonials: ((data as any).testimonials || []).map((t: any) => ({
        studentName: t.name ?? '',
        content: t.text ?? '',
        rating: t.rating ?? 5,
        studentTitle: t.studentTitle ?? ''
      })),
      sidebar: { durationHours: data.durationHours ?? null, includes: [] as string[] }
    };
    const safeSnapshot = JSON.parse(JSON.stringify(rawSnapshot));

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
      meta: {
        templateId: 'course-v1',
        templateVersion: 1,
        pageDataV1: safeSnapshot
      }
    };

    const course = existing
      ? await prisma.course.update({ where: { id: existing.id }, data: payload })
      : await prisma.course.create({ data: payload });

    return NextResponse.json({ success: true, course: { id: course.id, slug: course.slug, status: course.status } });
  } catch (error) {
    console.error('[drafts] error:', error);
    return NextResponse.json({ success: false, error: (error as any)?.message || 'Error guardando borrador' }, { status: 500 });
  }
}


