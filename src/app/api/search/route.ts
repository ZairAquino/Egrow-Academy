import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ results: [] });
    }

    console.log('Búsqueda global iniciada para:', query);
    const results = [];

    // 1. Páginas y secciones estáticas de la plataforma
    const staticPages = [
      // === PÁGINAS PRINCIPALES ===
      {
        id: 'home',
        title: 'Inicio',
        description: 'Página principal de eGrow Academy',
        type: 'page' as const,
        category: 'Navegación',
        tags: ['inicio', 'home', 'principal', 'página principal', 'landing'],
        relevance: query.toLowerCase().includes('inicio') || query.toLowerCase().includes('home') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/home/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/'
      },
      {
        id: 'courses',
        title: 'Cursos',
        description: 'Explora todos nuestros cursos disponibles',
        type: 'page' as const,
        category: 'Educación',
        tags: ['cursos', 'educación', 'aprendizaje', 'estudiar', 'formación', 'capacitación'],
        relevance: query.toLowerCase().includes('curso') ? 0.95 : 0.7,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/courses/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/courses'
      },
      {
        id: 'cursos-gratuitos',
        title: 'Cursos Gratuitos',
        description: 'Accede a cursos gratuitos de calidad',
        type: 'page' as const,
        category: 'Educación',
        tags: ['cursos gratuitos', 'free', 'gratis', 'sin costo', 'acceso libre'],
        relevance: query.toLowerCase().includes('gratuito') || query.toLowerCase().includes('free') ? 0.95 : 0.7,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/courses/free.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/cursos-gratuitos'
      },
      {
        id: 'community',
        title: 'Comunidad',
        description: 'Foro y comunidad de estudiantes',
        type: 'page' as const,
        category: 'Comunidad',
        tags: ['foro', 'comunidad', 'discusión', 'grupo', 'red', 'social'],
        relevance: query.toLowerCase().includes('foro') || query.toLowerCase().includes('comunidad') ? 0.95 : 0.7,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/community/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/community'
      },
      {
        id: 'resources',
        title: 'Recursos',
        description: 'Recursos educativos y materiales de apoyo',
        type: 'page' as const,
        category: 'Recursos',
        tags: ['recursos', 'materiales', 'descargas', 'archivos', 'documentos', 'biblioteca'],
        relevance: query.toLowerCase().includes('recurso') ? 0.95 : 0.7,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/resources/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/resources'
      },
      {
        id: 'contact',
        title: 'Contacto',
        description: 'Ponte en contacto con nosotros',
        type: 'page' as const,
        category: 'Soporte',
        tags: ['contacto', 'soporte', 'ayuda', 'email', 'mensaje', 'comunicación'],
        relevance: query.toLowerCase().includes('contacto') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/contact/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/contacto'
      },
      {
        id: 'search',
        title: 'Búsqueda',
        description: 'Busca en toda la plataforma',
        type: 'page' as const,
        category: 'Herramientas',
        tags: ['búsqueda', 'buscar', 'encontrar', 'explorar', 'search'],
        relevance: query.toLowerCase().includes('buscar') || query.toLowerCase().includes('búsqueda') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/search/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/search'
      },

      // === CUENTA DE USUARIO ===
      {
        id: 'login',
        title: 'Iniciar Sesión',
        description: 'Accede a tu cuenta',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['login', 'iniciar sesión', 'entrar', 'acceso', 'usuario', 'signin'],
        relevance: query.toLowerCase().includes('login') || query.toLowerCase().includes('iniciar') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/login/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/login'
      },
      {
        id: 'register',
        title: 'Registrarse',
        description: 'Crea tu cuenta gratuita',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['registro', 'registrarse', 'crear cuenta', 'nuevo usuario', 'signup', 'registrarse'],
        relevance: query.toLowerCase().includes('registro') || query.toLowerCase().includes('registrarse') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/register/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/register'
      },
      {
        id: 'profile',
        title: 'Mi Perfil',
        description: 'Gestiona tu perfil y configuración',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['perfil', 'mi cuenta', 'configuración', 'datos', 'profile'],
        relevance: query.toLowerCase().includes('perfil') || query.toLowerCase().includes('cuenta') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/profile/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: true,
        link: '/profile'
      },
      {
        id: 'my-courses',
        title: 'Mis Cursos',
        description: 'Accede a tus cursos inscritos',
        type: 'page' as const,
        category: 'Educación',
        tags: ['mis cursos', 'cursos inscritos', 'progreso', 'aprendizaje', 'dashboard'],
        relevance: query.toLowerCase().includes('mis cursos') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/my-courses/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: true,
        link: '/my-courses'
      },
      {
        id: 'forgot-password',
        title: 'Recuperar Contraseña',
        description: 'Recupera tu contraseña olvidada',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['recuperar contraseña', 'olvidé contraseña', 'reset password', 'forgot password'],
        relevance: query.toLowerCase().includes('contraseña') || query.toLowerCase().includes('password') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/forgot-password/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/forgot-password'
      },
      {
        id: 'reset-password',
        title: 'Restablecer Contraseña',
        description: 'Crea una nueva contraseña',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['restablecer contraseña', 'nueva contraseña', 'cambiar contraseña'],
        relevance: query.toLowerCase().includes('restablecer') || query.toLowerCase().includes('nueva contraseña') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/reset-password/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/reset-password'
      },
      {
        id: 'verify-email',
        title: 'Verificar Email',
        description: 'Verifica tu dirección de email',
        type: 'page' as const,
        category: 'Cuenta',
        tags: ['verificar email', 'confirmar email', 'email verification'],
        relevance: query.toLowerCase().includes('verificar') || query.toLowerCase().includes('email') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/verify-email/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/verify-email'
      },

      // === MEMBRESÍA Y PAGOS ===
      {
        id: 'subscription',
        title: 'Suscripción Premium',
        description: 'Accede a contenido exclusivo y premium',
        type: 'page' as const,
        category: 'Membresía',
        tags: ['suscripción', 'suscripcion', 'premium', 'exclusivo', 'membresía', 'pago', 'plan', 'subscription'],
        relevance: query.toLowerCase().includes('suscripción') || query.toLowerCase().includes('suscripcion') || query.toLowerCase().includes('premium') || query.toLowerCase().includes('pago') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Premium',
        image: '/images/premium/default.jpg',
        tag: 'Página',
        isFree: false,
        requiresAuth: true,
        link: '/subscription'
      },
      {
        id: 'payment',
        title: 'Pagos',
        description: 'Gestiona tus pagos y facturación',
        type: 'page' as const,
        category: 'Pagos',
        tags: ['pagos', 'facturación', 'billing', 'payment', 'tarjeta', 'paypal'],
        relevance: query.toLowerCase().includes('pago') || query.toLowerCase().includes('facturación') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Premium',
        image: '/images/payment/default.jpg',
        tag: 'Página',
        isFree: false,
        requiresAuth: true,
        link: '/payment'
      },
      {
        id: 'facturacion',
        title: 'Facturación',
        description: 'Descarga tus facturas y recibos',
        type: 'page' as const,
        category: 'Pagos',
        tags: ['facturación', 'facturas', 'recibos', 'billing', 'invoices'],
        relevance: query.toLowerCase().includes('facturación') || query.toLowerCase().includes('facturas') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Premium',
        image: '/images/facturacion/default.jpg',
        tag: 'Página',
        isFree: false,
        requiresAuth: true,
        link: '/facturacion'
      },

      // === CURSOS ESPECÍFICOS ===
      {
        id: 'monetiza-ia',
        title: 'Monetiza con IA',
        description: 'Aprende a monetizar usando inteligencia artificial',
        type: 'page' as const,
        category: 'Monetización',
        tags: ['monetización', 'ia', 'inteligencia artificial', 'dinero', 'negocio', 'ganar'],
        relevance: query.toLowerCase().includes('monetiza') || query.toLowerCase().includes('monetización') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Premium',
        image: '/images/monetiza-ia.jpg',
        tag: 'Página',
        isFree: false,
        requiresAuth: true,
        link: '/curso/monetiza-ia'
      },

      // === CERTIFICADOS ===
      {
        id: 'certificate',
        title: 'Certificados',
        description: 'Obtén certificados de tus cursos completados',
        type: 'page' as const,
        category: 'Educación',
        tags: ['certificados', 'certificaciones', 'diplomas', 'certificates'],
        relevance: query.toLowerCase().includes('certificado') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/certificate/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: true,
        link: '/certificate'
      },

      // === PÁGINAS LEGALES ===
      {
        id: 'terminos-condiciones',
        title: 'Términos y Condiciones',
        description: 'Términos y condiciones de uso de la plataforma',
        type: 'page' as const,
        category: 'Legal',
        tags: ['términos', 'condiciones', 'terms', 'conditions', 'legal', 'política'],
        relevance: query.toLowerCase().includes('términos') || query.toLowerCase().includes('condiciones') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/legal/default.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/terminos-condiciones'
      },
      {
        id: 'politica-privacidad',
        title: 'Política de Privacidad',
        description: 'Política de privacidad y protección de datos',
        type: 'page' as const,
        category: 'Legal',
        tags: ['privacidad', 'política', 'datos', 'privacy', 'policy', 'gdpr'],
        relevance: query.toLowerCase().includes('privacidad') || query.toLowerCase().includes('política') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Gratis',
        image: '/images/legal/privacy.jpg',
        tag: 'Página',
        isFree: true,
        requiresAuth: false,
        link: '/politica-privacidad'
      },

      // === ADMIN ===
      {
        id: 'admin',
        title: 'Panel de Administración',
        description: 'Panel de administración de la plataforma',
        type: 'page' as const,
        category: 'Administración',
        tags: ['admin', 'administración', 'panel', 'dashboard', 'gestión'],
        relevance: query.toLowerCase().includes('admin') || query.toLowerCase().includes('administración') ? 0.95 : 0.6,
        level: '',
        duration: '',
        price: 'Premium',
        image: '/images/admin/default.jpg',
        tag: 'Página',
        isFree: false,
        requiresAuth: true,
        link: '/admin'
      }
    ];

    // Filtrar páginas estáticas según la búsqueda
    staticPages.forEach(page => {
      const queryLower = query.toLowerCase();
      const titleMatch = page.title.toLowerCase().includes(queryLower);
      const descMatch = page.description.toLowerCase().includes(queryLower);
      const tagsMatch = page.tags.some(tag => tag.toLowerCase().includes(queryLower));
      
      // Búsqueda más flexible - también buscar palabras parciales
      const queryWords = queryLower.split(' ').filter(word => word.length > 2);
      const partialMatch = queryWords.some(word => 
        page.title.toLowerCase().includes(word) ||
        page.description.toLowerCase().includes(word) ||
        page.tags.some(tag => tag.toLowerCase().includes(word))
      );
      
      if (titleMatch || descMatch || tagsMatch || partialMatch) {
        results.push(page);
      }
    });

    // 2. Buscar en cursos de la base de datos
    try {
      const courses = await prisma.course.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        take: 10
      });

      courses.forEach(course => {
        results.push({
          id: course.id,
          title: course.title,
          description: course.description || '',
          type: 'course' as const,
          category: 'Cursos',
          tags: ['curso', 'educación'],
          relevance: 0.9,
          level: course.difficulty || '',
          duration: course.durationHours ? `${course.durationHours} horas` : '',
          price: course.isFree ? 'Gratis' : 'Premium',
          image: course.imageUrl || '/images/courses/default.jpg',
          tag: course.status === 'PUBLISHED' ? 'Disponible' : '',
          isFree: course.isFree || false,
          requiresAuth: course.requiresAuth || true,
          link: `/curso/${course.slug}`
        });
      });
    } catch (error) {
      console.error('Error buscando cursos:', error);
    }

    // 3. Buscar en recursos
    try {
      const resources = await prisma.resource.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        take: 10
      });

      resources.forEach(resource => {
        results.push({
          id: resource.id,
          title: resource.title,
          description: resource.description || '',
          type: 'resource' as const,
          category: 'Recursos',
          tags: ['recurso', 'material'],
          relevance: 0.8,
          level: resource.difficulty || '',
          duration: '',
          price: resource.isFree ? 'Gratis' : 'Premium',
          image: resource.imageUrl || '/images/resources/default.jpg',
          tag: resource.status === 'PUBLISHED' ? 'Disponible' : '',
          isFree: resource.isFree || false,
          requiresAuth: resource.requiresAuth || true,
          link: `/resources/${resource.slug}`
        });
      });
    } catch (error) {
      console.error('Error buscando recursos:', error);
    }

    // 4. Buscar en posts de la comunidad
    try {
      const communityPosts = await prisma.communityPost.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              content: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        take: 10
      });

      communityPosts.forEach(post => {
        results.push({
          id: post.id,
          title: post.title,
          description: post.content.substring(0, 150) + '...',
          type: 'community' as const,
          category: 'Comunidad',
          tags: ['foro', 'discusión', 'comunidad'],
          relevance: 0.7,
          level: '',
          duration: '',
          price: 'Gratis',
          image: '/images/community/default.jpg',
          tag: 'Post',
          isFree: true,
          requiresAuth: false,
          link: `/community/post/${post.id}`
        });
      });
    } catch (error) {
      console.error('Error buscando posts de comunidad:', error);
    }

    // Ordenar por relevancia
    results.sort((a, b) => b.relevance - a.relevance);

    console.log(`Búsqueda completada. ${results.length} resultados encontrados.`);
    return NextResponse.json({ results: results.slice(0, 20) });

  } catch (error) {
    console.error('Error en búsqueda global:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 