#!/usr/bin/env tsx

import { prisma } from '@/lib/prisma'
import { getClientIP } from '@/lib/security'
import * as fs from 'fs'
import * as path from 'path'

interface SecurityAuditResult {
  category: string
  check: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  details: string
  recommendation?: string
}

interface SecurityReport {
  timestamp: string
  totalChecks: number
  passedChecks: number
  failedChecks: number
  warnings: number
  results: SecurityAuditResult[]
}

class SecurityAuditor {
  private results: SecurityAuditResult[] = []

  private addResult(result: SecurityAuditResult): void {
    this.results.push(result)
  }

  // Verificar configuración de variables de entorno
  private async checkEnvironmentVariables(): Promise<void> {
    const requiredVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXTAUTH_SECRET'
    ]

    const optionalVars = [
      'RESEND_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ]

    // Verificar variables requeridas
    for (const varName of requiredVars) {
      const value = process.env[varName]
      if (!value) {
        this.addResult({
          category: 'Environment Variables',
          check: `Required variable: ${varName}`,
          status: 'FAIL',
          details: `Variable ${varName} no está configurada`,
          recommendation: `Configurar ${varName} en las variables de entorno`
        })
      } else {
        this.addResult({
          category: 'Environment Variables',
          check: `Required variable: ${varName}`,
          status: 'PASS',
          details: `Variable ${varName} está configurada`
        })
      }
    }

    // Verificar variables opcionales
    for (const varName of optionalVars) {
      const value = process.env[varName]
      if (!value) {
        this.addResult({
          category: 'Environment Variables',
          check: `Optional variable: ${varName}`,
          status: 'WARNING',
          details: `Variable ${varName} no está configurada`,
          recommendation: `Considerar configurar ${varName} para funcionalidad completa`
        })
      } else {
        this.addResult({
          category: 'Environment Variables',
          check: `Optional variable: ${varName}`,
          status: 'PASS',
          details: `Variable ${varName} está configurada`
        })
      }
    }
  }

  // Verificar seguridad de JWT
  private async checkJWTSecurity(): Promise<void> {
    const jwtSecret = process.env.JWT_SECRET
    
    if (!jwtSecret) {
      this.addResult({
        category: 'JWT Security',
        check: 'JWT Secret Configuration',
        status: 'FAIL',
        details: 'JWT_SECRET no está configurado',
        recommendation: 'Configurar JWT_SECRET con un valor seguro'
      })
      return
    }

    if (jwtSecret.length < 32) {
      this.addResult({
        category: 'JWT Security',
        check: 'JWT Secret Strength',
        status: 'WARNING',
        details: 'JWT_SECRET es muy corto',
        recommendation: 'Usar un JWT_SECRET de al menos 32 caracteres'
      })
    } else {
      this.addResult({
        category: 'JWT Security',
        check: 'JWT Secret Strength',
        status: 'PASS',
        details: 'JWT_SECRET tiene longitud adecuada'
      })
    }

    // Verificar si es el valor por defecto
    if (jwtSecret === 'your-secret-key' || jwtSecret === 'dev-secret') {
      this.addResult({
        category: 'JWT Security',
        check: 'JWT Secret Default Value',
        status: 'FAIL',
        details: 'JWT_SECRET usa valor por defecto',
        recommendation: 'Cambiar JWT_SECRET por un valor único y seguro'
      })
    } else {
      this.addResult({
        category: 'JWT Security',
        check: 'JWT Secret Default Value',
        status: 'PASS',
        details: 'JWT_SECRET no usa valor por defecto'
      })
    }
  }

  // Verificar configuración de base de datos
  private async checkDatabaseSecurity(): Promise<void> {
    try {
      // Verificar conexión a base de datos
      await prisma.$queryRaw`SELECT 1`
      this.addResult({
        category: 'Database Security',
        check: 'Database Connection',
        status: 'PASS',
        details: 'Conexión a base de datos exitosa'
      })

      // Verificar si la URL de la base de datos usa SSL
      const dbUrl = process.env.DATABASE_URL
      if (dbUrl && dbUrl.includes('sslmode=require')) {
        this.addResult({
          category: 'Database Security',
          check: 'Database SSL',
          status: 'PASS',
          details: 'Conexión a base de datos usa SSL'
        })
      } else {
        this.addResult({
          category: 'Database Security',
          check: 'Database SSL',
          status: 'WARNING',
          details: 'Conexión a base de datos no usa SSL explícitamente',
          recommendation: 'Agregar sslmode=require a DATABASE_URL'
        })
      }

    } catch (error) {
      this.addResult({
        category: 'Database Security',
        check: 'Database Connection',
        status: 'FAIL',
        details: `Error conectando a la base de datos: ${error}`,
        recommendation: 'Verificar DATABASE_URL y conexión de red'
      })
    }
  }

