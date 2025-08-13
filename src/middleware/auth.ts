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

// Middleware para proteger rutas admin
export function protectAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta es una ruta admin
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminApiRoute = pathname.startsWith('/api/admin');
  
  if (isAdminRoute || isAdminApiRoute) {
    console.log(`🔒 Checking admin access for: ${pathname}`);
    
    // Obtener token
    const cookieToken = request.cookies.get('session')?.value;
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const token = cookieToken || headerToken;
    
    if (!token) {
      console.log('❌ No token found for admin route');
      
      if (isAdminApiRoute) {
        // Para rutas API, devolver 401
        return NextResponse.json(
          { error: 'Acceso denegado. Se requiere autenticación de administrador.' },
          { status: 401 }
        );
      } else {
        // Para rutas de página, redirigir al login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    
    try {
      // Verificar que el token es válido
      verifyToken(token);
      console.log('✅ Valid token found for admin route');
      
      // El token es válido, pero aún necesitamos verificar el role en la página/API individual
      // porque el middleware no puede hacer queries de base de datos
      return NextResponse.next();
      
    } catch (error) {
      console.log('❌ Invalid token for admin route');
      
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'Token inválido. Acceso denegado.' },
          { status: 401 }
        );
      } else {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }
  
  return null; // No es ruta admin, continuar normalmente
}