import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

interface MaintenanceConfig {
  enabled: boolean
  startTime?: string
  estimatedDuration?: string
  reason?: string
  allowedIPs?: string[]
  bypassKey?: string
}

export function checkMaintenanceMode(request: NextRequest): NextResponse | null {
  // Solo en producción
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  const flagPath = path.join(process.cwd(), '.maintenance-flag')
  const configPath = path.join(process.cwd(), '.maintenance.json')

  // Verificar si modo mantenimiento está activo
  if (!fs.existsSync(flagPath)) {
    return null
  }

  // Leer configuración
  let config: MaintenanceConfig = { enabled: true }
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      config = JSON.parse(configContent)
    } catch (error) {
      console.error('Error leyendo configuración de mantenimiento:', error)
    }
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
  const flagPath = path.join(process.cwd(), '.maintenance-flag')
  const configPath = path.join(process.cwd(), '.maintenance.json')

  if (!fs.existsSync(flagPath)) {
    return null
  }

  if (!fs.existsSync(configPath)) {
    return { enabled: true }
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(configContent)
  } catch (error) {
    console.error('Error leyendo configuración de mantenimiento:', error)
    return { enabled: true }
  }
}