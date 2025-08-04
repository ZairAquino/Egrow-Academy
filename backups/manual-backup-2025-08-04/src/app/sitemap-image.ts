import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://egrow-academy.com';
  const currentDate = new Date().toISOString();

  return [
    // Imágenes de cursos
    {
      url: `${baseUrl}/curso/machine-learning-fundamentals`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'es-MX': `${baseUrl}/curso/machine-learning-fundamentals`,
          'en-US': `${baseUrl}/en/course/machine-learning-fundamentals`,
        },
      },
    },
    {
      url: `${baseUrl}/curso/deep-learning-python`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'es-MX': `${baseUrl}/curso/deep-learning-python`,
          'en-US': `${baseUrl}/en/course/deep-learning-python`,
        },
      },
    },
    {
      url: `${baseUrl}/curso/data-science-completo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          'es-MX': `${baseUrl}/curso/data-science-completo`,
          'en-US': `${baseUrl}/en/course/data-science-complete`,
        },
      },
    },
  ];
} 