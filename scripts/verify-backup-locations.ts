#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * Script de verificación de ubicaciones de backup
 * Verifica que los backups se estén guardando en las carpetas correctas
 */

interface BackupLocation {
  name: string
  path: string
  exists: boolean
  files: string[]
  totalSize: number
}

class BackupLocationVerifier {
  private locations: BackupLocation[] = []

  constructor() {
    this.initializeLocations()
  }

  private initializeLocations(): void {
    const documentsPath = path.join(os.homedir(), 'Documents')
    
    this.locations = [
      {
        name: 'Proyecto (./backups)',
        path: './backups',
        exists: false,
        files: [],
        totalSize: 0
      },
      {
        name: 'Desarrollo (Documents/Backups egrow academy/database)',
        path: path.join(documentsPath, 'Backups egrow academy', 'database'),
        exists: false,
        files: [],
        totalSize: 0
      },
      {
        name: 'Producción (Documents/backup-produccion)',
        path: path.join(documentsPath, 'backup-produccion'),
        exists: false,
        files: [],
        totalSize: 0
      }
    ]
  }

  public async verifyLocations(): Promise<void> {
    console.log('🔍 Verificando ubicaciones de backup...\n')

    for (const location of this.locations) {
      await this.checkLocation(location)
    }

    this.displayResults()
  }

  private async checkLocation(location: BackupLocation): Promise<void> {
    try {
      location.exists = fs.existsSync(location.path)
      
      if (location.exists) {
        const files = fs.readdirSync(location.path)
        location.files = files.filter(file => 
          file.includes('egrow-academy-') && 
          (file.endsWith('.sql') || file.endsWith('.sql.gz') || file.endsWith('.sql.enc') || 
           file.endsWith('.json') || file.endsWith('.json.gz') || file.endsWith('.json.enc'))
        )
        
        location.totalSize = location.files.reduce((total, file) => {
          const filePath = path.join(location.path, file)
          try {
            const stats = fs.statSync(filePath)
            return total + stats.size
          } catch {
            return total
          }
        }, 0)
      }
    } catch (error) {
      console.error(`❌ Error verificando ${location.name}:`, error)
    }
  }

  private displayResults(): void {
    console.log('📊 RESULTADOS DE VERIFICACIÓN:\n')

    for (const location of this.locations) {
      const status = location.exists ? '✅' : '❌'
      const sizeMB = (location.totalSize / 1024 / 1024).toFixed(2)
      
      console.log(`${status} ${location.name}`)
      console.log(`   Ruta: ${location.path}`)
      console.log(`   Existe: ${location.exists ? 'Sí' : 'No'}`)
      
      if (location.exists) {
        console.log(`   Archivos: ${location.files.length}`)
        console.log(`   Tamaño total: ${sizeMB} MB`)
        
        if (location.files.length > 0) {
          console.log('   Archivos encontrados:')
          location.files.slice(0, 5).forEach(file => {
            console.log(`     - ${file}`)
          })
          if (location.files.length > 5) {
            console.log(`     ... y ${location.files.length - 5} más`)
          }
        }
      }
      console.log('')
    }

    this.displayRecommendations()
  }

  private displayRecommendations(): void {
    console.log('💡 RECOMENDACIONES:')
    
    const projectExists = this.locations[0].exists
    const devExists = this.locations[1].exists
    const prodExists = this.locations[2].exists

    if (!projectExists) {
      console.log('   - Crear directorio ./backups en el proyecto')
    }

    if (!devExists) {
      console.log('   - Crear directorio "Backups egrow academy/database" en Documentos')
    }

    if (!prodExists) {
      console.log('   - Crear directorio "backup-produccion" en Documentos')
    }

    if (projectExists && devExists && prodExists) {
      console.log('   ✅ Todas las ubicaciones están configuradas correctamente')
    }

    console.log('\n📝 Para crear un backup de prueba:')
    console.log('   npm run backup-database backup')
  }

  public async createTestBackup(): Promise<void> {
    console.log('🧪 Creando backup de prueba...')
    
    // Simular creación de archivos de backup en todas las ubicaciones
    for (const location of this.locations) {
      if (!location.exists) {
        fs.mkdirSync(location.path, { recursive: true })
        console.log(`📁 Creado directorio: ${location.path}`)
      }
      
      const testFileName = `egrow-academy-test-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`
      const testFilePath = path.join(location.path, testFileName)
      
      const testContent = `-- Backup de prueba
-- Fecha: ${new Date().toISOString()}
-- Ubicación: ${location.name}

-- Este es un archivo de prueba para verificar la configuración de backups
SELECT 'Backup de prueba creado correctamente' as status;
`
      
      fs.writeFileSync(testFilePath, testContent)
      console.log(`✅ Backup de prueba creado: ${testFilePath}`)
    }
    
    console.log('\n✅ Backup de prueba completado. Ejecuta la verificación nuevamente.')
  }
}

async function main() {
  const verifier = new BackupLocationVerifier()
  
  const command = process.argv[2]
  
  switch (command) {
    case 'verify':
      await verifier.verifyLocations()
      break
    case 'test':
      await verifier.createTestBackup()
      break
    default:
      console.log('Uso: npm run verify-backup-locations [verify|test]')
      console.log('  verify - Verificar ubicaciones de backup')
      console.log('  test   - Crear backup de prueba')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { BackupLocationVerifier } 