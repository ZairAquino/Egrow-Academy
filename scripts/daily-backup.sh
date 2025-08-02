#!/bin/bash
# Script de backup diario para eGrow Academy
# Ejecutar este script al final del día

echo "[$(date)] Iniciando backup diario de eGrow Academy..."

# Cambiar al directorio del proyecto
cd "$(dirname "$0")/.."

echo "[$(date)] Ejecutando backup de base de datos..."
npx tsx scripts/simple-backup.ts both

echo "[$(date)] Backup diario completado."

# Para programar con cron en Linux/Mac:
# Ejecutar: crontab -e
# Agregar línea: 0 23 * * * /ruta/al/proyecto/scripts/daily-backup.sh
# Esto ejecutará el backup todos los días a las 23:00

# Para hacer el script ejecutable:
# chmod +x scripts/daily-backup.sh