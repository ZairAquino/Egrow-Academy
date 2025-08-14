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
  
  // Para rutas API admin, NO hacer verificación en middleware
  // Dejar que cada API individual maneje su propia autenticación
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  if (isAdminApiRoute) {
    console.log(`🔒 Admin API route: ${pathname} - letting API handle all auth`);
    return NextResponse.next();
  }
  
  return null; // No es ruta admin, continuar normalmente
}