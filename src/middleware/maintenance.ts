import { NextRequest, NextResponse } from 'next/server'

interface MaintenanceConfig {
  enabled: boolean
  startTime?: string
  estimatedDuration?: string
  reason?: string
  allowedIPs?: string[]
  bypassKey?: string
}

export function checkMaintenanceMode(request: NextRequest): NextResponse | null {
  // Verificar si modo mantenimiento está activo via variable de entorno
  if (!process.env.MAINTENANCE_MODE) {
    return null
  }

  // Leer configuración desde variables de entorno
  let config: MaintenanceConfig = { 
    enabled: process.env.MAINTENANCE_MODE === 'true',
    startTime: process.env.MAINTENANCE_START_TIME,
    estimatedDuration: process.env.MAINTENANCE_DURATION,
    reason: process.env.MAINTENANCE_REASON,
    allowedIPs: process.env.MAINTENANCE_ALLOWED_IPS?.split(','),
    bypassKey: process.env.MAINTENANCE_BYPASS_KEY
  }

  // Verificar bypass key en query params
  const url = request.nextUrl
  const bypassKey = url.searchParams.get('bypass')
  if (bypassKey && config.bypassKey && bypassKey === config.bypassKey) {
    console.log('🔑 Acceso con clave de bypass permitido')
    return null
  }

  // Verificar IP permitida
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   request.ip || 
                   '127.0.0.1'

  if (config.allowedIPs && config.allowedIPs.includes(clientIP.split(',')[0].trim())) {
    console.log(`🌐 IP permitida durante mantenimiento: ${clientIP}`)
    return null
  }

  // Permitir acceso a recursos estáticos y API de salud
  const pathname = url.pathname
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/maintenance'
  ) {
    return null
  }

  // Redirigir a página de mantenimiento
  const maintenanceUrl = url.clone()
  maintenanceUrl.pathname = '/maintenance'
  
  return NextResponse.redirect(maintenanceUrl)
}

export function getMaintenanceInfo(): MaintenanceConfig | null {
  if (!process.env.MAINTENANCE_MODE || process.env.MAINTENANCE_MODE !== 'true') {
    return null
  }

  return {
    enabled: true,
    startTime: process.env.MAINTENANCE_START_TIME,
    estimatedDuration: process.env.MAINTENANCE_DURATION,
    reason: process.env.MAINTENANCE_REASON,
    allowedIPs: process.env.MAINTENANCE_ALLOWED_IPS?.split(','),
    bypassKey: process.env.MAINTENANCE_BYPASS_KEY
  }
}