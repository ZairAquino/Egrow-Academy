# Backup del Sistema de Rachas - Egrow Academy

Este directorio contiene backups completos del sistema de rachas semanales implementado para la plataforma Egrow Academy.

## 📁 Archivos de Backup

### Datos del Sistema
- **`streak-system-backup-*.json`**: Backup completo de todas las tablas de datos del sistema de rachas
- **`streak-system-config-*.json`**: Configuración y metadatos del sistema

### Código Fuente
- **`streak-files-backup-*.json`**: Backup de todos los archivos de código del sistema
- **`streak-schema-backup-*.json`**: Esquema de base de datos (modelos Prisma)

## 🏆 Sistema de Rachas Implementado

### Características Principales
- **Meta Semanal**: 5 lecciones por semana (lunes a domingo)
- **Sistema de Puntos**: 5 puntos base + bonificaciones por diversidad
- **7 Niveles de Badges**: PRINCIPIANTE → ESTUDIANTE → DEDICADO → EN_LLAMAS → IMPARABLE → MAESTRO → LEYENDA
- **Recuperación de Rachas**: Usar puntos acumulados para recuperar rachas perdidas
- **Integración Automática**: Se activa al completar lecciones en cualquier curso

### Tablas de Base de Datos
1. **user_streaks**: Racha actual del usuario y estadísticas generales
2. **user_weekly_history**: Historial semanal de progreso
3. **user_streak_badges**: Badges obtenidos por el usuario
4. **user_points_history**: Historial de transacciones de puntos
5. **streak_recovery_history**: Registro de recuperaciones de rachas
6. **weekly_lesson_completions**: Lecciones completadas por semana y curso

### Archivos Implementados
- `src/lib/streaks.ts` - Lógica principal (550+ líneas)
- `src/components/streaks/StreakDisplay.tsx` - Componente UI
- `src/hooks/useStreaks.ts` - Hook React
- `src/app/api/streaks/route.ts` - API endpoint
- Scripts de prueba y documentación

## 🔧 Restauración

Para restaurar el sistema desde backup:

1. **Base de Datos**: Usar `npx prisma db push` con el schema actualizado
2. **Datos**: Importar desde `streak-system-backup-*.json`
3. **Código**: Restaurar archivos desde `streak-files-backup-*.json`

## 📊 Estadísticas del Backup

- **Total de archivos respaldados**: 8 archivos de código
- **Líneas de código**: 1,616 líneas
- **Tablas de BD**: 6 nuevas tablas + 2 enums
- **Funcionalidades**: Sistema completo operativo

## 🎯 Estado del Sistema

✅ **Completamente funcional**
- Base de datos sincronizada
- Integración automática con progreso de lecciones
- Componente UI integrado en dropdown de usuario
- API endpoint operativo
- Scripts de prueba verificados

## 📅 Fecha de Backup
**2025-08-02**: Sistema implementado y verificado en desarrollo