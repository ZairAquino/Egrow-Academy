import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Función para verificar si el usuario es admin
export async function checkAdminAccess(request: NextRequest): Promise<boolean> {
  try {
    // Obtener token de cookies o headers
    const cookieToken = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      return false;
    }
    
    // Verificar token JWT
    const { userId } = verifyToken(token);
    
    if (!userId) {
      return false;
    }
    
    // NOTA: En middleware no podemos hacer queries de Prisma directamente
    // En su lugar, haremos la verificación en las APIs y páginas individuales
    // Este middleware solo verifica que hay un token válido
    return true;
    
  } catch (error) {
    console.error('Error verificando admin access:', error);
    return false;
  }
}

// Middleware para proteger rutas admin - SIMPLIFICADO
export function protectAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta es una ruta admin de página (no API)
  const isAdminPageRoute = pathname.startsWith('/admin') && !pathname.startsWith('/api/admin');
  
  if (isAdminPageRoute) {
    console.log(`🔒 Admin page route detected: ${pathname} - letting page handle auth`);
    // Para rutas de página admin, dejar que la página maneje la autenticación
    // No bloquear en middleware, el useAdminAccess hook se encargará
    return NextResponse.next();
  }
  
  // Para rutas API admin, mantener protección básica
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  if (isAdminApiRoute) {
    console.log(`🔒 Admin API route: ${pathname} - checking basic auth`);
    
    // Buscar cualquier token en cookies
    const allCookies = request.cookies.getAll();
    const hasAnyCookie = allCookies.length > 0;
    
    if (!hasAnyCookie) {
      console.log('❌ No cookies found for admin API route');
      return NextResponse.json(
        { error: 'Acceso denegado. Se requiere autenticación.' },
        { status: 401 }
      );
    }
    
    console.log('✅ Cookies found, letting API handle detailed auth');
    return NextResponse.next();
  }
  
  return null; // No es ruta admin, continuar normalmente
}