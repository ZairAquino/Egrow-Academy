# Reglas de Backup - Egrow Academy

## 🏠 REGLA PRINCIPAL ESTABLECIDA

**TODOS los backups de Egrow Academy se guardan en:**
```
C:\Users\[usuario]\Documents\Backups egrow academy\
```

Esta es la **regla estándar establecida** que deben seguir todos los scripts de backup presentes y futuros.

## 📁 Estructura de Directorios

```
📂 Backups egrow academy/
├── 📁 database/              # Backups de base de datos (.sql, .json)
├── 📁 streak-system/         # Backups del sistema de rachas
├── 📁 code-backups/          # Backups de código fuente
├── 📁 schema-backups/        # Backups de esquemas de BD
└── 📁 full-system/          # Backups completos del sistema
```

## ⚙️ Configuración Estándar

### Ubicación de Configuración
- Archivo: `scripts/backup-config.ts`
- Contiene todas las rutas, patrones y configuraciones estándar

### Configuraciones Aplicadas
- **Retención**: 30 días por defecto
- **Auto-backup**: Antes de migraciones críticas
- **Compresión**: Para archivos > 10 MB
- **Nomenclatura**: Timestamp estándar ISO

## 📋 Scripts de Backup Actualizados

### Scripts que Usan la Nueva Configuración
1. `scripts/backup-streak-system.ts` - ✅ Actualizado
2. `scripts/backup-streak-files.ts` - ✅ Actualizado
3. `scripts/backup-database.ts` - ✅ Importa configuración

### Patrón de Uso en Scripts
```typescript
import { BACKUP_CONFIG, getBackupPath, generateBackupFilename, ensureBackupDirectories } from './backup-config';

// Crear directorios si no existen
await ensureBackupDirectories();

// Obtener ruta estándar para tipo específico
const backupPath = getBackupPath(BACKUP_CONFIG.SUBDIRS.STREAK_SYSTEM);

// Generar nombre con timestamp estándar
const filename = generateBackupFilename(BACKUP_CONFIG.FILENAME_PATTERNS.STREAK_SYSTEM) + '.json';
```

## 🚀 Beneficios de la Regla Estándar

1. **Centralización**: Todos los backups en una ubicación conocida
2. **Organización**: Subdirectorios por tipo de backup
3. **Accesibilidad**: En la carpeta Documentos del usuario
4. **Consistencia**: Nomenclatura y estructura uniforme
5. **Mantenimiento**: Fácil limpieza y gestión de backups antiguos

## 📊 Estado Actual

### Backups Migrados
✅ Todos los backups existentes copiados a la nueva ubicación
✅ Scripts actualizados para usar configuración estándar
✅ Estructura de directorios creada
✅ Documentación establecida

### Backups Disponibles
- **Base de datos**: 20+ backups de desarrollo y producción
- **Sistema de rachas**: Backup completo con datos y código
- **Configuraciones**: Metadatos y esquemas

## 🎯 Cumplimiento de la Regla

**OBLIGATORIO**: Todos los nuevos scripts de backup deben:
1. Importar y usar `backup-config.ts`
2. Guardar en la ubicación estándar
3. Usar patrones de nomenclatura definidos
4. Crear subdirectorios apropiados

Esta regla aplica para **todos los tipos de backup**:
- Bases de datos
- Código fuente
- Configuraciones
- Sistemas específicos (como rachas)
- Backups completos

## 📞 Mantenimiento

Para verificar el cumplimiento de las reglas:
```bash
npx tsx scripts/backup-config.ts info
```

Esta regla queda **ESTABLECIDA** como estándar para el proyecto Egrow Academy.