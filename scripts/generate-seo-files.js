#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuración del sitio
const SITE_URL = process.env.SITE_URL || 'https://egrow-academy.com';

// Cursos disponibles con optimización SEO
const courses = [
  {
    slug: 'introduccion-llms',
    title: 'Introducción a LLMs - Large Language Models',
    description: 'Aprende los fundamentos de los Large Language Models, ChatGPT, GPT-4 y modelos de lenguaje avanzados. Curso de IA en español para México y Latinoamérica.',
    keywords: 'LLMs, Large Language Models, ChatGPT, GPT-4, inteligencia artificial, cursos de IA, machine learning',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    slug: 'monetiza-ia',
    title: 'Monetiza con IA - Estrategias de Negocio',
    description: 'Estrategias avanzadas para monetizar proyectos de inteligencia artificial. Aprende a crear negocios rentables con IA en México y Latinoamérica.',
    keywords: 'monetizar IA, negocios con inteligencia artificial, emprendimiento IA, cursos de IA, machine learning México',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    slug: 'desarrollo-web-fullstack',
    title: 'Desarrollo Web Fullstack con IA',
    description: 'Curso completo de desarrollo web fullstack integrando inteligencia artificial. Aprende programación web moderna con IA.',
    keywords: 'desarrollo web, fullstack, programación, IA, inteligencia artificial, cursos online',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    slug: 'fundamentos-ml',
    title: 'Fundamentos de Machine Learning',
    description: 'Aprende los fundamentos del machine learning y deep learning. Curso de inteligencia artificial para principiantes en español.',
    keywords: 'machine learning, deep learning, inteligencia artificial, aprendizaje automático, cursos de IA, México',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    slug: 'computer-vision',
    title: 'Computer Vision - Visión por Computadora',
    description: 'Curso especializado en visión por computadora y procesamiento de imágenes con inteligencia artificial.',
    keywords: 'computer vision, visión por computadora, procesamiento de imágenes, IA, machine learning, deep learning',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  }
];

// Recursos disponibles con optimización SEO
const resources = [
  {
    slug: 'manual-gpt',
    title: 'Manual GPT - Guía Completa ChatGPT',
    description: 'Guía completa para usar GPT, ChatGPT y modelos de lenguaje. Recursos gratuitos de inteligencia artificial.',
    keywords: 'GPT, ChatGPT, manual, guía, inteligencia artificial, recursos gratuitos, IA',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    slug: 'manual-gem',
    title: 'Manual GEM - Google Gemini',
    description: 'Guía completa para usar Google Gemini y herramientas de IA de Google. Recursos de inteligencia artificial.',
    keywords: 'Google Gemini, GEM, inteligencia artificial, Google IA, recursos, manual',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.7
  }
];

// Páginas estáticas importantes con optimización SEO
const staticPages = [
  { 
    path: '/', 
    title: 'eGrow Academy - Líder en Cursos de Inteligencia Artificial',
    description: 'Plataforma líder en cursos de inteligencia artificial en México y Latinoamérica. Aprende IA, machine learning y deep learning.',
    priority: 1.0, 
    changefreq: 'daily' 
  },
  { 
    path: '/cursos', 
    title: 'Cursos de Inteligencia Artificial - eGrow Academy',
    description: 'Catálogo completo de cursos de inteligencia artificial, machine learning y deep learning. Formación profesional en IA.',
    priority: 0.9, 
    changefreq: 'weekly' 
  },
  { 
    path: '/cursos-gratuitos', 
    title: 'Cursos Gratuitos de IA - eGrow Academy',
    description: 'Cursos gratuitos de inteligencia artificial para empezar tu formación en IA. Recursos sin costo.',
    priority: 0.8, 
    changefreq: 'weekly' 
  },
  { 
    path: '/community', 
    title: 'Comunidad de IA - eGrow Academy',
    description: 'Únete a nuestra comunidad de profesionales de inteligencia artificial. Networking y colaboración en IA.',
    priority: 0.8, 
    changefreq: 'daily' 
  },
  { 
    path: '/resources', 
    title: 'Recursos de Inteligencia Artificial - eGrow Academy',
    description: 'Recursos gratuitos de inteligencia artificial, manuales, guías y herramientas para aprender IA.',
    priority: 0.7, 
    changefreq: 'weekly' 
  },
  { 
    path: '/contacto', 
    title: 'Contacto - eGrow Academy',
    description: 'Contáctanos para información sobre nuestros cursos de inteligencia artificial y formación en IA.',
    priority: 0.6, 
    changefreq: 'monthly' 
  },
  { 
    path: '/terminos-condiciones', 
    title: 'Términos y Condiciones - eGrow Academy',
    description: 'Términos y condiciones de uso de eGrow Academy, plataforma de cursos de inteligencia artificial.',
    priority: 0.3, 
    changefreq: 'yearly' 
  },
  { 
    path: '/politica-privacidad', 
    title: 'Política de Privacidad - eGrow Academy',
    description: 'Política de privacidad de eGrow Academy, protección de datos en nuestra plataforma de IA.',
    priority: 0.3, 
    changefreq: 'yearly' 
  },
];

