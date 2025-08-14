import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkMaintenanceMode } from './middleware/maintenance';
import { protectAdminRoutes } from './middleware/auth';
import { resolveCurrencyFromCountry } from '@/lib/geo-currency';

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

  // Resolver moneda por IP/país: usar header geolocalizado si existe
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('x-geo-country');
  let currency = resolveCurrencyFromCountry(country);

  // Permitir override por query param ?currency=usd|eur|mxn|ars (útil para QA)
  const url = new URL(request.url);
  const override = url.searchParams.get('currency');
  if (override && ['usd','eur','mxn','ars'].includes(override.toLowerCase())) {
    currency = override.toLowerCase() as any;
  }

  // Solo aplicar headers básicos sin restricciones
  const response = NextResponse.next();

  // Setear cookie de moneda si no existe o cambió
  const existingCurrency = request.cookies.get('currency')?.value;
  if (!existingCurrency || existingCurrency !== currency) {
    response.cookies.set('currency', currency, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
  }
  
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