  // Verificar logs de seguridad
  private async checkSecurityLogs(): Promise<void> {
    try {
      // Comentado temporalmente hasta que se resuelva el problema de la tabla
      /*
      const recentLogs = await prisma.securityLog.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' }
      })

      if (recentLogs.length > 0) {
        this.addResult({
          category: 'Security Logging',
          check: 'Security Logs',
          status: 'PASS',
          details: `${recentLogs.length} logs de seguridad recientes encontrados`
        })

        // Verificar eventos sospechosos
        const suspiciousEvents = recentLogs.filter(log => 
          log.event.includes('FAILED') || 
          log.event.includes('ERROR') ||
          log.event.includes('ATTACK')
        )

        if (suspiciousEvents.length > 0) {
          this.addResult({
            category: 'Security Logging',
            check: 'Suspicious Events',
            status: 'WARNING',
            details: `${suspiciousEvents.length} eventos sospechosos detectados`,
            recommendation: 'Revisar logs de seguridad para actividad sospechosa'
          })
        }
      } else {
        this.addResult({
          category: 'Security Logging',
          check: 'Security Logs',
          status: 'WARNING',
          details: 'No se encontraron logs de seguridad recientes',
          recommendation: 'Verificar que el logging de seguridad esté funcionando'
        })
      }
      */
      
      // Resultado temporal
      this.addResult({
        category: 'Security Logging',
        check: 'Security Logs',
        status: 'WARNING',
        details: 'Verificación de logs temporalmente deshabilitada',
        recommendation: 'Configurar tabla security_logs en base de datos'
      })
      
    } catch (error) {
      this.addResult({
        category: 'Security Logging',
        check: 'Security Logs',
        status: 'FAIL',
        details: `Error accediendo a logs de seguridad: ${error}`,
        recommendation: 'Verificar configuración de base de datos para logs'
      })
    }
  }

