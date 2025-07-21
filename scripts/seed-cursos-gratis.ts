import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Fundamentos de Machine Learning
  await prisma.course.upsert({
    where: { slug: 'fundamentos-ml' },
    update: {},
    create: {
      title: 'Fundamentos de Machine Learning',
      slug: 'fundamentos-ml',
      description: 'Aprende los conceptos básicos de Machine Learning, desde algoritmos supervisados hasta no supervisados, y cómo implementarlos en Python.',
      shortDescription: 'Curso introductorio de ML con Python.',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop&crop=center',
      price: 0,
      isFree: true,
      requiresAuth: false,
      difficulty: 'BEGINNER',
      durationHours: 3,
      lessonsCount: 10,
      studentsCount: 0,
      rating: 0,
      status: 'PUBLISHED',
    },
  });

  // Computer Vision con Python
  await prisma.course.upsert({
    where: { slug: 'computer-vision' },
    update: {},
    create: {
      title: 'Computer Vision con Python',
      slug: 'computer-vision',
      description: 'Aprende a procesar y analizar imágenes usando OpenCV, detectar objetos, reconocer rostros y crear aplicaciones de visión por computadora.',
      shortDescription: 'Curso práctico de visión por computadora.',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&crop=center',
      price: 0,
      isFree: true,
      requiresAuth: false,
      difficulty: 'INTERMEDIATE',
      durationHours: 3,
      lessonsCount: 10,
      studentsCount: 0,
      rating: 0,
      status: 'PUBLISHED',
    },
  });

  console.log('✅ Cursos gratuitos insertados o actualizados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 