# 🔒 Sistema de Backup - eGrow Academy

## 📋 Resumen

Este sistema de backup está diseñado para crear copias de seguridad de la base de datos de eGrow Academy tanto para el entorno de desarrollo como de producción.

## 🛠️ Scripts Disponibles

### 1. `simple-backup.ts` - Script Principal de Backup

```bash
# Backup solo de desarrollo
npx tsx scripts/simple-backup.ts backup desarrollo

# Backup solo de producción  
npx tsx scripts/simple-backup.ts backup produccion

# Backup de ambos entornos
npx tsx scripts/simple-backup.ts both

# Listar backups existentes
npx tsx scripts/simple-backup.ts list
```

### 2. Scripts de Automatización

#### Windows (`daily-backup.bat`)
- Para programar en Windows usando Task Scheduler
- Se ejecuta automáticamente todos los días

#### Linux/Mac (`daily-backup.sh`)
- Para programar usando cron
- Se ejecuta automáticamente todos los días

## 📁 Ubicación de Backups

Los backups se almacenan en: `./backups/`

### Formato de Archivos

- **JSON**: `egrow-academy-{ambiente}-{timestamp}.json`
- **SQL**: `egrow-academy-{ambiente}-{timestamp}.sql`

## 📊 Datos Respaldados

El sistema respalda las siguientes tablas:

- ✅ **users** - Usuarios del sistema
- ✅ **courses** - Cursos disponibles  
- ✅ **lessons** - Lecciones de los cursos
- ✅ **enrollments** - Inscripciones de usuarios
- ✅ **progress** - Progreso de usuarios en cursos
- ✅ **payments** - Pagos realizados
- ✅ **resources** - Recursos disponibles
- ✅ **events** - Eventos programados
- ✅ **eventRegistrations** - Registros a eventos
- ✅ **ratings** - Calificaciones de cursos
- ✅ **achievements** - Logros del sistema
- ✅ **userAchievements** - Logros de usuarios
- ✅ **promotions** - Promociones activas
- ✅ **userPromotions** - Promociones de usuarios

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
# Desarrollo
DATABASE_URL="postgresql://..."

# Producción (una de estas)
DATABASE_URL_PRODUCTION="postgresql://..."
POSTGRES_URL="postgresql://..."
```

## ⚙️ Automatización

### Windows - Task Scheduler

1. Abrir "Programador de tareas" (Task Scheduler)
2. Crear tarea básica
3. Configurar para ejecutar diariamente a las 23:00
4. Acción: Iniciar programa
5. Programa: `C:\Users\think\Egrow-Academy\scripts\daily-backup.bat`

### Linux/Mac - Cron

```bash
# Hacer ejecutable el script
chmod +x scripts/daily-backup.sh

# Editar crontab
crontab -e

# Agregar línea para ejecutar diariamente a las 23:00
0 23 * * * /ruta/al/proyecto/scripts/daily-backup.sh
```

## 📈 Monitoreo

### Verificar Últimos Backups

```bash
npx tsx scripts/simple-backup.ts list
```

### Log de Backup

Los scripts generan logs con:
- Timestamp de inicio y finalización
- Número de registros exportados por tabla
- Tamaño de archivos generados
- Errores (si los hay)

## 🚨 Troubleshooting

### Error: "Cannot read properties of undefined (reading 'findMany')"

Algunas tablas pueden no existir en tu esquema actual. Esto es normal y no afecta el backup de las tablas existentes.

### Error: "DATABASE_URL no está configurada"

Asegúrate de que el archivo `.env` contenga la variable `DATABASE_URL`.

### Error: "No se encontró configuración de producción"

Para backups de producción, configura `DATABASE_URL_PRODUCTION` o `POSTGRES_URL` en tu archivo `.env`.

## 🔐 Seguridad

- Los backups contienen datos sensibles
- **NO** subas los archivos de backup a repositorios públicos
- Mantén los backups en ubicaciones seguras
- Considera encriptar los backups para almacenamiento a largo plazo

## 📝 Restauración

Para restaurar desde un backup:

1. **Backup JSON**: Usa el formato JSON para restaurar datos usando Prisma
2. **Backup SQL**: Ejecuta el archivo SQL directamente en tu base de datos

```bash
# Ejemplo de restauración SQL (ajustar según tu configuración)
psql -h localhost -d neondb -U username -f backups/egrow-academy-desarrollo-2025-08-02T16-38-49.sql
```

---

📅 **Última actualización**: 2 de agosto de 2025  
🔄 **Próxima revisión**: Al final del día para verificar el backup automático