import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkMaintenanceMode } from './middleware/maintenance';
import { protectAdminRoutes } from './middleware/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar modo mantenimiento
  const maintenanceResponse = checkMaintenanceMode(request);
  if (maintenanceResponse) {
    return maintenanceResponse;
  }

  // Proteger rutas admin
  const adminProtectionResponse = protectAdminRoutes(request);
  if (adminProtectionResponse) {
    return adminProtectionResponse;
  }

  // Solo aplicar headers básicos sin restricciones
  const response = NextResponse.next();
  
  // Headers de seguridad básicos
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
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