  // Verificar archivos de configuración
  private async checkConfigurationFiles(): Promise<void> {
    const configFiles = [
      'next.config.ts',
      'tailwind.config.ts',
      'tsconfig.json',
      'package.json'
    ]

    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        this.addResult({
          category: 'Configuration Files',
          check: `File exists: ${file}`,
          status: 'PASS',
          details: `Archivo ${file} existe`
        })
      } else {
        this.addResult({
          category: 'Configuration Files',
          check: `File exists: ${file}`,
          status: 'FAIL',
          details: `Archivo ${file} no existe`,
          recommendation: `Crear archivo ${file}`
        })
      }
    }

    // Verificar .env.example
    if (fs.existsSync('.env.example')) {
      this.addResult({
        category: 'Configuration Files',
        check: 'Environment example file',
        status: 'PASS',
        details: 'Archivo .env.example existe'
      })
    } else {
      this.addResult({
        category: 'Configuration Files',
        check: 'Environment example file',
        status: 'WARNING',
        details: 'Archivo .env.example no existe',
        recommendation: 'Crear .env.example para documentar variables requeridas'
      })
    }
  }

  // Verificar dependencias de seguridad
  private async checkSecurityDependencies(): Promise<void> {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const securityDeps = [
      'bcryptjs',
      'jsonwebtoken',
      'helmet'
    ]

    for (const dep of securityDeps) {
      if (dependencies[dep]) {
        this.addResult({
          category: 'Security Dependencies',
          check: `Dependency: ${dep}`,
          status: 'PASS',
          details: `Dependencia ${dep} está instalada`
        })
      } else {
        this.addResult({
          category: 'Security Dependencies',
          check: `Dependency: ${dep}`,
          status: 'WARNING',
          details: `Dependencia ${dep} no está instalada`,
          recommendation: `Considerar instalar ${dep} para mejorar seguridad`
        })
      }
    }
  }

  // Verificar headers de seguridad
  private async checkSecurityHeaders(): Promise<void> {
    // Esta verificación se haría con una petición HTTP real
    // Por ahora, verificamos que el middleware esté configurado
    const middlewarePath = 'src/middleware.ts'
    
    if (fs.existsSync(middlewarePath)) {
      const middlewareContent = fs.readFileSync(middlewarePath, 'utf8')
      
      const securityHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security'
      ]

      for (const header of securityHeaders) {
        if (middlewareContent.includes(header)) {
          this.addResult({
            category: 'Security Headers',
            check: `Header: ${header}`,
            status: 'PASS',
            details: `Header ${header} está configurado`
          })
        } else {
          this.addResult({
            category: 'Security Headers',
            check: `Header: ${header}`,
            status: 'WARNING',
            details: `Header ${header} no está configurado`,
            recommendation: `Agregar header ${header} al middleware`
          })
        }
      }
    } else {
      this.addResult({
        category: 'Security Headers',
        check: 'Middleware file',
        status: 'FAIL',
        details: 'Archivo middleware.ts no existe',
        recommendation: 'Crear middleware.ts para configurar headers de seguridad'
      })
    }
  }

  // Generar reporte
  private generateReport(): SecurityReport {
    const passedChecks = this.results.filter(r => r.status === 'PASS').length
    const failedChecks = this.results.filter(r => r.status === 'FAIL').length
    const warnings = this.results.filter(r => r.status === 'WARNING').length

    return {
      timestamp: new Date().toISOString(),
      totalChecks: this.results.length,
      passedChecks,
      failedChecks,
      warnings,
      results: this.results
    }
  }

  // Ejecutar auditoría completa
  public async runAudit(): Promise<SecurityReport> {
    console.log('🔍 Iniciando auditoría de seguridad de eGrow Academy...\n')

    await this.checkEnvironmentVariables()
    await this.checkJWTSecurity()
    await this.checkDatabaseSecurity()
    await this.checkSecurityLogs()
    await this.checkConfigurationFiles()
    await this.checkSecurityDependencies()
    await this.checkSecurityHeaders()

    const report = this.generateReport()
    return report
  }

  // Imprimir reporte
  public printReport(report: SecurityReport): void {
    console.log('📊 REPORTE DE AUDITORÍA DE SEGURIDAD')
    console.log('=====================================\n')

    console.log(`📅 Fecha: ${new Date(report.timestamp).toLocaleString()}`)
    console.log(`✅ Checks pasados: ${report.passedChecks}`)
    console.log(`❌ Checks fallidos: ${report.failedChecks}`)
    console.log(`⚠️ Advertencias: ${report.warnings}`)
    console.log(`📋 Total: ${report.totalChecks}\n`)

    // Agrupar por categoría
    const categories = [...new Set(report.results.map(r => r.category))]
    
    for (const category of categories) {
      console.log(`\n🔸 ${category.toUpperCase()}`)
      console.log('─'.repeat(category.length + 2))
      
      const categoryResults = report.results.filter(r => r.category === category)
      
      for (const result of categoryResults) {
        const statusIcon = result.status === 'PASS' ? '✅' : 
                          result.status === 'FAIL' ? '❌' : '⚠️'
        
        console.log(`${statusIcon} ${result.check}`)
        console.log(`   ${result.details}`)
        
        if (result.recommendation) {
          console.log(`   💡 Recomendación: ${result.recommendation}`)
        }
        console.log('')
      }
    }

    // Resumen
    console.log('\n📋 RESUMEN')
    console.log('──────────')
    
    if (report.failedChecks === 0 && report.warnings === 0) {
      console.log('🎉 ¡Excelente! No se encontraron problemas de seguridad.')
    } else if (report.failedChecks === 0) {
      console.log('✅ No hay fallos críticos, pero hay advertencias que revisar.')
    } else {
      console.log('🚨 Se encontraron problemas críticos de seguridad que deben resolverse.')
    }

    if (report.failedChecks > 0) {
      console.log('\n🔴 PROBLEMAS CRÍTICOS:')
      const failures = report.results.filter(r => r.status === 'FAIL')
      failures.forEach(failure => {
        console.log(`   • ${failure.check}: ${failure.details}`)
      })
    }

    if (report.warnings > 0) {
      console.log('\n🟡 ADVERTENCIAS:')
      const warnings = report.results.filter(r => r.status === 'WARNING')
      warnings.forEach(warning => {
        console.log(`   • ${warning.check}: ${warning.details}`)
      })
    }
  }
}

async function main() {
  const auditor = new SecurityAuditor()
  
  try {
    const report = await auditor.runAudit()
    auditor.printReport(report)
    
    // Guardar reporte en archivo
    const reportPath = `security-audit-${new Date().toISOString().split('T')[0]}.json`
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 Reporte guardado en: ${reportPath}`)
    
    // Exit code basado en resultados
    if (report.failedChecks > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error('💥 Error durante la auditoría:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { SecurityAuditor } 