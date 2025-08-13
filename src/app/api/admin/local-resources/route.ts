import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN-API] Obteniendo recursos locales...');

    // Verificar autenticación y rol ADMIN
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario tenga rol ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      console.log(`❌ Acceso denegado: Usuario ${session.user.id} no es ADMIN (role: ${user?.role})`);
      return NextResponse.json(
        { error: 'Acceso denegado. Se requieren permisos de administrador.' },
        { status: 403 }
      );
    }

    const resourcesDir = path.join(process.cwd(), 'public', 'resources');
    const resources: Array<{ name: string; size: number; path: string }> = [];

    // Verificar si el directorio existe
    if (!fs.existsSync(resourcesDir)) {
      console.log('📁 [ADMIN-API] Directorio de recursos no encontrado');
      return NextResponse.json({
        success: true,
        resources: [],
        totalSize: 0,
        message: 'No hay recursos locales'
      });
    }

    // Leer archivos del directorio
    const files = fs.readdirSync(resourcesDir);
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(resourcesDir, file);
      const stats = fs.statSync(filePath);
      
      resources.push({
        name: file,
        size: stats.size,
        path: `/resources/${file}`
      });
      
      totalSize += stats.size;
    }

    console.log(`✅ [ADMIN-API] ${resources.length} recursos locales encontrados`);

    return NextResponse.json({
      success: true,
      resources,
      totalSize,
      totalFiles: resources.length,
      message: `${resources.length} archivos locales encontrados`
    });

  } catch (error) {
    console.error('❌ [ADMIN-API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        resources: [],
        totalSize: 0
      },
      { status: 500 }
    );
  }
} 