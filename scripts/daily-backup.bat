@echo off
REM Script de backup diario para eGrow Academy
REM Ejecutar este script al final del día

echo [%date% %time%] Iniciando backup diario de eGrow Academy...

cd /d "C:\Users\think\Egrow-Academy"

echo [%date% %time%] Ejecutando backup de base de datos...
npx tsx scripts/simple-backup.ts both

echo [%date% %time%] Backup diario completado.

REM Para programar este script en Windows:
REM 1. Abrir "Programador de tareas" (Task Scheduler)
REM 2. Crear tarea básica
REM 3. Configurar para ejecutar diariamente a las 23:00
REM 4. Acción: Iniciar programa
REM 5. Programa: C:\Users\think\Egrow-Academy\scripts\daily-backup.bat

pause