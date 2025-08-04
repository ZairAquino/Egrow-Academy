import { MetadataRoute } from 'next';
import { generateSitemapURLs, urlStructureConfig } from '@/lib/url-structure-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://egrow-academy.com';
  const currentDate = new Date().toISOString();

  // URLs principales del sitemap
  const sitemap: MetadataRoute.Sitemap = [
    // Página principal
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },

    // Cursos
    {
      url: `${baseUrl}/cursos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Categorías
    {
      url: `${baseUrl}/categorias`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Instructores
    {
      url: `${baseUrl}/instructores`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // Eventos
    {
      url: `${baseUrl}/eventos`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Páginas estáticas
    {
      url: `${baseUrl}/sobre-nosotros`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    {
      url: `${baseUrl}/precios`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/testimonios`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },

    // Cursos específicos (ejemplos)
    {
      url: `${baseUrl}/curso/machine-learning-fundamentals`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/curso/deep-learning-python`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/curso/data-science-completo`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Categorías específicas
    {
      url: `${baseUrl}/categoria/machine-learning`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/categoria/deep-learning`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/categoria/python`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Instructores específicos
    {
      url: `${baseUrl}/instructor/carlos-rodriguez`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/instructor/ana-martinez`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Artículos del blog (ejemplos)
    {
      url: `${baseUrl}/blog/tendencias-ia-2024`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/blog/machine-learning-para-principiantes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Eventos específicos
    {
      url: `${baseUrl}/evento/webinar-introduccion-deep-learning`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    {
      url: `${baseUrl}/evento/workshop-python-avanzado`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return sitemap;
} 