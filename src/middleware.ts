import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redirectConfig, canonicalURLs, urlUtils } from '@/lib/url-structure-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Verificar redirecciones de URLs antiguas
  const redirectPath = redirectConfig[pathname];
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // 2. Verificar URLs canónicas (remover trailing slash)
  const canonical = canonicalURLs.find(item => item.url === pathname);
  if (canonical) {
    return NextResponse.redirect(new URL(canonical.canonical, request.url));
  }

  // 3. Redireccionar URLs con trailing slash a sin trailing slash
  if (pathname !== '/' && pathname.endsWith('/')) {
    const cleanPath = pathname.slice(0, -1);
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  // 4. Verificar URLs con parámetros innecesarios
  const cleanPath = urlUtils.cleanURL(pathname);
  if (cleanPath !== pathname) {
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  // 5. Validar slugs de cursos
  if (pathname.startsWith('/curso/')) {
    const slug = pathname.replace('/curso/', '');
    if (!urlUtils.validateCourseSlug(slug)) {
      return NextResponse.redirect(new URL('/cursos', request.url));
    }
  }

  // 6. Headers de seguridad y SEO
  const response = NextResponse.next();
  
  // Headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Headers de SEO
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)',
  ],
}; 