// Función para generar sitemap XML con metadatos SEO
function generateSitemapXML(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${url.title ? `<title>${url.title}</title>` : ''}
    ${url.description ? `<description>${url.description}</description>` : ''}
    ${url.keywords ? `<keywords>${url.keywords}</keywords>` : ''}
  </url>`).join('\n')}
</urlset>`;
  return xml;
}

// Función para generar sitemap de cursos
function generateCoursesSitemap() {
  const courseUrls = courses.map(course => ({
    loc: `/curso/${course.slug}`,
    lastmod: course.lastmod,
    changefreq: course.changefreq,
    priority: course.priority
  }));

  return generateSitemapXML(courseUrls);
}

// Función para generar sitemap de recursos
function generateResourcesSitemap() {
  const resourceUrls = resources.map(resource => ({
    loc: `/resources/${resource.slug}`,
    lastmod: resource.lastmod,
    changefreq: resource.changefreq,
    priority: resource.priority
  }));

  return generateSitemapXML(resourceUrls);
}

// Función para generar sitemap principal
function generateMainSitemap() {
  const allUrls = [
    ...staticPages.map(page => ({
      loc: page.path,
      lastmod: new Date().toISOString(),
      changefreq: page.changefreq,
      priority: page.priority
    })),
    ...courses.map(course => ({
      loc: `/curso/${course.slug}`,
      lastmod: course.lastmod,
      changefreq: course.changefreq,
      priority: course.priority
    })),
    ...resources.map(resource => ({
      loc: `/resources/${resource.slug}`,
      lastmod: resource.lastmod,
      changefreq: resource.changefreq,
      priority: resource.priority
    }))
  ];

  return generateSitemapXML(allUrls);
}

// Función para generar robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/courses-sitemap.xml
Sitemap: ${SITE_URL}/resources-sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /login
Disallow: /register
Disallow: /profile
Disallow: /payment/
Disallow: /subscription/
Disallow: /verify-email/
Disallow: /certificate/
Disallow: /facturacion/

# Allow important pages
Allow: /cursos
Allow: /resources
Allow: /community
Allow: /contacto

# Crawl delay (optional)
Crawl-delay: 1`;
}

// Función para generar manifest.json
function generateManifest() {
  return JSON.stringify({
    name: "eGrow Academy - Cursos de Inteligencia Artificial",
    short_name: "eGrow Academy",
    description: "Plataforma líder en cursos de inteligencia artificial en español",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    categories: ["education", "productivity"],
    lang: "es-MX",
    scope: "/",
    orientation: "portrait-primary"
  }, null, 2);
}

// Función principal
function main() {
  console.log('🚀 Generando archivos SEO...');

  const publicDir = path.join(process.cwd(), 'public');

  // Generar sitemap principal
  const mainSitemap = generateMainSitemap();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
  console.log('✅ Sitemap principal generado');

  // Generar sitemap de cursos
  const coursesSitemap = generateCoursesSitemap();
  fs.writeFileSync(path.join(publicDir, 'courses-sitemap.xml'), coursesSitemap);
  console.log('✅ Sitemap de cursos generado');

  // Generar sitemap de recursos
  const resourcesSitemap = generateResourcesSitemap();
  fs.writeFileSync(path.join(publicDir, 'resources-sitemap.xml'), resourcesSitemap);
  console.log('✅ Sitemap de recursos generado');

  // Generar robots.txt
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ Robots.txt generado');

  // Generar manifest.json
  const manifest = generateManifest();
  fs.writeFileSync(path.join(publicDir, 'manifest.json'), manifest);
  console.log('✅ Manifest.json generado');

  console.log('🎉 Todos los archivos SEO han sido generados exitosamente!');
  console.log(`📊 URLs generadas: ${staticPages.length + courses.length + resources.length}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  generateMainSitemap,
  generateCoursesSitemap,
  generateResourcesSitemap,
  generateRobotsTxt,
  generateManifest
}; 