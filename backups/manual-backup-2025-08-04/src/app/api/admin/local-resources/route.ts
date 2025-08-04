import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [ADMIN-API] Obteniendo recursos locales...');

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