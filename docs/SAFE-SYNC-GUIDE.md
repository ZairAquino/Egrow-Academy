# 🔒 Guía de Sincronización Segura - eGrow Academy

## 📋 Resumen

Este documento describe el sistema de sincronización segura implementado para resolver el problema crítico de pérdida de datos de usuarios durante las actualizaciones de desarrollo a producción.

## 🎯 Problema Resuelto

### Escenario Problemático Original
1. **Producción**: Usuario se registra, se suscribe, hace progreso, gana rachas
2. **Desarrollo**: Agregas nuevo curso, lecciones, cambios
3. **Sincronización**: Backup completo de desarrollo → producción = **PÉRDIDA TOTAL DE DATOS DE USUARIOS**

### Solución Implementada
Sincronización inteligente que respeta completamente los datos de usuarios y solo actualiza contenido.

## 🛠️ Sistema de Sincronización Segura

### Archivos Principales

- `scripts/safe-sync-to-production.ts` - Sincronización segura principal
- `scripts/validate-streaks-production.ts` - Validación del sistema de rachas
- `scripts/sync-to-production.ts` - Sincronización anterior (mantener como respaldo)

### Configuración de Tablas

#### 🟢 Tablas de Contenido (Safe to Sync)
```typescript
contentTables: [
  'courses',      // Cursos
  'lessons',      // Lecciones
  'resources',    // Recursos educativos
  'events',       // Eventos
  'promotions',   // Promociones
  'products',     // Productos Stripe
  'prices'        // Precios Stripe
]
```

#### 🔴 Tablas de Usuarios (NUNCA tocar)
```typescript
userTables: [
  'users',                    // Usuarios registrados
  'enrollments',              // Inscripciones
  'course_progress',          // Progreso de cursos
  'lesson_progress',          // Progreso por lección
  'payments',                 // Pagos reales
  'subscriptions',            // Suscripciones activas
  'user_streaks',             // Rachas ganadas
  'user_streak_badges',       // Badges otorgados
  'user_points_history',      // Puntos acumulados
  'weekly_lesson_completions', // Completaciones semanales
  'streak_recovery_history',   // Recuperaciones de rachas
  'user_behaviors',           // Comportamiento
  'recommendations',          // Recomendaciones personalizadas
  'achievements',             // Logros
  'comments',                 // Comentarios
  'likes',                    // Likes
  'posts',                    // Posts del foro
  'event_registrations',      // Registros a eventos
  'promotion_interactions',   // Interacciones con promociones
  'ratings',                  // Calificaciones
  'resource_access_logs',     // Logs de acceso
  'security_logs',            // Logs de seguridad
  'sessions',                 // Sesiones activas
  'user_preferences'          // Preferencias
]
```

## 🚀 Uso del Sistema

### 1. Comparar Entornos (Sin Cambios)
```bash
# Comparar desarrollo vs producción
npx tsx scripts/safe-sync-to-production.ts compare
```

### 2. Simulación de Sincronización
```bash
# Dry run - ver qué se sincronizaría sin hacer cambios
npx tsx scripts/safe-sync-to-production.ts dry-run
```

### 3. Sincronización Real
```bash
# Sincronizar contenido nuevo/actualizado
npx tsx scripts/safe-sync-to-production.ts sync
```

### 4. Validación de Datos de Usuarios
```bash
# Verificar que usuarios no se tocaron
npx tsx scripts/safe-sync-to-production.ts validate
```

### 5. Validación del Sistema de Rachas
```bash
# Verificación rápida
npx tsx scripts/validate-streaks-production.ts quick

# Validación completa
npx tsx scripts/validate-streaks-production.ts full
```

## 🔍 Proceso de Sincronización Segura

### Paso 1: Backup Automático
- Crea backup completo de producción antes de cualquier cambio
- Guarda en `backups/safe-sync-backup-[timestamp]/`
- Incluye todas las tablas (contenido + usuarios)

### Paso 2: Identificación de Contenido Nuevo
- Compara desarrollo vs producción
- Identifica registros nuevos (por ID)
- Identifica registros actualizados (mismo ID, contenido diferente)

### Paso 3: Sincronización Selectiva
- **Solo** sincroniza tablas de contenido
- **NUNCA** toca tablas de usuarios
- Usa estrategia UPSERT (insertar nuevos, actualizar existentes)

### Paso 4: Verificación Post-Sync
- Verifica integridad de contenido sincronizado
- Valida que datos de usuarios no se tocaron
- Confirma que sistema de rachas sigue funcionando

### Paso 5: Rollback Automático (si es necesario)
- Si se detectan problemas, restaura desde backup
- Notifica inmediatamente sobre cualquier inconsistencia

## 🛡️ Medidas de Seguridad

### Validaciones Pre-Sync
- ✅ Verifica que no se intenten modificar tablas de usuarios
- ✅ Confirma que IDs de contenido no colisionen
- ✅ Valida conectividad a ambas bases de datos

