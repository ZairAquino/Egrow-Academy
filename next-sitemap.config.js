/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://egrow-academy.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
    '/login',
    '/register',
    '/profile',
    '/payment/*',
    '/subscription/*',
    '/verify-email/*',
    '/certificate/*',
    '/facturacion/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/profile',
          '/payment/',
          '/subscription/',
          '/verify-email/',
          '/certificate/',
          '/facturacion/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/profile',
          '/payment/',
          '/subscription/',
          '/verify-email/',
          '/certificate/',
          '/facturacion/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/login',
          '/register',
          '/profile',
          '/payment/',
          '/subscription/',
          '/verify-email/',
          '/certificate/',
          '/facturacion/',
        ],
      },
    ],
    additionalSitemaps: [
      'https://egrow-academy.com/sitemap.xml',
      'https://egrow-academy.com/courses-sitemap.xml',
      'https://egrow-academy.com/blog-sitemap.xml',
    ],
  },
  // Configuración adicional para sitemaps específicos
  additionalPaths: async (config) => {
    const result = [];
    
    // Páginas estáticas importantes
    const staticPages = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/cursos', priority: 0.9, changefreq: 'weekly' },
      { path: '/cursos-gratuitos', priority: 0.8, changefreq: 'weekly' },
      { path: '/about', priority: 0.7, changefreq: 'monthly' },
      { path: '/contacto', priority: 0.6, changefreq: 'monthly' },
      { path: '/terminos-condiciones', priority: 0.3, changefreq: 'yearly' },
      { path: '/politica-privacidad', priority: 0.3, changefreq: 'yearly' },
      { path: '/community', priority: 0.8, changefreq: 'daily' },
      { path: '/resources', priority: 0.7, changefreq: 'weekly' },
    ];

    // Agregar páginas estáticas
    staticPages.forEach((page) => {
      result.push({
        loc: page.path,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    });

    // Aquí puedes agregar lógica para obtener cursos dinámicamente
    // const courses = await getCourses();
    // courses.forEach((course) => {
    //   result.push({
    //     loc: `/curso/${course.slug}`,
    //     changefreq: 'weekly',
    //     priority: 0.8,
    //     lastmod: course.updatedAt,
    //   });
    // });

    // Aquí puedes agregar lógica para obtener posts del blog dinámicamente
    // const blogPosts = await getBlogPosts();
    // blogPosts.forEach((post) => {
    //   result.push({
    //     loc: `/blog/${post.slug}`,
    //     changefreq: 'monthly',
    //     priority: 0.6,
    //     lastmod: post.updatedAt,
    //   });
    // });

    return result;
  },
  // Configuración para transformar URLs
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  // Configuración para referencias alternativas (hreflang)
  alternateRefs: [
    {
      href: 'https://egrow-academy.com',
      hreflang: 'es-MX',
    },
    {
      href: 'https://egrow-academy.com/es-AR',
      hreflang: 'es-AR',
    },
    {
      href: 'https://egrow-academy.com/es-CO',
      hreflang: 'es-CO',
    },
    {
      href: 'https://egrow-academy.com/es-PE',
      hreflang: 'es-PE',
    },
    {
      href: 'https://egrow-academy.com/es-CL',
      hreflang: 'es-CL',
    },
    {
      href: 'https://egrow-academy.com/es-EC',
      hreflang: 'es-EC',
    },
    {
      href: 'https://egrow-academy.com/es-GT',
      hreflang: 'es-GT',
    },
    {
      href: 'https://egrow-academy.com/es-CR',
      hreflang: 'es-CR',
    },
    {
      href: 'https://egrow-academy.com/es-PA',
      hreflang: 'es-PA',
    },
    {
      href: 'https://egrow-academy.com/es-CU',
      hreflang: 'es-CU',
    },
    {
      href: 'https://egrow-academy.com/es-BO',
      hreflang: 'es-BO',
    },
    {
      href: 'https://egrow-academy.com/es-DO',
      hreflang: 'es-DO',
    },
    {
      href: 'https://egrow-academy.com/es-HN',
      hreflang: 'es-HN',
    },
    {
      href: 'https://egrow-academy.com/es-PY',
      hreflang: 'es-PY',
    },
    {
      href: 'https://egrow-academy.com/es-EL',
      hreflang: 'es-EL',
    },
    {
      href: 'https://egrow-academy.com/es-SV',
      hreflang: 'es-SV',
    },
    {
      href: 'https://egrow-academy.com/es-UY',
      hreflang: 'es-UY',
    },
    {
      href: 'https://egrow-academy.com/es-VE',
      hreflang: 'es-VE',
    },
  ],
}; 