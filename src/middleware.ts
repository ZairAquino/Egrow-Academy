import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  shouldRedirect, 
  shouldReturn404, 
  shouldIgnore, 
  cleanURL, 
  generateCanonicalURL,
  validateCourseURL,
  validateResourceURL,
  getRedirectHeaders
} from '@/lib/redirect-config';
import { 
  securityMiddleware, 
  addSecurityHeaders, 
  applyCORS,
  getClientIP 
} from '@/lib/security';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Middleware de seguridad (rate limiting, CORS, etc.)
  const securityResponse = securityMiddleware(request);
  if (securityResponse) {
    return securityResponse;
  }

  // 2. Ignorar rutas que no necesitan procesamiento
  if (shouldIgnore(pathname)) {
    return NextResponse.next();
  }

  // 3. Verificar si debe devolver 404 intencionalmente
  if (shouldReturn404(pathname)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // 4. Verificar redirecciones configuradas
  const redirect = shouldRedirect(pathname);
  if (redirect) {
    const redirectUrl = new URL(redirect.destination, request.url);
    const response = NextResponse.redirect(redirectUrl, redirect.statusCode);
    
    // Agregar headers de redirección
    const headers = getRedirectHeaders(redirect);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return addSecurityHeaders(response);
  }

  // 5. Limpiar URLs (remover trailing slash, múltiples slashes, etc.)
  const cleanedPath = cleanURL(pathname);
  if (cleanedPath !== pathname) {
    const response = NextResponse.redirect(new URL(cleanedPath, request.url));
    return addSecurityHeaders(response);
  }

  // 6. Validar URLs de cursos
  if (pathname.startsWith('/curso/')) {
    if (!validateCourseURL(pathname)) {
      const response = NextResponse.redirect(new URL('/courses', request.url));
      return addSecurityHeaders(response);
    }
  }

  // 7. Validar URLs de recursos
  if (pathname.startsWith('/resources/')) {
    if (!validateResourceURL(pathname)) {
      const response = NextResponse.redirect(new URL('/resources', request.url));
      return addSecurityHeaders(response);
    }
  }

  // 8. Headers de seguridad y SEO
  const response = NextResponse.next();
  
  // Aplicar headers de seguridad mejorados
  addSecurityHeaders(response);
  
  // Headers de SEO
  response.headers.set('X-Robots-Tag', 'index, follow');
  response.headers.set('X-Canonical-URL', generateCanonicalURL(pathname));
  
  // Aplicar CORS para APIs
  if (pathname.startsWith('/api/')) {
    applyCORS(response);
  }
  
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