### Validaciones Post-Sync
- ✅ Verifica que usuarios pueden seguir accediendo
- ✅ Confirma que rachas y progreso se mantienen
- ✅ Valida que nuevo contenido esté disponible
- ✅ Comprueba integridad de datos críticos

### Backup y Recuperación
- ✅ Backup automático antes de cada sync
- ✅ Rollback automático si se detectan problemas
- ✅ Logs detallados de todas las operaciones
- ✅ Notificaciones de estado en tiempo real

## 📊 Monitoreo y Validación

### Verificación Rápida del Sistema
```bash
npx tsx scripts/validate-streaks-production.ts quick
```

**Salida esperada:**
```
📊 Estado del sistema:
   👥 Total usuarios: 150
   🏆 Usuarios con rachas: 45
   🏅 Total badges otorgados: 89
   📅 Completaciones esta semana: 127
✅ Sistema de rachas activo
```

### Validación Completa
```bash
npx tsx scripts/validate-streaks-production.ts full
```

**Incluye:**
- Estado de rachas de cada usuario
- Distribución de badges
- Últimas completaciones semanales
- Historial de puntos
- Recuperaciones de rachas
- Verificación de integridad del sistema

## 🔧 Configuración Avanzada

### Variables de Entorno Requeridas

**Desarrollo (.env):**
```env
DATABASE_URL="postgresql://..."
```

**Producción (.env.production):**
```env
DATABASE_URL="postgresql://..."
```

### Flags Disponibles

```bash
--dry-run           # Simular sin hacer cambios
--no-backup         # No crear backup de producción
--maintenance       # Activar modo mantenimiento durante sync
--reason="texto"    # Razón del mantenimiento
--duration="10min"  # Duración estimada
--validate-only     # Solo validar, no sincronizar
```

## 🚨 Casos de Emergencia

### Si Algo Sale Mal

1. **Detener inmediatamente** cualquier proceso de sync
2. **Verificar logs** en la consola para identificar el problema
3. **Restaurar desde backup** si es necesario:
   ```bash
   npx tsx scripts/restore-from-production-backup.ts
   ```
4. **Validar integridad** de datos restaurados
5. **Notificar** al equipo sobre el incidente

### Rollback Manual
```bash
# Restaurar desde el último backup
npx tsx scripts/restore-from-production-backup.ts

# Verificar que todo esté bien
npx tsx scripts/validate-streaks-production.ts full
```

## 📈 Métricas y Reportes

### Métricas de Sincronización
- Tiempo total de sincronización
- Número de registros nuevos/actualizados
- Tamaño de backup creado
- Estado de validaciones post-sync

### Reportes de Integridad
- Usuarios con rachas activas
- Badges otorgados
- Completaciones semanales
- Puntos acumulados
- Recuperaciones de rachas

## 🔄 Flujo de Trabajo Recomendado

### Antes de Sincronizar
1. ✅ Verificar que desarrollo esté estable
2. ✅ Hacer commit de cambios importantes
3. ✅ Comparar entornos: `npx tsx scripts/safe-sync-to-production.ts compare`
4. ✅ Hacer dry-run: `npx tsx scripts/safe-sync-to-production.ts dry-run`

### Durante la Sincronización
1. ✅ Ejecutar sync: `npx tsx scripts/safe-sync-to-production.ts sync`
2. ✅ Monitorear logs en tiempo real
3. ✅ Verificar que no hay errores críticos

### Después de Sincronizar
1. ✅ Validar usuarios: `npx tsx scripts/safe-sync-to-production.ts validate`
2. ✅ Verificar rachas: `npx tsx scripts/validate-streaks-production.ts quick`
3. ✅ Probar funcionalidades críticas en producción
4. ✅ Documentar cambios realizados

## 🎯 Beneficios del Sistema

### Seguridad
- ✅ **Cero riesgo** de pérdida de datos de usuarios
- ✅ Backup automático antes de cada operación
- ✅ Rollback automático en caso de problemas
- ✅ Validaciones múltiples de integridad

### Eficiencia
- ✅ Sincronización selectiva (solo contenido nuevo)
- ✅ Proceso automatizado y confiable
- ✅ Logs detallados para debugging
- ✅ Verificaciones rápidas de estado

### Confiabilidad
- ✅ Sistema probado y validado
- ✅ Múltiples capas de verificación
- ✅ Notificaciones en tiempo real
- ✅ Documentación completa

## 📞 Soporte

### Problemas Comunes
1. **Error de conexión**: Verificar variables de entorno
2. **Timeout**: Verificar conectividad de red
3. **Permisos**: Verificar acceso a bases de datos
4. **Espacio**: Verificar espacio disponible para backups

### Contacto
- Documentar cualquier problema encontrado
- Mantener logs de todas las operaciones
- Reportar inconsistencias inmediatamente

---

**Última actualización**: Enero 2025  
**Versión**: 1.0  
**Estado**: ✅ Implementado y Validado 