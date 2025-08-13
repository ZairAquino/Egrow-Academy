import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Buscar un curso en estado DRAFT
    const draftCourse = await prisma.course.findFirst({
      where: { status: 'DRAFT' },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        lessonsCount: true,
        meta: true,
        lessons: {
          select: {
            id: true,
            title: true,
            order: true
          }
        }
      }
    });

    if (draftCourse) {
      console.log('=== CURSO DRAFT ENCONTRADO ===');
      console.log('ID:', draftCourse.id);
      console.log('Título:', draftCourse.title);
      console.log('Slug:', draftCourse.slug);
      console.log('Estado:', draftCourse.status);
      console.log('Lecciones count:', draftCourse.lessonsCount);
      console.log('Lecciones creadas:', draftCourse.lessons.length);
      
      console.log('\n=== META DATA (pageDataV1) ===');
      const meta = (draftCourse as any).meta;
      if (meta?.pageDataV1) {
        const pageData = meta.pageDataV1;
        console.log('- Título en meta:', pageData.title);
        console.log('- Módulos:', pageData.modules?.length || 0);
        if (pageData.modules && pageData.modules.length > 0) {
          pageData.modules.forEach((mod: any, idx: number) => {
            console.log(`  Módulo ${idx + 1}: ${mod.title}`);
            console.log(`    - Lecciones: ${mod.lessons?.length || 0}`);
            if (mod.lessons) {
              mod.lessons.forEach((lesson: any, lidx: number) => {
                console.log(`      ${lidx + 1}. ${lesson.title}`);
              });
            }
          });
        }
        console.log('- Testimonios:', pageData.testimonials?.length || 0);
        console.log('- Herramientas:', pageData.tools?.length || 0);
        console.log('- Objetivos:', pageData.learningGoals?.length || 0);
      } else {
        console.log('No hay meta.pageDataV1 guardada');
      }
      
      // Cambiar a PUBLISHED para probar
      console.log('\n=== PUBLICANDO CURSO ===');
      const published = await prisma.course.update({
        where: { id: draftCourse.id },
        data: { status: 'PUBLISHED' }
      });
      console.log('✅ Curso publicado con slug:', published.slug);
      console.log('URL del curso: http://localhost:3000/curso/' + published.slug);
      
    } else {
      console.log('No se encontró ningún curso en estado DRAFT');
      
      // Listar todos los cursos
      const allCourses = await prisma.course.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          status: true
        }
      });
      
      console.log('\n=== TODOS LOS CURSOS ===');
      allCourses.forEach(c => {
        console.log(`- ${c.title} (${c.slug}) - ${c.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();