#!/usr/bin/env tsx

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

class MaintenanceMode {
  private configPath: string
  private flagPath: string

  constructor() {
    this.configPath = path.join(process.cwd(), '.maintenance.json')
    this.flagPath = path.join(process.cwd(), '.maintenance-flag')
  }

  public async enable(options: {
    reason?: string
    duration?: string
    allowedIPs?: string[]
  } = {}): Promise<void> {
    const config: MaintenanceConfig = {
      enabled: true,
      startTime: new Date().toISOString(),
      estimatedDuration: options.duration || '15 minutos',
      reason: options.reason || 'Actualización de contenido',
      allowedIPs: options.allowedIPs || ['127.0.0.1', '::1'],
      bypassKey: this.generateBypassKey()
    }

    // Crear archivo de configuración
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2))
    
    // Crear flag file para verificación rápida
    fs.writeFileSync(this.flagPath, 'MAINTENANCE_MODE_ENABLED')

    console.log('🚧 Modo mantenimiento ACTIVADO')
    console.log(`⏰ Iniciado: ${config.startTime}`)
    console.log(`⏱️ Duración estimada: ${config.estimatedDuration}`)
    console.log(`📝 Razón: ${config.reason}`)
    console.log(`🔑 Clave de bypass: ${config.bypassKey}`)
    console.log(`🌐 IPs permitidas: ${config.allowedIPs?.join(', ')}`)
  }

  public async disable(): Promise<void> {
    if (fs.existsSync(this.configPath)) {
      const config = this.getConfig()
      const endTime = new Date().toISOString()
      const startTime = new Date(config.startTime || Date.now())
      const duration = Math.round((Date.now() - startTime.getTime()) / 1000 / 60)

      fs.unlinkSync(this.configPath)
      
      if (fs.existsSync(this.flagPath)) {
        fs.unlinkSync(this.flagPath)
      }

      console.log('✅ Modo mantenimiento DESACTIVADO')
      console.log(`⏰ Finalizado: ${endTime}`)
      console.log(`⏱️ Duración real: ${duration} minutos`)
    } else {
      console.log('ℹ️ Modo mantenimiento ya estaba desactivado')
    }
  }

  public isEnabled(): boolean {
    return fs.existsSync(this.flagPath)
  }

  public getConfig(): MaintenanceConfig {
    if (!fs.existsSync(this.configPath)) {
      return { enabled: false }
    }

    try {
      const configContent = fs.readFileSync(this.configPath, 'utf-8')
      return JSON.parse(configContent)
    } catch (error) {
      console.error('Error leyendo configuración de mantenimiento:', error)
      return { enabled: false }
    }
  }

  public getStatus(): void {
    if (this.isEnabled()) {
      const config = this.getConfig()
      const startTime = new Date(config.startTime || Date.now())
      const elapsed = Math.round((Date.now() - startTime.getTime()) / 1000 / 60)

      console.log('🚧 MODO MANTENIMIENTO ACTIVO')
      console.log(`⏰ Iniciado: ${config.startTime}`)
      console.log(`⏱️ Tiempo transcurrido: ${elapsed} minutos`)
      console.log(`⏱️ Duración estimada: ${config.estimatedDuration}`)
      console.log(`📝 Razón: ${config.reason}`)
      console.log(`🔑 Clave bypass: ${config.bypassKey}`)
    } else {
      console.log('✅ Modo mantenimiento DESACTIVADO')
    }
  }

  private generateBypassKey(): string {
    return 'bypass_' + Math.random().toString(36).substring(2, 15)
  }

  public async scheduleEnable(delayMinutes: number, options: {
    reason?: string
    duration?: string
  } = {}): Promise<void> {
    const enableTime = new Date(Date.now() + delayMinutes * 60 * 1000)
    
    console.log(`⏰ Modo mantenimiento programado para: ${enableTime.toLocaleString()}`)
    console.log(`⏱️ En ${delayMinutes} minutos`)
    
    setTimeout(() => {
      this.enable(options)
    }, delayMinutes * 60 * 1000)
    
    console.log('📅 Programación establecida exitosamente')
  }
}

async function main() {
  const maintenance = new MaintenanceMode()
  const command = process.argv[2]
  const flags = process.argv.slice(3)

  // Parsear flags
  const options = {
    reason: flags.find(f => f.startsWith('--reason='))?.split('=')[1],
    duration: flags.find(f => f.startsWith('--duration='))?.split('=')[1],
    allowedIPs: flags.find(f => f.startsWith('--ips='))?.split('=')[1]?.split(','),
    schedule: flags.find(f => f.startsWith('--schedule='))?.split('=')[1]
  }

  switch (command) {
    case 'enable':
    case 'on':
      if (options.schedule) {
        const minutes = parseInt(options.schedule)
        await maintenance.scheduleEnable(minutes, options)
      } else {
        await maintenance.enable(options)
      }
      break

    case 'disable':
    case 'off':
      await maintenance.disable()
      break

    case 'status':
    case 'check':
      maintenance.getStatus()
      break

    case 'config':
      const config = maintenance.getConfig()
      console.log('📋 Configuración actual:')
      console.log(JSON.stringify(config, null, 2))
      break

    default:
      console.log('🚧 Control de Modo Mantenimiento')
      console.log('')
      console.log('Comandos:')
      console.log('  enable/on    - Activar modo mantenimiento')
      console.log('  disable/off  - Desactivar modo mantenimiento')
      console.log('  status/check - Ver estado actual')
      console.log('  config       - Ver configuración')
      console.log('')
      console.log('Opciones:')
      console.log('  --reason="Mensaje"     - Razón del mantenimiento')
      console.log('  --duration="30 min"    - Duración estimada')
      console.log('  --ips="ip1,ip2"        - IPs permitidas')
      console.log('  --schedule=5           - Programar para X minutos')
      console.log('')
      console.log('Ejemplos:')
      console.log('  npx tsx scripts/maintenance-mode.ts enable --reason="Nuevo curso"')
      console.log('  npx tsx scripts/maintenance-mode.ts enable --schedule=5')
      console.log('  npx tsx scripts/maintenance-mode.ts status')
      console.log('  npx tsx scripts/maintenance-mode.ts disable')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { MaintenanceMode }