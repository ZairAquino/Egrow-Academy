#!/usr/bin/env tsx

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * Script para migrar backups existentes del proyecto a las carpetas del equipo
 */

interface BackupLocation {
  name: string
  sourcePath: string
  targetPath: string
  exists: boolean
  files: string[]
}

class BackupMigrator {
  private locations: BackupLocation[] = []

  constructor() {
    this.initializeLocations()
  }

  private initializeLocations(): void {
    const documentsPath = path.join(os.homedir(), 'Documents')
    
    this.locations = [
      {
        name: 'Desarrollo',
        sourcePath: './backups',
        targetPath: path.join(documentsPath, 'Backups egrow academy', 'database'),
        exists: false,
        files: []
      },
      {
        name: 'Producción',
        sourcePath: './backups',
        targetPath: path.join(documentsPath, 'backup-produccion'),
        exists: false,
        files: []
      }
    ]
  }

  public async migrateBackups(): Promise<void> {
    console.log('🚚 Migrando backups del proyecto a las carpetas del equipo...\n')

    for (const location of this.locations) {
      await this.migrateLocation(location)
    }

    this.displayResults()
  }

  private async migrateLocation(location: BackupLocation): Promise<void> {
    try {
      // Verificar si existe el directorio fuente
      if (!fs.existsSync(location.sourcePath)) {
        console.log(`❌ No existe el directorio fuente: ${location.sourcePath}`)
        return
      }

      // Crear directorio destino si no existe
      if (!fs.existsSync(location.targetPath)) {
        fs.mkdirSync(location.targetPath, { recursive: true })
        console.log(`📁 Creado directorio destino: ${location.targetPath}`)
      }

      // Obtener archivos de backup del directorio fuente
      const sourceFiles = fs.readdirSync(location.sourcePath)
      const backupFiles = sourceFiles.filter(file => 
        file.includes('egrow-academy-') && 
        (file.endsWith('.sql') || file.endsWith('.sql.gz') || file.endsWith('.sql.enc') || 
         file.endsWith('.json') || file.endsWith('.json.gz') || file.endsWith('.json.enc'))
      )

      console.log(`📋 ${location.name}: Encontrados ${backupFiles.length} archivos de backup`)

      let migratedCount = 0
      let skippedCount = 0

      for (const file of backupFiles) {
        const sourceFilePath = path.join(location.sourcePath, file)
        const targetFilePath = path.join(location.targetPath, file)

        // Verificar si el archivo ya existe en el destino
        if (fs.existsSync(targetFilePath)) {
          console.log(`   ⏭️  Saltando ${file} (ya existe en destino)`)
          skippedCount++
          continue
        }

        try {
          // Copiar archivo
          fs.copyFileSync(sourceFilePath, targetFilePath)
          console.log(`   ✅ Copiado: ${file}`)
          migratedCount++
        } catch (error) {
          console.error(`   ❌ Error copiando ${file}:`, error.message)
        }
      }

      console.log(`   📊 Resumen ${location.name}: ${migratedCount} copiados, ${skippedCount} saltados\n`)

    } catch (error) {
      console.error(`❌ Error migrando ${location.name}:`, error)
    }
  }

  private displayResults(): void {
    console.log('📊 RESULTADO DE MIGRACIÓN:\n')

    for (const location of this.locations) {
      const status = fs.existsSync(location.targetPath) ? '✅' : '❌'
      console.log(`${status} ${location.name}`)
      console.log(`   Origen: ${location.sourcePath}`)
      console.log(`   Destino: ${location.targetPath}`)
      
      if (fs.existsSync(location.targetPath)) {
        const files = fs.readdirSync(location.targetPath)
        const backupFiles = files.filter(file => 
          file.includes('egrow-academy-') && 
          (file.endsWith('.sql') || file.endsWith('.sql.gz') || file.endsWith('.sql.enc') || 
           file.endsWith('.json') || file.endsWith('.json.gz') || file.endsWith('.json.enc'))
        )
        console.log(`   Archivos en destino: ${backupFiles.length}`)
      }
      console.log('')
    }

    console.log('✅ Migración completada. Los backups ahora están disponibles en ambas ubicaciones.')
  }

  public async listAllBackups(): Promise<void> {
    console.log('📋 LISTA COMPLETA DE BACKUPS:\n')

    for (const location of this.locations) {
      console.log(`📍 ${location.name}:`)
      
      // Listar archivos en origen
      if (fs.existsSync(location.sourcePath)) {
        const sourceFiles = fs.readdirSync(location.sourcePath)
        const sourceBackupFiles = sourceFiles.filter(file => 
          file.includes('egrow-academy-') && 
          (file.endsWith('.sql') || file.endsWith('.sql.gz') || file.endsWith('.sql.enc') || 
           file.endsWith('.json') || file.endsWith('.json.gz') || file.endsWith('.json.enc'))
        )
        console.log(`   Origen (${location.sourcePath}): ${sourceBackupFiles.length} archivos`)
        sourceBackupFiles.slice(0, 3).forEach(file => {
          console.log(`     - ${file}`)
        })
        if (sourceBackupFiles.length > 3) {
          console.log(`     ... y ${sourceBackupFiles.length - 3} más`)
        }
      }

      // Listar archivos en destino
      if (fs.existsSync(location.targetPath)) {
        const targetFiles = fs.readdirSync(location.targetPath)
        const targetBackupFiles = targetFiles.filter(file => 
          file.includes('egrow-academy-') && 
          (file.endsWith('.sql') || file.endsWith('.sql.gz') || file.endsWith('.sql.enc') || 
           file.endsWith('.json') || file.endsWith('.json.gz') || file.endsWith('.json.enc'))
        )
        console.log(`   Destino (${location.targetPath}): ${targetBackupFiles.length} archivos`)
        targetBackupFiles.slice(0, 3).forEach(file => {
          console.log(`     - ${file}`)
        })
        if (targetBackupFiles.length > 3) {
          console.log(`     ... y ${targetBackupFiles.length - 3} más`)
        }
      }
      console.log('')
    }
  }
}

async function main() {
  const migrator = new BackupMigrator()
  
  const command = process.argv[2]
  
  switch (command) {
    case 'migrate':
      await migrator.migrateBackups()
      break
    case 'list':
      await migrator.listAllBackups()
      break
    default:
      console.log('Uso: npm run migrate-backups [migrate|list]')
      console.log('  migrate - Migrar backups del proyecto a las carpetas del equipo')
      console.log('  list    - Listar todos los backups en ambas ubicaciones')
      process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { BackupMigrator } 